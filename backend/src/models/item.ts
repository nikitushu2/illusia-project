import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db";

export interface ItemAttributes {
  id?: number;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  categoryId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Item extends Model<ItemAttributes> implements ItemAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public imageUrl!: string;
  public price!: number;
  public quantity!: number;
  public categoryId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Item.init(
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
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "image_url",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "category_id",
    },
  },
  {
    sequelize,
    tableName: "items",
    underscored: true,
  }
);

export default Item;
