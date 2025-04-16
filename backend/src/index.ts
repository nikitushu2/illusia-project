// here application is configured and launched.

import express from "express";
import { ErrorRequestHandler } from "express";
import { PORT } from "./config/config";
import { connectToDatabase } from "./util/db";
import { itemsRouter } from "./controllers/items";
import { authRouter } from "./controllers/auth";
import { errorHandler, AppError } from "./middleware/errorHandler";
import cors from 'cors';
import { verifySession, verifyAdminSession, verifySuperAdminSession } from "./middleware/verifySession";
import cookieParser from "cookie-parser";
import { categoriesRouter } from "./controllers/categories";


const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://illusia-project-2947763ee03d.herokuapp.com' 
    : ['http://localhost:5173', 'http://localhost:5174'],
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

app.use(express.json());


// all the backend Api should start with /api
const apiRouter = express.Router();
apiRouter.use(cookieParser());
apiRouter.use(express.json());

// all auth endpoint starts with /api/auth
apiRouter.use('/auth', authRouter);

// Public items route - no authentication required
apiRouter.use('/items', itemsRouter);
apiRouter.use('/categories', categoriesRouter);

// all the private endpoint starts with /api/private
// private endpoints are only for logged in users
const privateApiRouter = express.Router();
privateApiRouter.use(verifySession);

// super admin specific endpoint like endpoint for approving admins
// starts with /api/private/superadmin and should use superAdminApiRouter
const superAdminApiRouter = express.Router();
superAdminApiRouter.use(verifySuperAdminSession);

// super admin related endpoints goes here

privateApiRouter.use('/superadmin', superAdminApiRouter);

// admin specific endpoint like endpoint for approving user 
// starts with /api/private/admin and should use adminApiRouter
const adminApiRouter = express.Router();
adminApiRouter.use(verifyAdminSession);


// admin related endpoints goes here

privateApiRouter.use('/admin', adminApiRouter);

// all common endpoints for logged in user should use privateApiRouter
// privateApiRouter.use('/items', itemsRouter);

apiRouter.use('/private', privateApiRouter);

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  errorHandler(err as AppError, req, res, next);
};

apiRouter.use(errorHandlerMiddleware);
app.use('/api', apiRouter);


const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();