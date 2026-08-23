import z from "zod";
declare const taskSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodString;
    priority: z.ZodString;
    tags: z.ZodOptional<z.ZodString>;
    startDate: z.ZodCoercedDate<unknown>;
    dueDate: z.ZodCoercedDate<unknown>;
    points: z.ZodOptional<z.ZodNumber>;
    projectId: z.ZodNumber;
    authorId: z.ZodNumber;
    assignedUserId: z.ZodNumber;
}, z.core.$strip>;
export default taskSchema;
export type TaskSchema = z.infer<typeof taskSchema>;
//# sourceMappingURL=taskSchema.d.ts.map