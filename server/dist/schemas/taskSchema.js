import z from "zod";
const taskSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().optional(),
    status: z.string(),
    priority: z.string(),
    tags: z.string().optional(),
    startDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    points: z.number().int().optional(),
    projectId: z.number().int(),
    authorId: z.number().int(),
    assignedUserId: z.number().int(),
});
export default taskSchema;
//# sourceMappingURL=taskSchema.js.map