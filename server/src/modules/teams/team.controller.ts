import type { Request, Response } from "express";
import auth from "@/config/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import prisma, { prismaTanentAware } from "@/lib/prismaClient.js";
import type {
  TeamSchema,
  TeamQuerySchema,
} from "@/modules/teams/team.schema.js";
import {
  toTeamResponseDto,
  toTeamListResponseDto,
} from "@/modules/teams/team.mapper.js";
import { getTenantId } from "@/lib/tenant-context.js";

export const index = async (
  req: Request<{}, {}, {}, TeamQuerySchema>,
  res: Response,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search;
    const organizationId = res.locals.session?.activeOrganizationId;

    // Use Better-Auth API to list organization teams
    const teams = await auth.api.listOrganizationTeams({
      query: {
        organizationId: organizationId,
      },
      headers: fromNodeHeaders(req.headers),
    });

    let filteredTeams = Array.isArray(teams) ? teams : [];
    if (search) {
      filteredTeams = filteredTeams.filter((t: any) =>
        t.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const teamIds = filteredTeams.map((t: any) => t.id);
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        teamId: { in: teamIds },
      },
      include: {
        user: true,
      },
    });

    const total = filteredTeams.length;
    const skip = (page - 1) * limit;
    const paginatedTeams = filteredTeams
      .slice(skip, skip + limit)
      .map((t: any) => ({
        ...t,
        teamMembers: teamMembers.filter((tm) => tm.teamId === t.id),
      }));

    console.log("team: ", teams);

    res.status(200).json({
      success: true,
      data: toTeamListResponseDto(paginatedTeams),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Better-Auth Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const store = async (
  req: Request<{}, {}, TeamSchema>,
  res: Response,
): Promise<void> => {
  try {
    const organizationId = getTenantId();
    const managerId = req.body.managerId;
    const userIds = (req.body.userIds || []).filter((id) => id !== managerId);

    // Create team via Better-Auth organization plugin
    const team = await auth.api.createTeam({
      body: {
        name: req.body.name,
        organizationId: organizationId,
        slug:
          req.body.name.toLowerCase().replace(/\s+/g, "-") +
          "-" +
          Date.now().toString().slice(-4),
        description: req.body.description ?? null,
      } as any,
      headers: fromNodeHeaders(req.headers),
    });

    const teamMembersData: {
      organizationId: string;
      teamId: string;
      userId: string;
      role: string;
      membershipKey?: string;
    }[] = [];

    if (managerId) {
      teamMembersData.push({
        organizationId: organizationId,
        teamId: team.id,
        userId: managerId,
        role: "MANAGER",
        membershipKey: `${team.id}:${managerId}`,
      });
    }

    for (const uId of userIds) {
      teamMembersData.push({
        organizationId: organizationId,
        teamId: team.id,
        userId: uId,
        role: "MEMBER",
        membershipKey: `${team.id}:${uId}`,
      });
    }

    if (teamMembersData.length > 0) {
      await prisma.teamMember.createMany({
        data: teamMembersData,
        skipDuplicates: true,
      });
    }

    const fullTeam = await prismaTanentAware.team.findFirst({
      where: { id: team.id },
      include: {
        teamMembers: {
          include: { user: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      flash: {
        success: "Team created successfully",
      },
      data: toTeamResponseDto(fullTeam || team),
    });
  } catch (error) {
    console.error("Team Store Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const team = await prismaTanentAware.team.findFirst({
      where: {
        slug: slug,
      },
      include: {
        teamMembers: {
          include: { user: true },
        },
        projectTeams: {
          include: { project: true },
        },
      },
    });

    if (!team) {
      res.status(404).json({
        success: false,
        message: "Team not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: toTeamResponseDto(team),
    });
  } catch (error) {
    console.error("Team Show Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const existing = await prismaTanentAware.team.findFirst({
      where: { slug },
    });
    if (!existing) {
      res.status(404).json({ success: false, message: "Team not found" });
      return;
    }

    // Update team via Better-Auth organization plugin
    await auth.api.updateTeam({
      body: {
        teamId: existing.id,
        data: {
          name: req.body.name,
          description: req.body.description ?? null,
        } as any,
      },
      headers: fromNodeHeaders(req.headers),
    });

    const managerId = req.body.managerId;
    const userIds = req.body.userIds;

    if (userIds !== undefined || managerId !== undefined) {
      await prisma.teamMember.deleteMany({
        where: { teamId: existing.id },
      });

      const teamMembersData: {
        organizationId: string;
        teamId: string;
        userId: string;
        role: string;
        membershipKey?: string;
      }[] = [];

      if (managerId) {
        teamMembersData.push({
          organizationId: existing.organizationId,
          teamId: existing.id,
          userId: managerId,
          role: "MANAGER",
          membershipKey: `${existing.id}:${managerId}`,
        });
      }

      if (userIds) {
        for (const uId of userIds) {
          if (uId !== managerId) {
            teamMembersData.push({
              organizationId: existing.organizationId,
              teamId: existing.id,
              userId: uId,
              role: "MEMBER",
              membershipKey: `${existing.id}:${uId}`,
            });
          }
        }
      }

      if (teamMembersData.length > 0) {
        await prisma.teamMember.createMany({
          data: teamMembersData,
          skipDuplicates: true,
        });
      }
    }

    const updatedTeam = await prismaTanentAware.team.findFirst({
      where: { id: existing.id },
      include: {
        teamMembers: {
          include: { user: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      flash: {
        success: "Team updated successfully",
      },
      data: toTeamResponseDto(updatedTeam || existing),
    });
  } catch (error) {
    console.error("Team Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const organizationId = res.locals.session?.activeOrganizationId;
    const existing = await prismaTanentAware.team.findFirst({
      where: { slug },
    });
    if (!existing) {
      res.status(404).json({ success: false, message: "Team not found" });
      return;
    }

    // Remove team via Better-Auth organization plugin
    await auth.api.removeTeam({
      body: {
        teamId: existing.id,
        organizationId: organizationId,
      },
      headers: fromNodeHeaders(req.headers),
    });

    res.status(200).json({
      success: true,
      flash: {
        success: "Team deleted successfully",
      },
      data: toTeamResponseDto(existing),
    });
  } catch (error) {
    console.error("Better-Auth Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
