import { DatasetKey } from '@shared/config/constants';
import { CodePlanetsEnums } from '../../../shared/enums/code-planets.enum';
export interface ParamsFilesDto {
    code: CodePlanetsEnums,
    type: DatasetKey,
    keyword?: string;
    nasaIds?: string[];
}
