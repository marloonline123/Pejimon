import z from "zod";
const teamSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().optional(),
    teamManagerId: z.number({ error: "Team Manager ID is required" }),
    userIds: z.array(z.number()).optional(),
});
export const teamQuerySchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).optional(),
});
export default teamSchema;
//# sourceMappingURL=teamSchema.js.map