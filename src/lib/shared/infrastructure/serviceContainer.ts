import { Prisma } from "@prisma/client";

export const buildTransactionalServices = (tx: Prisma.TransactionClient) => {
    return {
        PlanetService: {
            getByCode: {

            }
        }
    };
};
