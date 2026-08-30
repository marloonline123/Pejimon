import crypto from "crypto";
import prisma from "../lib/prismaClient.js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization, customSession } from "better-auth/plugins";
import ac from "./permissions.js";
import { toUserSessionDto } from "../modules/users/user.mapper.js";
const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const baseUsername = user.username ||
                        user.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
                    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
                    return {
                        data: {
                            ...user,
                            username: user.username ||
                                `${baseUsername}-${uniqueSuffix}`,
                        },
                    };
                },
                after: async (user) => {
                    // Auto-assign FREE plan on signup if one exists
                    try {
                        const freePlan = await prisma.plan.findFirst({
                            where: { price: 0, deletedAt: null },
                            orderBy: { createdAt: "asc" },
                        });
                        if (freePlan) {
                            const now = new Date();
                            await prisma.subscription.create({
                                data: {
                                    id: crypto.randomUUID(),
                                    planId: freePlan.id,
                                    referenceId: user.id,
                                    referenceModel: "user",
                                    status: "active",
                                    periodStart: now,
                                    periodEnd: new Date(now.getFullYear() + 100, now.getMonth(), now.getDate()),
                                    cancelAtPeriodEnd: false,
                                },
                            });
                        }
                    }
                    catch (err) {
                        console.error("Failed to auto-assign free plan:", err);
                    }
                },
            },
        },
        team: {
            create: {
                before: async (team) => {
                    const teamObj = team;
                    const baseSlug = (teamObj.name || "team")
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "-");
                    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
                    return {
                        data: {
                            ...team,
                            slug: teamObj.slug || `${baseSlug}-${uniqueSuffix}`,
                        },
                    };
                },
            },
        },
        session: {
            create: {
                before: async (session) => {
                    if (session.userId) {
                        // 1. Check if user has lastActiveOrganizationId in account
                        const account = await prisma.account.findFirst({
                            where: {
                                userId: session.userId,
                                lastActiveOrganizationId: { not: null },
                            },
                        });
                        if (account?.lastActiveOrganizationId) {
                            const isMember = await prisma.member.findFirst({
                                where: {
                                    userId: session.userId,
                                    organizationId: account.lastActiveOrganizationId,
                                },
                            });
                            if (isMember) {
                                return {
                                    data: {
                                        ...session,
                                        activeOrganizationId: account.lastActiveOrganizationId,
                                    },
                                };
                            }
                        }
                        // 2. If no valid lastActiveOrganizationId, pick user's first membership
                        const firstMembership = await prisma.member.findFirst({
                            where: { userId: session.userId },
                            orderBy: { createdAt: "asc" },
                        });
                        if (firstMembership) {
                            await prisma.account.updateMany({
                                where: { userId: session.userId },
                                data: {
                                    lastActiveOrganizationId: firstMembership.organizationId,
                                },
                            });
                            return {
                                data: {
                                    ...session,
                                    activeOrganizationId: firstMembership.organizationId,
                                },
                            };
                        }
                    }
                    return {
                        data: session,
                    };
                },
                after: async (session) => {
                    if (session.userId && session.id) {
                        const sessionObj = session;
                        let targetOrgId = sessionObj.activeOrganizationId;
                        if (!targetOrgId) {
                            const account = await prisma.account.findFirst({
                                where: {
                                    userId: session.userId,
                                    lastActiveOrganizationId: { not: null },
                                },
                            });
                            if (account?.lastActiveOrganizationId) {
                                const isMember = await prisma.member.findFirst({
                                    where: {
                                        userId: session.userId,
                                        organizationId: account.lastActiveOrganizationId,
                                    },
                                });
                                if (isMember) {
                                    targetOrgId = account.lastActiveOrganizationId;
                                }
                            }
                            if (!targetOrgId) {
                                const firstMembership = await prisma.member.findFirst({
                                    where: { userId: session.userId },
                                    orderBy: { createdAt: "asc" },
                                });
                                if (firstMembership) {
                                    targetOrgId = firstMembership.organizationId;
                                    await prisma.account.updateMany({
                                        where: { userId: session.userId },
                                        data: {
                                            lastActiveOrganizationId: targetOrgId,
                                        },
                                    });
                                }
                            }
                        }
                        if (targetOrgId) {
                            await prisma.session.update({
                                where: { id: session.id },
                                data: {
                                    activeOrganizationId: targetOrgId,
                                },
                            }).catch(() => { });
                            sessionObj.activeOrganizationId = targetOrgId;
                            session.activeOrganizationId = targetOrgId;
                        }
                    }
                },
            },
            update: {
                after: async (session) => {
                    const sessionObj = session;
                    const activeOrgId = sessionObj.activeOrganizationId;
                    if (activeOrgId && sessionObj.userId) {
                        await prisma.account.updateMany({
                            where: { userId: sessionObj.userId },
                            data: {
                                lastActiveOrganizationId: activeOrgId,
                            },
                        });
                    }
                },
            },
        },
    },
    trustedOrigins: [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    plugins: [
        organization({
            schema: {
                organization: {
                    additionalFields: {
                        description: {
                            type: "string",
                            required: false,
                            input: true,
                        },
                        updatedAt: {
                            type: "date",
                            required: false,
                            input: false,
                        },
                        deletedAt: {
                            type: "date",
                            required: false,
                            input: false,
                        },
                    },
                },
                team: {
                    additionalFields: {
                        description: {
                            type: "string",
                            required: false,
                            input: true,
                        },
                        slug: {
                            type: "string",
                            required: true,
                            input: true,
                        },
                        deletedAt: {
                            type: "date",
                            required: false,
                            input: false,
                        },
                    },
                },
            },
            teams: {
                enabled: true,
                defaultTeam: {
                    enabled: false,
                },
            },
            ac: ac,
            dynamicAccessControl: {
                enabled: true,
            },
        }),
        customSession(async ({ user, session }) => {
            // 1. Fetch user subscription and plan
            const subscription = await prisma.subscription.findFirst({
                where: {
                    referenceId: user.id,
                    status: "active",
                },
                include: {
                    plan: true,
                },
            });
            // 2. Fetch user memberships and total orgs count
            const [memberships, totalOrgsCount] = await Promise.all([
                prisma.member.findMany({
                    where: { userId: user.id },
                    include: { organization: true },
                }),
                prisma.member.count({
                    where: { userId: user.id },
                }),
            ]);
            const sessionData = session;
            let activeOrgId = sessionData.activeOrganizationId || null;
            if (!activeOrgId && user.id) {
                const account = await prisma.account.findFirst({
                    where: { userId: user.id, lastActiveOrganizationId: { not: null } },
                });
                if (account?.lastActiveOrganizationId &&
                    memberships.some((m) => m.organizationId === account.lastActiveOrganizationId)) {
                    activeOrgId = account.lastActiveOrganizationId;
                }
                else if (memberships.length > 0 && memberships[0]) {
                    activeOrgId = memberships[0].organizationId;
                }
                // Persist to session and account in database so they remain in sync
                if (activeOrgId) {
                    sessionData.activeOrganizationId = activeOrgId;
                    session.activeOrganizationId = activeOrgId;
                    if (session.id) {
                        await Promise.all([
                            prisma.session
                                .update({
                                where: { id: session.id },
                                data: { activeOrganizationId: activeOrgId },
                            })
                                .catch(() => { }),
                            prisma.account
                                .updateMany({
                                where: { userId: user.id },
                                data: { lastActiveOrganizationId: activeOrgId },
                            })
                                .catch(() => { }),
                        ]);
                    }
                }
            }
            const activeMembership = activeOrgId
                ? memberships.find((m) => m.organizationId === activeOrgId) || null
                : null;
            let rolePermissions = {};
            let roles = [];
            if (activeMembership) {
                roles = [activeMembership.role];
                const orgRole = await prisma.organizationRole.findFirst({
                    where: {
                        organizationId: activeMembership.organizationId,
                        role: activeMembership.role,
                    },
                });
                if (orgRole?.permission) {
                    try {
                        rolePermissions = JSON.parse(orgRole.permission);
                    }
                    catch {
                        rolePermissions = {};
                    }
                }
                else if (activeMembership.role === "owner" ||
                    activeMembership.role === "admin") {
                    rolePermissions = {
                        organization: ["create", "read", "update", "delete", "share"],
                        project: ["create", "read", "update", "delete", "share"],
                        user: ["read", "update", "delete", "share"],
                        team: ["create", "read", "update", "delete", "share"],
                        task: ["create", "read", "update", "delete", "share"],
                        milestone: ["create", "read", "update", "delete", "share"],
                        comment: ["create", "read", "update", "delete", "share"],
                        attachment: ["create", "read", "update", "delete", "share"],
                        timeEntry: ["create", "read", "update", "delete", "share"],
                        client: ["create", "read", "update", "delete", "share"],
                        conversation: ["create", "read", "update", "delete", "share"],
                        message: ["create", "read", "update", "delete", "share"],
                        notification: ["read", "update", "delete", "share"],
                        activity: ["read", "update", "delete", "share"],
                        projectTemplate: ["create", "read", "update", "delete", "share"],
                        member: ["create", "read", "update", "delete", "share"],
                        invitation: ["create", "read", "update", "delete", "share"],
                    };
                }
            }
            const customUser = toUserSessionDto({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username ?? null,
                    image: user.image ?? null,
                },
                membership: activeMembership
                    ? {
                        role: activeMembership.role,
                        organization: activeMembership.organization,
                    }
                    : null,
                rolePermissions,
                roles,
                plan: subscription?.plan ?? null,
                subscriptionStatus: subscription?.status ?? null,
                hasActiveSubscription: !!subscription,
                totalOrgsCount,
                needsOnboarding: totalOrgsCount === 0,
            });
            return {
                user: customUser,
                session,
            };
        }),
    ],
});
export default auth;
//# sourceMappingURL=auth.js.map