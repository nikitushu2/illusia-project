import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db";

export interface CategoryAttributes {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "categories",
    underscored: true,
  }
);

export default Category; 