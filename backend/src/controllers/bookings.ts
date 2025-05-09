import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import * as bookingService from "../services/bookingService";
import { RequestWithSession } from "../types/requestWithSession";
import { UserRole } from "../types/applicationUser";
import { BookingStatus, BookingWithDetails, CreateBookingData, UpdateBookingData } from "../types/booking";

export interface BookingAttributes {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  createdAt: Date;
  items: Array<{
    id?: number;
    itemId: number;
    quantity: number;
  }>;
}

export interface BookingRequest extends RequestWithSession {
  booking?: BookingWithDetails;
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
    const booking = await bookingService.findById(id);

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (req.applicationUser?.role === UserRole.USER && booking.user.id !== req.applicationUser.id) {
        res.status(404).json({ error: `Booking not found for user ${req.applicationUser.email}` });
        return;
    }

    req.booking = booking
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
      const { startDate, endDate, status, userId, items } = req.body as CreateBookingData;

      if (!startDate || !endDate || !status || !userId || !items) {
        res.status(400).json({
          success: false,
          message:
            "Missing required fields: startDate, endDate, status, userId, and items are required",
        });
        return;
      }

      const newBooking = await bookingService.createCompleteBooking({
        userId,
        startDate,
        endDate,
        status,
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

      const { startDate, endDate, status, items } = req.body as UpdateBookingData;

      // Validate required fields based on what's being updated
      if (!startDate && !endDate && !status && !items) {
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
        status,
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
      const { status } = req.body as { status: BookingStatus };
      if (!status) {
        res.status(400).json({ error: "Status is required" });
        return;
      }

      const updatedBooking = await bookingService.updateStatus(
        Number(req.params.id),
        status
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
      const bookings = await bookingService.findByUserId(req.applicationUser!.id);
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
      const { startDate, endDate, status, items } = req.body as CreateBookingData;

      if (!startDate || !endDate || !status || !items) {
        res.status(400).json({
          success: false,
          message:
            "Missing required fields: startDate, endDate, statusId, and items are required",
        });
        return;
      }

      const newBooking = await bookingService.createCompleteBooking({
        userId: req.applicationUser!.id,
        startDate,
        endDate,
        status,
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
      const { startDate, endDate, items } = req.body as UpdateBookingData;

      // Validate required fields based on what's being updated
      if (!startDate && !endDate && !items) {
        res.status(400).json({
          success: false,
          message: "At least one field must be provided for update",
        });
        return;
      }

      const updatedBooking = await bookingService.updateCompleteBooking({
        id: req.booking!.id,
        userId: req.applicationUser!.id,
        startDate,
        endDate,
        status: req.booking!.status,
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
      await bookingService.remove(req.booking!.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export { privateBookingsRouter, adminBookingsRouter };
