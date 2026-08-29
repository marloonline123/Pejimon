import { AsyncLocalStorage } from "node:async_hooks";

const tenantStorage = new AsyncLocalStorage<{
  organizationId: string;
}>();

export const setTenantContext = (
  organizationId: string,
  callback: () => void,
) => {
  tenantStorage.run({ organizationId }, callback);
};

export const getTenantId = (): string => {
  const context = tenantStorage.getStore();

  if (!context?.organizationId) {
    throw new Error("Tenant context not found");
  }

  return context.organizationId;
};
