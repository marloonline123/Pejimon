import type { Request, Response } from "express";
import type { ProjectSchema, ProjectQuerySchema } from "../schemas/projectSchema.js";
export declare const index: (req: Request<{}, {}, {}, ProjectQuerySchema>, res: Response) => Promise<void>;
export declare const store: (req: Request<{}, {}, ProjectSchema>, res: Response) => Promise<void>;
export declare const show: (req: Request, res: Response) => Promise<void>;
export declare const update: (req: Request, res: Response) => Promise<void>;
export declare const destroy: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=projectController.d.ts.map