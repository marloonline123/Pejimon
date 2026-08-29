import type { TeamResponseDto, TeamMemberDto } from "./team.dto.js";
import { toUserResponse } from "@/modules/users/user.mapper.js";

export function toTeamMemberDto(member: any): TeamMemberDto {
  return {
    userId: member.userId,
    teamId: member.teamId,
    role: member.role,
    user: member.user ? toUserResponse(member.user) : null,
    createdAt: member.createdAt,
  };
}

export function toTeamResponseDto(team: any): TeamResponseDto {
  const members = Array.isArray(team.teamMembers)
    ? team.teamMembers.map(toTeamMemberDto)
    : [];

  const manager = members.find((m: TeamMemberDto) => m.role === "MANAGER");

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

export function toTeamListResponseDto(teams: any[]): TeamResponseDto[] {
  return teams.map(toTeamResponseDto);
}
