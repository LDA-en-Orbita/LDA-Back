import { prismaClient } from "@config/database/prisma/prisma";
import { buildTransactionalServices } from "../serviceContainer";
import { Prisma } from "@prisma/client";

export const withServicesTransaction = async <T>(
  callback: (
    services: ReturnType<typeof buildTransactionalServices>
  ) => Promise<T>
): Promise<T> => {
  return await prismaClient.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const services = buildTransactionalServices();
      return await callback(services);
    },
    {
      timeout: 60000,
    }
  );
};
