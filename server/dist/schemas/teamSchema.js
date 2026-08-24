import z from "zod";
const teamSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().optional(),
    productOwnerUserId: z.number({ required_error: "Product Owner ID is required" }),
    projectManagerUserId: z.number({ required_error: "Project Manager ID is required" }),
    userIds: z.array(z.number()).optional(),
});
export default teamSchema;
//# sourceMappingURL=teamSchema.js.map