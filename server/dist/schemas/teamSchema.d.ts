import z from "zod";
declare const teamSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    productOwnerUserId: z.ZodNumber;
    projectManagerUserId: z.ZodNumber;
    userIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export default teamSchema;
export type TeamSchema = z.infer<typeof teamSchema>;
//# sourceMappingURL=teamSchema.d.ts.map