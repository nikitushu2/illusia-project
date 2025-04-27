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

  size?: string;
  color?: string;
  itemLocation?: string;
  storageLocation?: string;
  availability?: boolean; // Assuming you want to add this field
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

  public size!: string;
  public color!: string;
  public itemLocation!: string;
  public storageLocation!: string;
  public availability!: boolean;
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
    size: {
      type: DataTypes.STRING(250), // Match the data type from your migration
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(250), // Match the data type from your migration
      allowNull: true,
    },
    itemLocation: {
      type: DataTypes.STRING(250), // Match the data type from your migration
      allowNull: true,
      field: "item_location", // If you want a different database column name
    },
    storageLocation: {
      type: DataTypes.STRING(250), // Match the data type from your migration
      allowNull: true,
      field: "storage_location", // If you want a different database column name
    },
    availability: {
      type: DataTypes.BOOLEAN, // Match the data type from your migration
      allowNull: true,        // Or false, depending on your migration
      defaultValue: true,     // If you set a default in the migration
    },
  },
  {
    sequelize,
    tableName: "items",
    underscored: true,
  }
);

export default Item;
