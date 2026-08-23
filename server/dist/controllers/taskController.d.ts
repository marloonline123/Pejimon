import type { Request, Response } from "express";
import type { TaskSchema } from "../schemas/taskSchema.js";
export declare const index: (req: Request, res: Response) => Promise<void>;
export declare const store: (req: Request<{}, {}, TaskSchema>, res: Response) => Promise<void>;
export declare const show: (req: Request, res: Response) => Promise<void>;
export declare const update: (req: Request, res: Response) => Promise<void>;
export declare const destroy: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=taskController.d.ts.map