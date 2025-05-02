import Booking from "../models/booking";
import User from "../models/user";
import BookingItem from "../models/bookingItem";
import Item from "../models/item";
import { InferCreationAttributes } from "sequelize";
import { sequelize } from "../util/db";

export type BookingCreationAttributes = Omit<
  InferCreationAttributes<Booking>,
  "id" | "createdAt"
>;

export const findAll = async () => {
  return await Booking.findAll({
    include: [
      { model: User, as: "user" },
      {
        model: BookingItem,
        as: "bookingItems",
        include: [{ model: Item, as: "item" }],
      },
    ],
  });
};

export const findById = async (id: number) => {
  return await Booking.findByPk(id, {
    include: [
      { model: User, as: "user" },
      {
        model: BookingItem,
        as: "bookingItems",
        include: [{ model: Item, as: "item" }],
      },
    ],
  });
};

export const findByUserId = async (userId: number) => {
  return await Booking.findAll({
    where: { userId },
    include: [
      {
        model: BookingItem,
        as: "bookingItems",
        include: [{ model: Item, as: "item" }],
      },
    ],
  });
};

export const create = async (booking: BookingCreationAttributes) => {
  return await Booking.create(booking);
};

export const update = async (
  id: number,
  booking: Partial<BookingCreationAttributes>
) => {
  await Booking.update(booking, { where: { id } });
  return await findById(id);
};

export const updateStatus = async (id: number, statusId: number) => {
  await Booking.update({ statusId }, { where: { id } });
  return await findById(id);
};

export const remove = async (id: number) => {
  return await Booking.destroy({ where: { id } });
};

export interface CreateBookingData {
  userId: number;
  startDate: Date;
  endDate: Date;
  statusId: number;
  items: Array<{
    itemId: number;
    quantity: number;
  }>;
}

export const createCompleteBooking = async (data: CreateBookingData) => {
  const transaction = await sequelize.transaction();

  try {
    const booking = await Booking.create(
      {
        userId: data.userId,
        startDate: data.startDate,
        endDate: data.endDate,
        statusId: data.statusId,
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

    return await findById(booking.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
