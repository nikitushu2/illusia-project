import { sequelize } from "../util/db";
import Item from "./item";
import User from "./user";
import Category from "./category";
import Booking from "./booking";
import BookingItem from "./bookingItem";
import Status from "./status";

// Initialize models
const models = {
  Item,
  User,
  Category,
};

// Set up one-to-many relationship between Category and Item
Category.hasMany(Item, {
  foreignKey: "categoryId",
  as: "items",
});

Item.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

// User and Booking (one-to-many)
User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookings",
});

Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Status and Booking (one-to-many)
Status.hasMany(Booking, {
  foreignKey: "statusId",
  as: "bookings",
});

Booking.belongsTo(Status, {
  foreignKey: "statusId",
  as: "status",
});

// Booking and BookingItem (one-to-many)
Booking.hasMany(BookingItem, {
  foreignKey: "bookingId",
  as: "bookingItems",
});

BookingItem.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "booking",
});

// Item and BookingItem (one-to-many)
Item.hasMany(BookingItem, {
  foreignKey: "itemId",
  as: "bookingItems",
});

BookingItem.belongsTo(Item, {
  foreignKey: "itemId",
  as: "item",
});

export { Item, User, Category, sequelize };

export default models;
