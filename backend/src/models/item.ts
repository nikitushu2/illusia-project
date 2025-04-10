import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db";

interface ItemAttributes {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId?: number;
  createdAt?: Date;
}

class Item extends Model<ItemAttributes> implements ItemAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public imageUrl!: string;
  public price!: number;
  public categoryId!: number;
  public createdAt!: Date;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "image_url",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "category_id",
      references: {
        model: "categories",
        key: "id"
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "item",
    tableName: "items",
  }
);

export default Item;
