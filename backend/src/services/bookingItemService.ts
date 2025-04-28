import Booking from "../models/booking";
import BookingItem from "../models/bookingItem";
import Item from "../models/item";
import { InferCreationAttributes } from "sequelize";

export type BookingItemCreationAttributes = InferCreationAttributes<BookingItem>;

export const findAll = async () => {
  return await BookingItem.findAll({
    include: [{ model: Item, as: "item" }]
  });
};

export const findById = async (id: number) => {
  return await BookingItem.findByPk(id, {
    include: [{ model: Item, as: "item" }]
  });
};

export const findByBookingId = async (bookingId: number) => {
  return await BookingItem.findAll({
    where: { bookingId },
    include: [{ model: Item, as: "item" }]
  });
};

export const create = async (bookingItem: BookingItemCreationAttributes) => {
  return await BookingItem.create(bookingItem);
};

export const createBulk = async (bookingId: number, items: Array<{ itemId: number, quantity: number }>) => {
  const bookingItems = items.map(item => ({
    bookingId,
    itemId: item.itemId,
    quantity: item.quantity
  }));
  
  return await BookingItem.bulkCreate(bookingItems);
};

export const update = async (id: number, bookingItem: Partial<BookingItemCreationAttributes>) => {
  await BookingItem.update(bookingItem, { where: { id } });
  return await findById(id);
};

export const updateQuantity = async (id: number, quantity: number) => {
  await BookingItem.update({ quantity }, { where: { id } });
  return await findById(id);
};

export const remove = async (id: number) => {
  return await BookingItem.destroy({ where: { id } });
};

export const removeByBookingId = async (bookingId: number) => {
  return await BookingItem.destroy({ where: { bookingId } });
};

export const findByUserBookings = async (userId: number): Promise<BookingItem[]> => {
     return BookingItem.findAll({
      include: [
        {
          model: Booking,
          where: { userId },
          attributes: [],
        },
      ],
    });
  };