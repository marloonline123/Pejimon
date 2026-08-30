import z from "zod";
const teamSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().optional(),
    organizationId: z.string().optional(),
    managerId: z.string().nonempty("Manager is required"),
    userIds: z.array(z.string()).optional(),
});
export const teamQuerySchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).optional(),
});
export const teamMemberQuerySchema = z.object({
    search: z.string().optional(),
    role: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).optional(),
});
export const teamProjectQuerySchema = z.object({
    search: z.string().optional(),
    status: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).optional(),
});
export const teamTaskQuerySchema = z.object({
    search: z.string().optional(),
    status: z.string().optional(),
    priority: z.string().optional(),
    userId: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).optional(),
});
export default teamSchema;
//# sourceMappingURL=team.schema.js.map