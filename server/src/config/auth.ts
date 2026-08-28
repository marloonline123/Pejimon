import crypto from "crypto";
import prisma from "../lib/prismaClient.js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization, customSession } from "better-auth/plugins";
import ac from "./permissions.js";
import { toUserSessionDto } from "@/modules/users/user.mapper.js";

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
          const baseUsername =
            ((user as Record<string, unknown>).username as string) ||
            user.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
          const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
          return {
            data: {
              ...user,
              username:
                ((user as Record<string, unknown>).username as string) ||
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
                  periodEnd: new Date(
                    now.getFullYear() + 100,
                    now.getMonth(),
                    now.getDate(),
                  ),
                  cancelAtPeriodEnd: false,
                },
              });
            }
          } catch (err) {
            console.error("Failed to auto-assign free plan:", err);
          }
        },
      },
    },
    team: {
      create: {
        before: async (team: any) => {
          const teamObj = team as Record<string, unknown>;
          const baseSlug = ((teamObj.name as string) || "team")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-");
          const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
          return {
            data: {
              ...team,
              slug: (teamObj.slug as string) || `${baseSlug}-${uniqueSuffix}`,
            },
          };
        },
      },
    },
  },

  trustedOrigins: [process.env.FRONTEND_URL!],

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
        enabled: false,
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

      const sessionData = session as Record<string, unknown>;
      const activeOrgId =
        (sessionData.activeOrganizationId as string | undefined) ||
        memberships[0]?.organizationId;
      const activeMembership =
        memberships.find((m) => m.organizationId === activeOrgId) ||
        memberships[0] ||
        null;

      let rolePermissions: Record<string, string[]> = {};
      let roles: string[] = [];

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
          } catch {
            rolePermissions = {};
          }
        } else if (
          activeMembership.role === "owner" ||
          activeMembership.role === "admin"
        ) {
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
          username:
            ((user as Record<string, unknown>).username as string) ?? null,
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
