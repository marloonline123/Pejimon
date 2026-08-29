export interface PlanDto {
    id: string;
    name: string;
    displayName: string;
    slug: string;
    status?: string | null;
    interval?: string | null;
}
export interface ActiveOrganizationDto {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    role: string;
    permissions: Record<string, string[]>;
}
export interface UserSessionDto {
    id: string;
    name: string;
    username: string | null;
    email: string;
    image: string | null;
    hasActiveSubscription: boolean;
    needsOnboarding: boolean;
    organizationsCount: number;
    plan: PlanDto | null;
    activeOrganization: ActiveOrganizationDto | null;
    roles: string[];
    permissions: Record<string, string[]>;
}
export interface UserResponseDto {
    id: string;
    name: string;
    username: string | null;
    email: string;
    image: string | null;
}
//# sourceMappingURL=user.dto.d.ts.map