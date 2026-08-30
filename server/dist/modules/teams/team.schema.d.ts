import z from "zod";
declare const teamSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    managerId: z.ZodString;
    userIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const teamQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const teamMemberQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const teamProjectQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const teamTaskQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export default teamSchema;
export type TeamSchema = z.infer<typeof teamSchema>;
export type TeamQuerySchema = z.infer<typeof teamQuerySchema>;
export type TeamMemberQuerySchema = z.infer<typeof teamMemberQuerySchema>;
export type TeamProjectQuerySchema = z.infer<typeof teamProjectQuerySchema>;
export type TeamTaskQuerySchema = z.infer<typeof teamTaskQuerySchema>;
//# sourceMappingURL=team.schema.d.ts.map