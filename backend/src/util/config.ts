// here environment variables are taken care of

import dotenv from "dotenv";

dotenv.config();

const { NODE_ENV } = process.env;
const isProd = NODE_ENV === "production";

const devConfig = {
  database: {
    host: process.env.DB_HOST_DEV || "postgres",
    port: process.env.DB_PORT_DEV || "5432",
    user: process.env.DB_USER_DEV || "postgres",
    password: process.env.DB_PASSWORD_DEV || "password",
    name: process.env.DB_NAME_DEV || "storage_app",
  },
};

const prodConfig = {
  database: {
    host: process.env.DB_HOST || "postgres",
    port: process.env.DB_PORT || "5432",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    name: process.env.DB_NAME || "storage_app_production",
  },
};

const config = isProd ? prodConfig : devConfig;

export const DATABASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.DATABASE_URL 
  : `postgres://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}`;

export const PORT = process.env.PORT || 3000;

console.log(`Running in ${isProd ? "production" : "development"} mode`);
console.log(
  `Using database: ${config.database.host}:${config.database.port}/${config.database.name}`
);
