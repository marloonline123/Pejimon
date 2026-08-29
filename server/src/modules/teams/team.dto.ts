import type { UserResponseDto } from "@/modules/users/user.dto.js";

export interface TeamMemberDto {
  userId: string;
  teamId: string;
  role: string;
  user?: UserResponseDto | null;
  createdAt?: Date | string;
}

export interface TeamResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  organizationId: string;
  managerId: string | null;
  memberCount: number;
  teamMembers: TeamMemberDto[];
  createdAt: Date | string;
  updatedAt?: Date | string;
}
