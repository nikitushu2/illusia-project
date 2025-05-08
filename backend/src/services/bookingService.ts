import Booking from "../models/booking";
import User from "../models/user";
import BookingItem from "../models/bookingItem";
import Item from "../models/item";
import { InferCreationAttributes } from "sequelize";
import { sequelize } from "../util/db";
import {
  BookingStatus,
  BookingWithDetails,
  CreateBookingData,
  UpdateBookingData,
} from "../types/booking";

export type BookingCreationAttributes = Omit<
  InferCreationAttributes<Booking>,
  "id" | "createdAt"
>;

export function mapBookingToDetails(booking: any): BookingWithDetails {
  const plain = booking.get ? booking.get({ plain: true }) : booking;

  return {
    id: plain.id,
    user: {
      id: plain.user.id,
      email: plain.user.email,
      displayName: plain.user.displayName,
    },
    startDate: plain.startDate,
    endDate: plain.endDate,
    status: plain.status,
    createdAt: plain.createdAt,
    items: (plain.bookingItems || []).map((bi: any) => ({
      id: bi.id,
      itemId: bi.itemId,
      quantity: bi.quantity,
    })),
  };
}

export const findAll = async (): Promise<BookingWithDetails[]> => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: "user" },
        {
          model: BookingItem,
          as: "bookingItems",
          include: [{ model: Item, as: "item" }],
        },
      ],
    });
    return bookings.map((booking) => mapBookingToDetails(booking));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const findById = async (
  id: number
): Promise<BookingWithDetails | null> => {
  try {
    const booking = await Booking.findByPk(id, {
      include: [
        { model: User, as: "user" },
        {
          model: BookingItem,
          as: "bookingItems",
          include: [{ model: Item, as: "item" }],
        },
      ],
    });
    if (!booking) return null;
    return mapBookingToDetails(booking);
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    throw error;
  }
};

export const findByUserId = async (
  userId: number
): Promise<BookingWithDetails[]> => {
  try {
    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        { model: User, as: "user" },
        {
          model: BookingItem,
          as: "bookingItems",
          include: [{ model: Item, as: "item" }],
        },
      ],
    });
    return bookings.map((booking) => mapBookingToDetails(booking));
  } catch (error) {
    console.error("Error fetching bookings by user ID:", error);
    throw error;
  }
};

export const updateStatus = async (
  id: number,
  status: BookingStatus
): Promise<BookingWithDetails> => {
  try {
    // First, find the booking
    const booking = await Booking.findByPk(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Update the status - this will trigger the hooks
    booking.status = status;
    await booking.save();

    // Return the updated booking with details
    const result = await findById(id);
    if (!result) {
      throw new Error("Failed to retrieve the updated booking");
    }
    return result;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    const deletedCount = await BookingItem.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new Error("Booking not found");
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

export const createCompleteBooking = async (
  data: CreateBookingData
): Promise<BookingWithDetails> => {
  const transaction = await sequelize.transaction();

  try {
    const booking = await Booking.create(
      {
        userId: data.userId,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      },
      { transaction }
    );

    if (data.items && data.items.length > 0) {
      const bookingItems = data.items.map((item) => ({
        bookingId: booking.id,
        itemId: item.itemId,
        quantity: item.quantity,
      }));

      await BookingItem.bulkCreate(bookingItems, { transaction });
    }

    await transaction.commit();

    const result = await findById(booking.id);
    if (!result) {
      throw new Error("Failed to retrieve the created booking");
    }
    return result;
  } catch (error) {
    console.error("Error creating complete booking:", error);
    await transaction.rollback();
    throw error;
  }
};

export const updateCompleteBooking = async (
  exixtingBooking: UpdateBookingData
) => {
  const transaction = await sequelize.transaction();

  try {
    // Update booking details
    const bookingUpdateData: Partial<BookingCreationAttributes> = {};
    if (exixtingBooking.startDate)
      bookingUpdateData.startDate = exixtingBooking.startDate;
    if (exixtingBooking.endDate)
      bookingUpdateData.endDate = exixtingBooking.endDate;
    if (exixtingBooking.status)
      bookingUpdateData.status = exixtingBooking.status;

    await Booking.update(bookingUpdateData, {
      where: { id: exixtingBooking.id },
      transaction,
    });

    // Handle booking items if provided
    if (exixtingBooking.items !== undefined) {
      for (const item of exixtingBooking.items) {
        if (item.id) {
          // Update existing item
          await BookingItem.update(
            { quantity: item.quantity, itemId: item.itemId },
            {
              where: { id: item.id, bookingId: exixtingBooking.id },
              transaction,
            }
          );
        } else {
          // Create new item
          await BookingItem.create(
            {
              bookingId: exixtingBooking.id,
              itemId: item.itemId,
              quantity: item.quantity,
            },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();

    const result = await findById(exixtingBooking.id);
    if (!result) {
      throw new Error("Failed to retrieve the created booking");
    }
    return result;
  } catch (error) {
    console.error("Error updating complete booking:", error);
    await transaction.rollback();
    throw error;
  }
};
