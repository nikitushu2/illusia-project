import Booking from "../models/booking";
import User from "../models/user";
import BookingItem from "../models/bookingItem";
import Item from "../models/item";
import { InferCreationAttributes, Op } from "sequelize";
import { sequelize } from "../util/db";
import {
  BookingStatus,
  BookingWithDetails,
  CreateBookingData,
  UpdateBookingData,
} from "../types/booking";
import { updateStock } from "./itemService";

export type BookingCreationAttributes = Omit<
  InferCreationAttributes<Booking>,
  "id" | "createdAt"
>;
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
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
      startDate: bi.startDate, // <-- Add this line
      endDate: bi.endDate,
      item: bi.item
        ? {
            id: bi.item.id,
            name: bi.item.name,
            price: bi.item.price,
            imageUrl: bi.item.imageUrl,
          }
        : undefined,
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

export const approveBooking = async (
  id: number
): Promise<BookingWithDetails> => {
  try {
    // Find the booking first
    const booking = await Booking.findByPk(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Update the status
    booking.status = BookingStatus.RESERVED;

    // Save the booking to trigger hooks
    await booking.save();

    // Return the updated booking with details
    const bookingDetails = await findById(booking.id);
    if (!bookingDetails) {
      throw new Error("Failed to retrieve the updated booking");
    }
    return bookingDetails;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

export const rejectBooking = async (
  id: number
): Promise<BookingWithDetails> => {
  const transaction = await sequelize.transaction();
  try {
    // Find the booking with its items
    const bookingDetails = await findById(id);
    if (!bookingDetails) {
      throw new Error("Booking not found");
    }

    // Get the actual model instance
    const booking = await Booking.findByPk(id, { transaction });
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Update the status
    booking.status = BookingStatus.CANCELLED;

    // Save the booking to trigger hooks
    await booking.save({ transaction });

    // Update stock for each item
    for (const bookingItem of bookingDetails.items) {
      await updateStock(bookingItem.itemId, bookingItem.quantity, transaction);
    }

    await transaction.commit();

    // Return the updated booking with details
    const updatedBookingDetails = await findById(booking.id);
    if (!updatedBookingDetails) {
      throw new Error("Failed to retrieve the updated booking");
    }
    return updatedBookingDetails;
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting booking:", error);
    throw error;
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    // Delete the booking; booking items will cascade via DB foreign key
    const deletedCount = await Booking.destroy({ where: { id } });
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
  existingBooking: UpdateBookingData
) => {
  const transaction = await sequelize.transaction();

  try {
    // Update booking details
    const bookingUpdateData: Partial<BookingCreationAttributes> = {};
    if (existingBooking.startDate)
      bookingUpdateData.startDate = existingBooking.startDate;
    if (existingBooking.endDate)
      bookingUpdateData.endDate = existingBooking.endDate;
    if (existingBooking.status)
      bookingUpdateData.status = existingBooking.status;

    await Booking.update(bookingUpdateData, {
      where: { id: existingBooking.id },
      transaction,
    });

    // Handle booking items if provided
    if (existingBooking.items !== undefined) {
      for (const item of existingBooking.items) {
        if (item.id) {
          // Update existing item
          await BookingItem.update(
            { quantity: item.quantity, itemId: item.itemId },
            {
              where: { id: item.id, bookingId: existingBooking.id },
              transaction,
            }
          );
        } else {
          // Create new item
          await BookingItem.create(
            {
              bookingId: existingBooking.id,
              itemId: item.itemId,
              quantity: item.quantity,
            },
            { transaction }
          );
        }
      }
      // Delete removed items not present in the update payload
      const providedIds = existingBooking.items
        .filter((item) => item.id != null)
        .map((item) => item.id as number);
      if (providedIds.length > 0) {
        await BookingItem.destroy({
          where: {
            bookingId: existingBooking.id,
            id: { [Op.notIn]: providedIds },
          },
          transaction,
        });
      } else {
        // No items provided: delete all items for this booking
        await BookingItem.destroy({
          where: { bookingId: existingBooking.id },
          transaction,
        });
      }
    }

    await transaction.commit();

    const result = await findById(existingBooking.id);
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

export const checkAvailability = async (
  startDate: Date,
  endDate: Date
): Promise<Record<number, { totalQuantity: number; bookedQuantity: number; remainingQuantity: number }>> => {
  try {
    // Get all active bookings that overlap with the date range
    const activeBookings = await Booking.findAll({
      where: {
        status: {
          [Op.in]: [
            BookingStatus.RESERVED,
            BookingStatus.IN_PROGRESS,
            BookingStatus.PENDING_APPROVAL,
            BookingStatus.IN_QUEUE
          ]
        },
        [Op.or]: [
          {
            startDate: {
              [Op.lte]: endDate
            },
            endDate: {
              [Op.gte]: startDate
            }
          }
        ]
      },
      include: [
        {
          model: BookingItem,
          as: "bookingItems",
          include: [{ model: Item, as: "item" }]
        }
      ]
    });

    // Get all items to know their total quantities
    const allItems = await Item.findAll();
    const itemQuantities: Record<number, { totalQuantity: number; bookedQuantity: number; remainingQuantity: number }> = {};

    // Initialize quantities for all items
    allItems.forEach(item => {
      itemQuantities[item.id] = {
        totalQuantity: item.quantity,
        bookedQuantity: 0,
        remainingQuantity: item.quantity
      };
    });

    // Calculate booked quantities from overlapping bookings
    activeBookings.forEach(booking => {
      const bookingWithItems = booking as unknown as { bookingItems: Array<{ itemId: number; quantity: number }> };
      bookingWithItems.bookingItems.forEach(bookingItem => {
        const itemId = bookingItem.itemId;
        if (itemQuantities[itemId]) {
          itemQuantities[itemId].bookedQuantity += bookingItem.quantity;
          itemQuantities[itemId].remainingQuantity = 
            itemQuantities[itemId].totalQuantity - itemQuantities[itemId].bookedQuantity;
        }
      });
    });

    return itemQuantities;
  } catch (error) {
    console.error("Error checking availability:", error);
    throw error;
  }
};
