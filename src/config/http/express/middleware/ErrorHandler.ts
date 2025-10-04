import { log } from '@config/Logger.config';
import { BadRequestException } from '@shared/errors/error.handler';
import { NotFound } from '@shared/errors/NotFound';
import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  _next,
) => {

  if(err instanceof NotFound) {
    res.status(StatusCodes.NOT_FOUND).json({
      status: StatusCodes.NOT_FOUND,
      data: null,
      errors: { message: err.message },
    });
    return;
  }

  if(err instanceof BadRequestException) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      data: null,
      errors: { message: err.message },
    });
    return;
  }
  if (err instanceof Error) {
    log.error('err', err);
    if (err.message.includes('Unique constraint failed')) {
      res.status(StatusCodes.CONFLICT).json({
        status: StatusCodes.NOT_FOUND,
        data: null,
        errors: { message: err.message },
      });
      return;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: null,
      errors: { message: err.message },
    });
    return;
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    data: null,
    errors: { message: 'Something broke!' },
  });
  return;
};
