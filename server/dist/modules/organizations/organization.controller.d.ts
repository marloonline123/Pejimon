import type { Request, Response } from "express";
import type { OrganizationSchema, OrganizationQuerySchema } from "../../modules/organizations/organization.schema.js";
export declare const index: (req: Request<{}, {}, OrganizationQuerySchema>, res: Response) => Promise<void>;
export declare const show: (req: Request<{
    slug: string;
}>, res: Response) => Promise<void>;
export declare const store: (req: Request<{}, {}, OrganizationSchema>, res: Response) => Promise<void>;
export declare const update: (req: Request<{
    slug: string;
}, {}, Partial<OrganizationSchema>>, res: Response) => Promise<void>;
export declare const destroy: (req: Request<{
    slug: string;
}>, res: Response) => Promise<void>;
//# sourceMappingURL=organization.controller.d.ts.map