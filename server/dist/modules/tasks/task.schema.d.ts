import z from "zod";
export declare const TaskStatusEnum: z.ZodEnum<{
    CANCELLED: "CANCELLED";
    COMPLETED: "COMPLETED";
    Completed: "Completed";
    IN_PROGRESS: "IN_PROGRESS";
    TODO: "TODO";
    ToDo: "ToDo";
    UNDER_REVIEW: "UNDER_REVIEW";
    UnderReview: "UnderReview";
    WorkInProgress: "WorkInProgress";
}>;
export declare const TaskPriorityEnum: z.ZodEnum<{
    HIGH: "HIGH";
    LOW: "LOW";
    MEDIUM: "MEDIUM";
    URGENT: "URGENT";
}>;
declare const taskSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        CANCELLED: "CANCELLED";
        COMPLETED: "COMPLETED";
        Completed: "Completed";
        IN_PROGRESS: "IN_PROGRESS";
        TODO: "TODO";
        ToDo: "ToDo";
        UNDER_REVIEW: "UNDER_REVIEW";
        UnderReview: "UnderReview";
        WorkInProgress: "WorkInProgress";
    }>;
    priority: z.ZodUnion<[z.ZodEnum<{
        HIGH: "HIGH";
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        URGENT: "URGENT";
    }>, z.ZodString]>;
    tags: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    dueDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    points: z.ZodOptional<z.ZodNumber>;
    estimatedHours: z.ZodOptional<z.ZodNumber>;
    projectId: z.ZodNumber;
    authorId: z.ZodOptional<z.ZodNumber>;
    assignedUserId: z.ZodOptional<z.ZodNumber>;
    assignedUserIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
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
//# sourceMappingURL=task.schema.d.ts.map