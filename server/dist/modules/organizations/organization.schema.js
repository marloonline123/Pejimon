import { z } from "zod";
export const organizationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    description: z.string().optional().nullable(),
    logo: z.string().optional().nullable(),
    metadata: z.string().optional().nullable(),
});
export const organizationQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 20)),
    search: z.string().optional(),
});
export default organizationSchema;
//# sourceMappingURL=organization.schema.js.map