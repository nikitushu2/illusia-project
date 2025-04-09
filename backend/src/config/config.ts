// here environment variables are taken care of

import dotenv from "dotenv";

dotenv.config();

const { NODE_ENV } = process.env;
const isProd = NODE_ENV === "production";

const devConfig = {
  backendOrigin: process.env.BACKEND_ORIGIN_DEV || "http://localhost:3000",
  frontendOrigin: process.env.FRONTEND_ORIGIN_DEV || "http://localhost:5173",
  database: {
    host: process.env.DB_HOST_DEV || "postgres",
    port: process.env.DB_PORT_DEV || "5432",
    user: process.env.DB_USER_DEV || "postgres",
    password: process.env.DB_PASSWORD_DEV || "password",
    name: process.env.DB_NAME_DEV || "storage_app",
  },
  auth: {
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY_DEV || "",
    jwtPublicKey: process.env.JWT_PUBLIC_KEY_DEV || "",
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID_DEV || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL_DEV || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY_DEV?.replace(/\\n/g, "\n") || "",
  }
};

const prodConfig = {
  backendOrigin: process.env.BACKEND_ORIGIN || "",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "",
  database: {
    host: process.env.DB_HOST || "postgres",
    port: process.env.DB_PORT || "5432",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    name: process.env.DB_NAME || "storage_app_production",
  },
  auth:{
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY || "",
    jwtPublicKey: process.env.JWT_PUBLIC_KEY || "",
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
  }
};

export const config = isProd ? prodConfig : devConfig;

export const DATABASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.HEROKU_POSTGRESQL_IVORY_URL
  : `postgres://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}`;

export const PORT = process.env.PORT || 3000;

console.log(`Running in ${isProd ? "production" : "development"} mode`);
console.log(
  `Using database: ${config.database.host}:${config.database.port}/${config.database.name}`
);
