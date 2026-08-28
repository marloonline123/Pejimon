import type { Request, Response } from "express";
import type { SubscribeSchema } from "./subscription.schema.js";
export declare const getPlans: (_req: Request, res: Response) => Promise<void>;
export declare const subscribe: (req: Request<{}, {}, SubscribeSchema>, res: Response) => Promise<void>;
export declare const getMySubscription: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=subscription.controller.d.ts.map