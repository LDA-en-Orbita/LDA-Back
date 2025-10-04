export interface PlanetsRepository {
    getByCode(code: string): Promise<any>;
}
