import { toUserResponse } from "../../modules/users/user.mapper.js";
export function toTeamMemberDto(member) {
    return {
        userId: member.userId,
        teamId: member.teamId,
        role: member.role,
        user: member.user ? toUserResponse(member.user) : null,
        createdAt: member.createdAt,
    };
}
export function toTeamResponseDto(team) {
    const members = Array.isArray(team.teamMembers)
        ? team.teamMembers.map(toTeamMemberDto)
        : [];
    const manager = members.find((m) => m.role === "MANAGER");
    return {
        id: team.id,
        name: team.name,
        slug: team.slug,
        description: team.description ?? null,
        organizationId: team.organizationId,
        managerId: manager?.userId ?? null,
        memberCount: team.memberCount ?? members.length,
        teamMembers: members,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
    };
}
export function toTeamListResponseDto(teams) {
    return teams.map(toTeamResponseDto);
}
//# sourceMappingURL=team.mapper.js.map