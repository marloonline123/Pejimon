import z from "zod";
declare const teamSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    teamManagerId: z.ZodNumber;
    userIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export declare const teamQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export default teamSchema;
export type TeamSchema = z.infer<typeof teamSchema>;
export type TeamQuerySchema = z.infer<typeof teamQuerySchema>;
//# sourceMappingURL=teamSchema.d.ts.map