import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../util/db";
import { BookingStatus } from "../types/booking";
import * as emailService from "../services/emailService";

// Interface for all attributes a Booking can have
export interface BookingAttributes {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  status: string;
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
  public status!: string;
  public readonly createdAt!: Date;

  // Add a field to track previous values
  public previousValues: Partial<BookingAttributes> = {};
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(BookingStatus)],
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
    hooks: {
      beforeUpdate: async (booking: Booking) => {
        const previousBooking = await Booking.findByPk(booking.id);
        if (previousBooking) {
          booking.previousValues = {
            status: previousBooking.status,
          };
        }
      },
      afterUpdate: async (booking: Booking) => {
        // If status has changed
        if (
          booking.previousValues.status &&
          booking.previousValues.status !== booking.status &&
          (booking.status === BookingStatus.RESERVED ||
            booking.status === BookingStatus.CANCELLED)
        ) {
          try {
            // Get user information
            const user = await sequelize.models.user.findByPk(booking.userId);
            if (user) {
              // Get booking items
              const bookingItems = await sequelize.models.BookingItem.findAll({
                where: { bookingId: booking.id },
                include: [{ model: sequelize.models.Item, as: "item" }],
              });

              // Send email notification
              await emailService.sendStatusChangeEmail(
                {
                  email: user.get("email") as string,
                  displayName: user.get("displayName") as string,
                },
                booking.id,
                booking.status as BookingStatus,
                booking.startDate,
                booking.endDate,
                bookingItems
              );
            }
          } catch (error) {
            console.error("Error sending status change email:", error);
            // Don't throw here to avoid disrupting the main operation
          }
        }
      },
    },
  }
);

export default Booking;
