import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Booking from "../models/booking";
import * as bookingService from "../services/bookingService";
import { RequestWithSession } from "../types/requestWithSession";
import User from "../models/user";
import { UserRole } from "../types/applicationUser";

export interface BookingAttributes {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  statusId: number;
  createdAt: Date;
  items: Array<{
    id?: number;
    itemId: number;
    quantity: number;
  }>;
}

export interface BookingRequest extends RequestWithSession {
  booking?: BookingAttributes;
}

// separate routers according to the application structure
const privateBookingsRouter = Router();
const adminBookingsRouter = Router();

// Middleware to find booking by ID
const findBookingById = async (
  req: BookingRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const booking = await Booking.findByPk(id);

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (
      req.applicationUser?.role !== UserRole.ADMIN &&
      req.applicationUser?.role !== UserRole.SUPER_ADMIN
    ) {
      const user = await User.findOne({
        where: { email: req.applicationUser?.email },
      });

      if (!user || booking.userId !== user.id) {
        res.status(403).json({ error: "Access denied" });
        return;
      }
    }

    req.booking = booking.get({ plain: true }) as BookingAttributes;
    next();
  } catch (error) {
    next(error);
  }
};

// ADMIN ROUTES
// GET all bookings - admin only
adminBookingsRouter.get(
  "/",
  async (_req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      const bookings = await bookingService.findAll();
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }
);

// GET booking by ID - admin only
adminBookingsRouter.get(
  "/id/:id",
  findBookingById,
  (req: BookingRequest, res: Response) => {
    res.json(req.booking);
  }
);

// GET bookings by user ID - admin only
adminBookingsRouter.get(
  "/user/:userId",
  async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      const bookings = await bookingService.findByUserId(
        Number(req.params.userId)
      );
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }
);

// POST create new booking - admin only
adminBookingsRouter.post(
  "/",
  async (
    req: Request<{}, {}, BookingAttributes>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { startDate, endDate, statusId, userId, items } = req.body;

      if (!startDate || !endDate || !statusId || !userId || !items) {
        res.status(400).json({
          success: false,
          message:
            "Missing required fields: startDate, endDate, statusId, userId, and items are required",
        });
        return;
      }

      const newBooking = await bookingService.createCompleteBooking({
        userId,
        startDate,
        endDate,
        statusId,
        items,
      });

      res.status(201).json(newBooking);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update booking - admin only
adminBookingsRouter.put(
  "/id/:id",
  findBookingById,
  async (req: BookingRequest, res: Response, next: NextFunction) => {
    try {
      const bookingId = Number(req.params.id);

      const { startDate, endDate, statusId, items } = req.body as {
        startDate: Date;
        endDate: Date;
        statusId: number;
        items: Array<{
          id?: number;
          itemId: number;
          quantity: number;
        }>;
      };

      // Validate required fields based on what's being updated
      if (!startDate && !endDate && !statusId && !items) {
        res.status(400).json({
          success: false,
          message: "At least one field must be provided for update",
        });
        return;
      }

      const updatedBooking = await bookingService.updateCompleteBooking({
        id: bookingId,
        startDate,
        endDate,
        statusId,
        items,
      });

      res.json(updatedBooking);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH update booking status - admin only
adminBookingsRouter.patch(
  "/id/:id/status",
  findBookingById,
  async (
    req: BookingRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { statusId } = req.body as { statusId: number };
      if (!statusId) {
        res.status(400).json({ error: "Status ID is required" });
        return;
      }

      const updatedBooking = await bookingService.updateStatus(
        Number(req.params.id),
        statusId
      );
      res.json(updatedBooking);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE booking - admin only
adminBookingsRouter.delete(
  "/id/:id",
  findBookingById,
  async (req: BookingRequest, res: Response, next: NextFunction) => {
    try {
      await bookingService.remove(Number(req.params.id));
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

// USER ROUTES (PRIVATE)
// GET bookings for the current user
privateBookingsRouter.get(
  "/my-bookings",
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

      const bookings = await bookingService.findByUserId(user.id);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }
);

// GET a specific booking owned by the current user
privateBookingsRouter.get(
  "/:id",
  findBookingById,
  (req: BookingRequest, res: Response) => {
    res.json(req.booking);
  }
);

// POST create new booking for the current user
privateBookingsRouter.post(
  "/",
  async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({
        where: { email: req.applicationUser?.email },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { startDate, endDate, statusId, items } = req.body as {
        startDate: Date;
        endDate: Date;
        statusId: number;
        items: Array<{
          itemId: number;
          quantity: number;
        }>;
      };

      if (!startDate || !endDate || !statusId || !items) {
        res.status(400).json({
          success: false,
          message:
            "Missing required fields: startDate, endDate, statusId, and items are required",
        });
        return;
      }

      const newBooking = await bookingService.createCompleteBooking({
        userId: user.id,
        startDate,
        endDate,
        statusId,
        items,
      });

      res.status(201).json(newBooking);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update booking owned by the current user
privateBookingsRouter.put(
  "/:id",
  findBookingById,
  async (req: BookingRequest, res: Response, next: NextFunction) => {
    try {
      // findBookingById middleware already checks ownership
      const bookingId = Number(req.params.id);

      const user = await User.findOne({
        where: { email: req.applicationUser?.email },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { startDate, endDate, statusId, items } = req.body as {
        startDate: Date;
        endDate: Date;
        statusId: number;
        items: Array<{
          itemId: number;
          quantity: number;
        }>;
      };

      // Validate required fields based on what's being updated
      if (!startDate && !endDate && !statusId && !items) {
        res.status(400).json({
          success: false,
          message: "At least one field must be provided for update",
        });
        return;
      }

      const updatedBooking = await bookingService.updateCompleteBooking({
        id: bookingId,
        userId: user.id,
        startDate,
        endDate,
        statusId,
        items,
      });

      res.json(updatedBooking);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE a booking owned by the current user
privateBookingsRouter.delete(
  "/:id",
  findBookingById,
  async (req: BookingRequest, res: Response, next: NextFunction) => {
    try {
      // findBookingById middleware already checks ownership
      await bookingService.remove(Number(req.params.id));
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export { privateBookingsRouter, adminBookingsRouter };
