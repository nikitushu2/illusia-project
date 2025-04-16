// here database is initialized

import { Sequelize, Options } from "sequelize";
import { DATABASE_URL } from "../config/config";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const sequelizeOptions: Options = {
  dialect: 'postgres',
  ...(process.env.NODE_ENV === 'production' && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
};

const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("connected to the database");
  } catch (error) {
    console.log("failed to connect to the database: ", error);
    return process.exit(1);
  }

  return null;
};

export { connectToDatabase, sequelize };
