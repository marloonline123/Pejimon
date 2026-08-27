import z from "zod";
export const TaskStatusEnum = z.enum([
    "TODO",
    "IN_PROGRESS",
    "UNDER_REVIEW",
    "COMPLETED",
    "CANCELLED",
    "ToDo",
    "WorkInProgress",
    "UnderReview",
    "Completed",
]);
export const TaskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
const taskSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().optional(),
    status: TaskStatusEnum,
    priority: TaskPriorityEnum.or(z.string()),
    tags: z.string().optional(),
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    points: z.number().int().optional(),
    estimatedHours: z.number().optional(),
    projectId: z.number().int(),
    authorId: z.string().optional(),
    assignedUserId: z.string().optional(),
    assignedUserIds: z.array(z.string()).optional(),
});
export const taskQuerySchema = z.object({
    projectSlug: z.string().optional(),
    search: z.string().optional(),
    status: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).optional(),
});
export default taskSchema;
//# sourceMappingURL=task.schema.js.map