import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db";

export interface BookingItemAttributes {
  id?: number;
  bookingId: number;
  itemId: number;
  quantity: number;
}

class BookingItem
  extends Model<BookingItemAttributes>
  implements BookingItemAttributes
{
  public id!: number;
  public bookingId!: number;
  public itemId!: number;
  public quantity!: number;
}

BookingItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "bookings", key: "id" },
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "items", key: "id" },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "booking_items",
    underscored: true,
  }
);

export default BookingItem;
