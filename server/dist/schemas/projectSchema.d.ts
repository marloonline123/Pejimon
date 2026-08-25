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
export declare const projectQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export default projectSchema;
export type ProjectSchema = z.infer<typeof projectSchema>;
export type ProjectQuerySchema = z.infer<typeof projectQuerySchema>;
//# sourceMappingURL=projectSchema.d.ts.map