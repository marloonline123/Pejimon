import { z } from "zod";
export declare const organizationSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    logo: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const organizationQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type OrganizationSchema = z.infer<typeof organizationSchema>;
export type OrganizationQuerySchema = z.infer<typeof organizationQuerySchema>;
export default organizationSchema;
//# sourceMappingURL=organization.schema.d.ts.map