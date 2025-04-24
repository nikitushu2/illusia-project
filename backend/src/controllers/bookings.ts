import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Booking from "../models/booking";
import * as bookingService from "../services/bookingService";

export interface BookingAttributes {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  statusId: number;
  createdAt: Date;
}

export interface BookingRequest extends Request {
  booking?: BookingAttributes;
}

const bookingsRouter = Router();

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

    req.booking = booking.get({ plain: true }) as BookingAttributes;
    next();
  } catch (error) {
    next(error);
  }
};

// GET all bookings
bookingsRouter.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await bookingService.findAll();
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }
);

// GET booking by ID
bookingsRouter.get(
  "/:id",
  findBookingById,
  (req: BookingRequest, res: Response) => {
    res.json(req.booking);
  }
);

// GET bookings by user ID
bookingsRouter.get(
  "/user/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
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

// POST create new booking
bookingsRouter.post(
  "/",
  async (
    req: Request<{}, {}, BookingAttributes>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newBooking = await bookingService.create(req.body);
      res.status(201).json(newBooking);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update booking
bookingsRouter.put(
  "/:id",
  findBookingById,
  async (req: BookingRequest, res: Response, next: NextFunction) => {
    try {
      const updatedBooking = await bookingService.update(
        Number(req.params.id),
        req.body as Partial<BookingAttributes>
      );
      res.json(updatedBooking);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH update booking status
bookingsRouter.patch(
  "/:id/status",
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

// DELETE booking
bookingsRouter.delete(
  "/:id",
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

export { bookingsRouter };
