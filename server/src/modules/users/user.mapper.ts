import type {
  UserSessionDto,
  UserResponseDto,
  PlanDto,
  ActiveOrganizationDto,
} from "./user.dto.js";

export interface MapUserSessionParams {
  user: {
    id: string;
    name: string;
    email: string;
    username?: string | null;
    image?: string | null;
  };
  membership?: {
    role: string;
    organization: {
      id: string;
      name: string;
      slug: string;
      logo?: string | null;
    };
  } | null;
  rolePermissions?: Record<string, string[]>;
  roles?: string[];
  plan?: {
    id: string;
    name: string;
    displayName: string;
    slug: string;
    interval?: string | null;
  } | null;
  subscriptionStatus?: string | null;
  hasActiveSubscription: boolean;
  totalOrgsCount: number;
  needsOnboarding: boolean;
}

export function toUserResponse(user: {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  image?: string | null;
}): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    username: user.username ?? null,
    email: user.email,
    image: user.image ?? null,
  };
}

export function toUserSessionDto(params: MapUserSessionParams): UserSessionDto {
  const {
    user,
    membership,
    rolePermissions = {},
    roles = [],
    plan,
    subscriptionStatus,
    hasActiveSubscription,
    totalOrgsCount,
    needsOnboarding,
  } = params;

  let activeOrgDto: ActiveOrganizationDto | null = null;
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

  let planDto: PlanDto | null = null;
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
