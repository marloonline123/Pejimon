export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    profilePicturePath?: string;
    createdAt: string;
}

export interface Project {
    id: number;
    name: string;
    slug: string;
    description?: string;
    status: Status;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    userId: number;
    projectTeams?: { teamId: number, team?: Team }[];
}

export interface Team {
    id: number;
    name: string;
    slug: string;
    description?: string;
    teamManagerId: number;
    createdAt: string;
}

export interface TeamUser {
    userId: number;
    teamId: number;
}

export enum Status {
    ToDo = "ToDo",
    WorkInProgress = "WorkInProgress",
    UnderReview = "UnderReview",
    Completed = "Completed"
}

export enum Priority {
    Urgent = "Urgent",
    High = "High",
    Medium = "Medium",
    Low = "Low",
    Backlog = "Backlog"
}

export interface Task {
    id: number;
    name: string;
    slug: string;
    description?: string;
    status: Status | string;
    priority: Priority | string;
    tags?: string;
    startDate: string;
    dueDate: string;
    points: number;
    projectId: number;
    authorId: number;
    assignedUserId: number;
    createdAt: string;
}

export interface ProjectTeam {
    projectId: number;
    teamId: number;
}

export interface TaskAssignment {
    id: number;
    description?: string;
    taskId: number;
    userId: number;
    parentId?: number;
    createdAt: string;
}

export interface Comment {
    id: number;
    body: string;
    taskId: number;
    userId: number;
    parentId?: number;
    createdAt: string;
}

export interface Attachment {
    id: number;
    name?: string;
    path?: string;
    taskId: number;
    userId: number;
    createdAt: string;
}

export interface Plan {
    id: string;
    name: string;
    displayName: string;
    slug: string;
    description?: string | null;
    price: number;
    interval: string;
    features?: string[] | string | null;
    status?: string | null;
}

export interface Subscription {
    id: string;
    planId: string;
    referenceId: string;
    referenceModel: string;
    status: string;
    periodStart: string;
    periodEnd: string;
    cancelAtPeriodEnd: boolean;
    plan?: Plan;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    description?: string | null;
    metadata?: string | null;
    createdAt?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    flash?: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
    };
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
