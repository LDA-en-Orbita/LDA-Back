import { SynchronizeImagesUseCase } from "@src/lib/synchronize/application/UseCases/images/synchonize.usecase";
import { NasaSynchronizeRepository } from "@src/lib/synchronize/infraestructure/database/repository/nasa-syncrhonize.repository";
import { GetAllUseCase } from "src/lib/planets/application/UseCases/getAll.usecase";
import { GetByCodeUseCase } from "src/lib/planets/application/UseCases/getByCode.usecase";
import { PrismaPlanetRepository } from "src/lib/planets/infraestructure/database/repositories/prisma-planets.repository";
import { FindByPlanetUseCase as spaceMissionsUseCase } from "src/lib/space_missions/application/UseCases/findByPlanet.usecase";
import { FindByPlanetUseCase as educationContentUseCase } from "@src/lib/education_content/application/UseCases/findByPlanet.usecase";
import { FindByPlanetUseCase as observationTipsUseCase } from "@src/lib/observation_tips/application/UseCases/findByPlanet.usecase";

import { getAllUseCase as spaceMissionsAllUseCase } from "src/lib/space_missions/application/UseCases/getAll.usecase";
import { getAllUseCase as educationContentAllUseCase } from "@src/lib/education_content/application/UseCases/getAll.usecase";
import { getAllUseCase as observationTipsAllUseCase } from "@src/lib/observation_tips/application/UseCases/getAll.usecase";
import { PrismaSpaceMissionsRepository } from "src/lib/space_missions/infraestructure/database/repositories/prisma-space_missions.repository";
import { NasaObservationTipsRepository } from "@src/lib/observation_tips/infraestructure/database/repositories/nasa-observation-tips.repository";
import { NasaEducationContentRepository } from "@src/lib/education_content/infraestructure/database/repositories/nasa-education-content.repository";
import { GetByCodeAndTypeUseCase } from "@src/lib/files/application/UseCases/getByCodeAndType.usecases";
import { NasaFilesRepository } from "@src/lib/files/infraestructure/database/repositories/nasa-files.repository";

export const buildTransactionalServices = () => {
    return {
        planetService: {
            getByCode: new GetByCodeUseCase(new PrismaPlanetRepository()),
            getAll: new GetAllUseCase(new PrismaPlanetRepository()),
        },
        spaceMissionsService: {
            getByPlanet: new spaceMissionsUseCase(
                new PrismaSpaceMissionsRepository()
            ),
            getAll: new spaceMissionsAllUseCase(
                new PrismaSpaceMissionsRepository()
            ),
        },
        educationContentService: {
            getByPlanet: new educationContentUseCase(
                new NasaEducationContentRepository()
            ),
            getAll: new educationContentAllUseCase(
                new NasaEducationContentRepository()
            ),
        },
        observationTipsService: {
            getByPlanet: new observationTipsUseCase(
                new NasaObservationTipsRepository()
            ),
            getAll: new observationTipsAllUseCase(
                new NasaObservationTipsRepository()
            ),
        },
        synchronizeService: {
            images: new SynchronizeImagesUseCase(
                new NasaSynchronizeRepository()
            ),
        },
        filesService:{
            getByCode: new GetByCodeAndTypeUseCase(
                new NasaFilesRepository()
            )
        }
    };
};
