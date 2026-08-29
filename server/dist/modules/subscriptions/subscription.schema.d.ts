import { z } from "zod";
export declare const subscribeSchema: z.ZodObject<{
    planId: z.ZodString;
}, z.core.$strip>;
export type SubscribeSchema = z.infer<typeof subscribeSchema>;
export default subscribeSchema;
//# sourceMappingURL=subscription.schema.d.ts.map