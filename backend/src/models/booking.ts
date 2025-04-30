import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../util/db";

export enum BookingStatus {
  "RESERVED" = 1,
  "CANCELLED" = 2,
  "PENDING_APPROVAL" = 3,
  "IN_PROGRESS" = 4,
  "CLOSED" = 5,
  "IN_QUEUE" = 6,
}

// Interface for all attributes a Booking can have
export interface BookingAttributes {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  statusId: number;
  createdAt: Date;
}

// Interface for attributes when creating a Booking (id and createdAt are optional)
export interface BookingCreationAttributes
  extends Optional<BookingAttributes, "id" | "createdAt"> {}

class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  public id!: number;
  public userId!: number;
  public startDate!: Date;
  public endDate!: Date;
  public statusId!: number;
  public readonly createdAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [
          Object.values(BookingStatus).filter((v) => typeof v === "number"),
        ],
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "bookings",
    underscored: true,
  }
);

export default Booking;
