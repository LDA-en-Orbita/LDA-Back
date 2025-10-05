import { buildTransactionalServices } from "../serviceContainer";

export const withServicesTransaction = async <T>(
    callback: (
        services: ReturnType<typeof buildTransactionalServices>
    ) => Promise<T>
): Promise<T> => {
    const services = buildTransactionalServices();
    return await callback(services);
};
