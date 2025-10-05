/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *           description: Lista de elementos de la página
 *         total:
 *           type: integer
 *           description: Total de elementos encontrados
 *         page:
 *           type: integer
 *           description: Página actual
 *         lastPage:
 *           type: integer
 *           description: Última página disponible
 */
export interface PaginationResponse<T> {
  data: T[];
  nextCursor: number | null;
  hasMore: boolean;
}
