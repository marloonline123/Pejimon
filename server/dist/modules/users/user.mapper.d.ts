import type { UserSessionDto, UserResponseDto } from "./user.dto.js";
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
export declare function toUserResponse(user: {
    id: string;
    name: string;
    email: string;
    username?: string | null;
    image?: string | null;
}): UserResponseDto;
export declare function toUserSessionDto(params: MapUserSessionParams): UserSessionDto;
//# sourceMappingURL=user.mapper.d.ts.map