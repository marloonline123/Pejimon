import z from "zod";
const projectSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().min(3, "Description must be at least 3 characters long"),
    status: z.enum(["active", "inactive", "canceled", "completed"]),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
});
export default projectSchema;
//# sourceMappingURL=projectSchema.js.map