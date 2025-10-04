import { GetByCodeUseCase } from "src/lib/planets/application/UseCases/getByCode.usecase";
import { PrismaPlanetRepository } from "src/lib/planets/infraestructure/database/repositories/prisma-planets.repository";

export const buildTransactionalServices = () => {
    return {
        planetService: {
            getByCode: new GetByCodeUseCase(
                new PrismaPlanetRepository()
            )
        }
    };
};
