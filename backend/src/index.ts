// here application is configured and launched

import express from "express";
import { ErrorRequestHandler } from "express";
import { PORT } from "./util/config";
import { connectToDatabase } from "./util/db";
import { router as itemsRouter } from "./controllers/items";
import { errorHandler, AppError } from "./middleware/errorHandler";
import cors from 'cors';

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://illusia-project-2947763ee03d.herokuapp.com' 
    : 'http://localhost:5173'
}));

app.use(express.json());

app.use('/api/items', itemsRouter);

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  errorHandler(err as AppError, req, res, next);
};

app.use(errorHandlerMiddleware);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();