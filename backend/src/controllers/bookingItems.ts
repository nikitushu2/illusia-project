// src/controllers/bookingItems.ts
import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import BookingItem from "../models/bookingItem";
import * as bookingItemService from "../services/bookingItemService";

interface BookingItemRequest extends Request {
  bookingItem?: BookingItem;
}

const bookingItemsRouter = Router();

// Middleware to find booking item by ID
const findBookingItemById = async (
  req: Request,
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
    (req as BookingItemRequest).bookingItem = bookingItem;
    next();
  } catch (error) {
    next(error);
  }
};

// GET all booking items
bookingItemsRouter.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingItems = await bookingItemService.findAll();
      res.json(bookingItems);
    } catch (error) {
      next(error);
    }
  }
);

// GET booking item by ID
bookingItemsRouter.get(
  "/:id",
  findBookingItemById,
  (req: BookingItemRequest, res: Response) => {
    res.json(req.bookingItem);
  }
);

// GET booking items by booking ID
bookingItemsRouter.get(
  "/booking/:bookingId",
  async (req: Request, res: Response, next: NextFunction) => {
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

// POST create new booking item
bookingItemsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
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

// POST create multiple booking items
bookingItemsRouter.post(
  "/bulk",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

// PUT update booking item
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

// PATCH update booking item quantity
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

// DELETE booking item
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

// DELETE all booking items for a booking
bookingItemsRouter.delete(
  "/booking/:bookingId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await bookingItemService.removeByBookingId(Number(req.params.bookingId));
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export { bookingItemsRouter };
