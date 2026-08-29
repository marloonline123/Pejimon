import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { getTenantId } from "./tenant-context.js";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const TENANT_MODELS = [
    "Project",
    "Task",
    "Team",
    "Comment",
    "Attachment",
];
export const prismaTanentAware = prisma.$extends({
    query: {
        $allModels: {
            async findMany({ args, query }) {
                args.where = {
                    ...args.where,
                    organizationId: getTenantId(),
                };
                return query(args);
            },
            async count({ args, query }) {
                args.where = {
                    ...args.where,
                    organizationId: getTenantId(),
                };
                return query(args);
            },
            async findFirst({ args, query }) {
                args.where = {
                    ...args.where,
                    organizationId: getTenantId(),
                };
                return query(args);
            },
            async findUnique({ args, query }) {
                // handle carefully; unique queries need special treatment
                return query(args);
            },
            async create({ args, query }) {
                args.data = {
                    ...args.data,
                    organizationId: getTenantId(),
                };
                return query(args);
            },
            async update({ args, query }) {
                args.where = {
                    ...args.where,
                    organizationId: getTenantId(),
                };
                return query(args);
            },
            async delete({ args, query }) {
                args.where = {
                    ...args.where,
                    organizationId: getTenantId(),
                };
                return query(args);
            },
        },
    },
});
export default prisma;
//# sourceMappingURL=prismaClient.js.map