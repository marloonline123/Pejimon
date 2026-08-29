import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
declare const prisma: PrismaClient<{
    adapter: PrismaPg;
}, never, import("@prisma/client/runtime/client").DefaultArgs>;
export declare const prismaTanentAware: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
    result: {};
    model: {};
    query: {};
    client: {};
}, {}>, import("@prisma/client").Prisma.TypeMapCb<{
    adapter: PrismaPg;
}>, {
    result: {};
    model: {};
    query: {};
    client: {};
}>;
export default prisma;
//# sourceMappingURL=prismaClient.d.ts.map