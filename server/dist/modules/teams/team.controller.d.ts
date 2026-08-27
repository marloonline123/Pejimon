import type { Request, Response } from "express";
import type { TeamSchema, TeamQuerySchema } from "../../modules/teams/team.schema.js";
export declare const index: (req: Request<{}, {}, {}, TeamQuerySchema>, res: Response) => Promise<void>;
export declare const store: (req: Request<{}, {}, TeamSchema>, res: Response) => Promise<void>;
export declare const show: (req: Request, res: Response) => Promise<void>;
export declare const update: (req: Request, res: Response) => Promise<void>;
export declare const destroy: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=team.controller.d.ts.map