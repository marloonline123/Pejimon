import z from "zod";
declare const projectSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    status: z.ZodEnum<{
        active: "active";
        canceled: "canceled";
        completed: "completed";
        inactive: "inactive";
    }>;
    startDate: z.ZodCoercedDate<unknown>;
    endDate: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export default projectSchema;
export type ProjectSchema = z.infer<typeof projectSchema>;
//# sourceMappingURL=projectSchema.d.ts.map