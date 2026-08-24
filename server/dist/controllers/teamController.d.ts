import type { Request, Response } from "express";
import type { TeamSchema } from "../schemas/teamSchema.js";
export declare const index: (req: Request, res: Response) => Promise<void>;
export declare const store: (req: Request<{}, {}, TeamSchema>, res: Response) => Promise<void>;
export declare const show: (req: Request, res: Response) => Promise<void>;
export declare const update: (req: Request, res: Response) => Promise<void>;
export declare const destroy: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=teamController.d.ts.map