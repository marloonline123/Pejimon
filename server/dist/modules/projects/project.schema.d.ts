import z from "zod";
export declare const ProjectStatusEnum: z.ZodEnum<{
    ACTIVE: "ACTIVE";
    ARCHIVED: "ARCHIVED";
    COMPLETED: "COMPLETED";
    ON_HOLD: "ON_HOLD";
    PLANNING: "PLANNING";
}>;
declare const projectSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        ARCHIVED: "ARCHIVED";
        COMPLETED: "COMPLETED";
        ON_HOLD: "ON_HOLD";
        PLANNING: "PLANNING";
    }>;
    startDate: z.ZodCoercedDate<unknown>;
    endDate: z.ZodCoercedDate<unknown>;
    organizationId: z.ZodOptional<z.ZodString>;
    teamIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
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
//# sourceMappingURL=project.schema.d.ts.map