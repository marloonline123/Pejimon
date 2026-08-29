import { AsyncLocalStorage } from "node:async_hooks";
const tenantStorage = new AsyncLocalStorage();
export const setTenantContext = (organizationId, callback) => {
    tenantStorage.run({ organizationId }, callback);
};
export const getTenantId = () => {
    const context = tenantStorage.getStore();
    if (!context?.organizationId) {
        throw new Error("Tenant context not found");
    }
    return context.organizationId;
};
//# sourceMappingURL=tenant-context.js.map