import z from "zod";
declare const projectSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    status: z.ZodEnum<{
        ToDo: 'ToDo';
        WorkInProgress: 'WorkInProgress';
        UnderReview: 'UnderReview';
        Completed: 'Completed';
    }>;
    startDate: z.ZodCoercedDate<unknown>;
    endDate: z.ZodCoercedDate<unknown>;
    teamIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export default projectSchema;
export type ProjectSchema = z.infer<typeof projectSchema>;
//# sourceMappingURL=projectSchema.d.ts.map