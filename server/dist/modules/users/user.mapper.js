export function toUserResponse(user) {
    return {
        id: user.id,
        name: user.name,
        username: user.username ?? null,
        email: user.email,
        image: user.image ?? null,
    };
}
export function toUserSessionDto(params) {
    const { user, membership, rolePermissions = {}, roles = [], plan, subscriptionStatus, hasActiveSubscription, totalOrgsCount, needsOnboarding, } = params;
    let activeOrgDto = null;
    if (membership?.organization) {
        activeOrgDto = {
            id: membership.organization.id,
            name: membership.organization.name,
            slug: membership.organization.slug,
            logo: membership.organization.logo ?? null,
            role: membership.role,
            permissions: rolePermissions,
        };
    }
    let planDto = null;
    if (plan) {
        planDto = {
            id: plan.id,
            name: plan.name,
            displayName: plan.displayName,
            slug: plan.slug,
            status: subscriptionStatus ?? "active",
            interval: plan.interval ?? null,
        };
    }
    return {
        id: user.id,
        name: user.name,
        username: user.username ?? null,
        email: user.email,
        image: user.image ?? null,
        hasActiveSubscription,
        needsOnboarding,
        organizationsCount: totalOrgsCount,
        plan: planDto,
        activeOrganization: activeOrgDto,
        roles: roles.length > 0 ? roles : membership ? [membership.role] : [],
        permissions: rolePermissions,
    };
}
//# sourceMappingURL=user.mapper.js.map