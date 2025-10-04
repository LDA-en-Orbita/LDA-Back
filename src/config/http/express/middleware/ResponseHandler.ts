import type { Request, Response } from 'express';
import type { StandardResponse } from './StandardResponse';

interface ErrorResponse {
  message: string;
}

export const responseHandler = (
  _req: Request,
  res: Response,
  next: () => void,
) => {
  const originalJson = res.json;

  res.json = function (body: unknown) {
    const response: StandardResponse = {
      status: res.statusCode,
      data: null,
      errors: null,
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      if (body && typeof body === 'object') {
        if ('errors' in body && 'status' in body) {
          const errorBody = body as StandardResponse;
          response.errors = getErrors(errorBody);
        } else {
          response.errors = {
            message:
              'message' in body
                ? (body as { message: string }).message
                : JSON.stringify(body),
          };
        }
      }
    } else {
      response.data = body;
    }

    return originalJson.call(this, response);
  };

  next();
};

const getErrors = (errorBody: any): any => {
  if (Array.isArray(errorBody.errors)) {
    return errorBody.errors;
  }
  if (typeof errorBody.errors !== 'object' && errorBody.errors !== null && !!(errorBody.errors as ErrorResponse).message) {
    return JSON.stringify(errorBody.errors);
  }

  return errorBody.errors;
}
