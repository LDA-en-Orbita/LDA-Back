import { SynchronizeImagesUseCase } from "@src/lib/synchronize/application/UseCases/images/synchonize.usecase";
import { NasaSynchronizeRepository } from "@src/lib/synchronize/infraestructure/database/repository/nasa-syncrhonize.repository";
import { GetAllUseCase } from "src/lib/planets/application/UseCases/getAll.usecase";
import { GetByCodeUseCase } from "src/lib/planets/application/UseCases/getByCode.usecase";
import { PrismaPlanetRepository } from "src/lib/planets/infraestructure/database/repositories/prisma-planets.repository";
import { FindByPlanetUseCase } from "src/lib/space_missions/application/UseCases/findByPlanet.usecase";
import { getAllUseCase } from "src/lib/space_missions/application/UseCases/getAll.usecase";
import { PrismaSpaceMissionsRepository } from "src/lib/space_missions/infraestructure/database/repositories/prisma-space_missions.repository";

export const buildTransactionalServices = () => {
    return {
        planetService: {
            getByCode: new GetByCodeUseCase(
                new PrismaPlanetRepository()
            ),
            getAll: new GetAllUseCase(
                new PrismaPlanetRepository()
            )
        },
        spaceMissionsService: {
            getByPlanet: new FindByPlanetUseCase(
                new PrismaSpaceMissionsRepository()
            ),
            getAll: new getAllUseCase(
                new PrismaSpaceMissionsRepository()
            ),
        },
        synchronizeService: {
            images: new SynchronizeImagesUseCase(
                new NasaSynchronizeRepository()
            )
        }
    };
};
