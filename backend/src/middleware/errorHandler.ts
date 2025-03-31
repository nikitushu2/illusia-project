import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  name: string;
  message: string;
}

export const errorHandler = (error: AppError, _request: Request, response: Response, next: NextFunction) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);

  return undefined;
};