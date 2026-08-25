import z from "zod";
declare const taskSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        ToDo: 'ToDo';
        WorkInProgress: 'WorkInProgress';
        UnderReview: 'UnderReview';
        Completed: 'Completed';
    }>;
    priority: z.ZodString;
    tags: z.ZodOptional<z.ZodString>;
    startDate: z.ZodCoercedDate<unknown>;
    dueDate: z.ZodCoercedDate<unknown>;
    points: z.ZodOptional<z.ZodNumber>;
    projectId: z.ZodNumber;
    authorId: z.ZodNumber;
    assignedUserId: z.ZodNumber;
}, z.core.$strip>;
export declare const taskQuerySchema: z.ZodObject<{
    projectSlug: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export default taskSchema;
export type TaskSchema = z.infer<typeof taskSchema>;
export type TaskQuerySchema = z.infer<typeof taskQuerySchema>;
//# sourceMappingURL=taskSchema.d.ts.map