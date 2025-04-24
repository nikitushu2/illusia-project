import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db";

export interface StatusAttributes {
  id?: number;
  name: string;
}

class Status extends Model<StatusAttributes> implements StatusAttributes {
  public id!: number;
  public name!: string;
}

Status.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "statuses",
    underscored: true,
  }
);

export default Status;
