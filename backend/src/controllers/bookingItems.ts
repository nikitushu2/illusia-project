// src/controllers/bookingItems.ts
import { Response, NextFunction } from "express";
import { Router } from "express";
import BookingItem from "../models/bookingItem";
import * as bookingItemService from "../services/bookingItemService";
import { RequestWithSession } from "../types/requestWithSession";
import { verifySession, verifyAdminSession } from "../middleware/verifySession";
import Booking from "../models/booking";
import User from "../models/user";
import { UserRole } from "../types/applicationUser";

interface BookingItemRequest extends RequestWithSession {
  bookingItem?: BookingItem;
}

const bookingItemsRouter = Router();

// Middleware to find booking item by ID
const findBookingItemById = async (
  req: BookingItemRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookingItem = await bookingItemService.findById(
      Number(req.params.id)
    );
    if (!bookingItem) {
      res.status(404).json({ error: "Booking item not found" });
      return;
    }

    if (
      req.applicationUser?.role !== UserRole.ADMIN &&
      req.applicationUser?.role !== UserRole.SUPER_ADMIN
    ) {
      const user = await User.findOne({
        where: { email: req.applicationUser?.email },
      });
      if (!user) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      const booking = await Booking.findByPk(bookingItem.bookingId);
      if (!booking || booking.userId !== user.id) {
        res.status(403).json({ error: "Access denied" });
        return;
      }
    }

    req.bookingItem = bookingItem;
    next();
  } catch (error) {
    next(error);
  }
};

bookingItemsRouter.use(verifySession);

// ADMIN ROUTES
// GET all booking items - admin only
bookingItemsRouter.get(
  "/admin",
  verifyAdminSession,
  async (_req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      const bookingItems = await bookingItemService.findAll();
      res.json(bookingItems);
    } catch (error) {
      next(error);
    }
  }
);

// GET booking item by ID - admin only
bookingItemsRouter.get(
  "/admin/:id",
  verifyAdminSession,
  findBookingItemById,
  (req: BookingItemRequest, res: Response) => {
    res.json(req.bookingItem);
  }
);

// GET booking items by booking ID - admin only
bookingItemsRouter.get(
  "/admin/booking/:bookingId",
  verifyAdminSession,
  async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      const bookingItems = await bookingItemService.findByBookingId(
        Number(req.params.bookingId)
      );
      res.json(bookingItems);
    } catch (error) {
      next(error);
    }
  }
);

// POST create new booking item - admin only
bookingItemsRouter.post(
  "/admin",
  verifyAdminSession,
  async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      const newBookingItem = await bookingItemService.create(
        req.body as BookingItem
      );
      res.status(201).json(newBookingItem);
    } catch (error) {
      next(error);
    }
  }
);

// POST create multiple booking items - admin only
bookingItemsRouter.post(
  "/admin/bulk",
  verifyAdminSession,
  async (
    req: RequestWithSession,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { bookingId, items } = req.body as {
        bookingId: number;
        items: { itemId: number; quantity: number }[];
      };

      if (!bookingId || !items || !Array.isArray(items)) {
        res.status(400).json({ error: "Invalid request format" });
        return;
      }

      const bookingItems = await bookingItemService.createBulk(
        bookingId,
        items
      );
      res.status(201).json(bookingItems);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update booking item - admin only
bookingItemsRouter.put(
  "/admin/:id",
  verifyAdminSession,
  findBookingItemById,
  async (req: BookingItemRequest, res: Response, next: NextFunction) => {
    try {
      const updatedBookingItem = await bookingItemService.update(
        Number(req.params.id),
        req.body as Partial<BookingItem>
      );
      res.json(updatedBookingItem);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH update booking item quantity - admin only
bookingItemsRouter.patch(
  "/admin/:id/quantity",
  verifyAdminSession,
  findBookingItemById,
  async (
    req: BookingItemRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { quantity } = req.body as { quantity: number };
      if (quantity === undefined) {
        res.status(400).json({ error: "Quantity is required" });
        return;
      }

      const updatedBookingItem = await bookingItemService.updateQuantity(
        Number(req.params.id),
        quantity
      );
      res.json(updatedBookingItem);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE booking item - admin only
bookingItemsRouter.delete(
  "/admin/:id",
  verifyAdminSession,
  findBookingItemById,
  async (req: BookingItemRequest, res: Response, next: NextFunction) => {
    try {
      await bookingItemService.remove(Number(req.params.id));
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

// DELETE all booking items for a booking - admin only
bookingItemsRouter.delete(
  "/admin/booking/:bookingId",
  verifyAdminSession,
  async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      await bookingItemService.removeByBookingId(Number(req.params.bookingId));
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

// USER ROUTES
// GET booking items for the current user's bookings
bookingItemsRouter.get(
  "/my-items",
  async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      if (!req.applicationUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const user = await User.findOne({
        where: { email: req.applicationUser.email },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const bookingItems = await bookingItemService.findByUserBookings(user.id);
      res.json(bookingItems);
    } catch (error) {
      next(error);
    }
  }
);

// GET booking items for a specific booking owned by the current user
bookingItemsRouter.get(
  "/booking/:bookingId",
  async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      if (!req.applicationUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const user = await User.findOne({
        where: { email: req.applicationUser.email },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const bookingId = Number(req.params.bookingId);

      const booking = await Booking.findByPk(bookingId);
      if (!booking || booking.userId !== user.id) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      const bookingItems = await bookingItemService.findByBookingId(bookingId);
      res.json(bookingItems);
    } catch (error) {
      next(error);
    }
  }
);

// GET a specific booking item owned by the current user
bookingItemsRouter.get(
  "/:id",
  findBookingItemById,
  (req: BookingItemRequest, res: Response) => {
    res.json(req.bookingItem);
  }
);

// POST create booking item for the current user's booking
bookingItemsRouter.post(
  "/",
  async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      if (!req.applicationUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      // Get the user ID from email
      const user = await User.findOne({
        where: { email: req.applicationUser.email },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const bookingItem = req.body as BookingItem;

      // Verify the booking belongs to the user
      const booking = await Booking.findByPk(bookingItem.bookingId);
      if (!booking || booking.userId !== user.id) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      const newBookingItem = await bookingItemService.create(bookingItem);
      res.status(201).json(newBookingItem);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update booking item owned by the current user
bookingItemsRouter.put(
  "/:id",
  findBookingItemById,
  async (req: BookingItemRequest, res: Response, next: NextFunction) => {
    try {
      const updatedBookingItem = await bookingItemService.update(
        Number(req.params.id),
        req.body as Partial<BookingItem>
      );
      res.json(updatedBookingItem);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH update quantity of a booking item owned by the current user
bookingItemsRouter.patch(
  "/:id/quantity",
  findBookingItemById,
  async (
    req: BookingItemRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { quantity } = req.body as { quantity: number };
      if (quantity === undefined) {
        res.status(400).json({ error: "Quantity is required" });
        return;
      }

      const updatedBookingItem = await bookingItemService.updateQuantity(
        Number(req.params.id),
        quantity
      );
      res.json(updatedBookingItem);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE a booking item owned by the current user
bookingItemsRouter.delete(
  "/:id",
  findBookingItemById,
  async (req: BookingItemRequest, res: Response, next: NextFunction) => {
    try {
      await bookingItemService.remove(Number(req.params.id));
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export { bookingItemsRouter };
