import { Request, Response, NextFunction } from "express";
import { Router } from "express";







const mock = Router();

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
mock.get(
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
mock.get(
    "/:id",
    findBookingById,
    (req: BookingRequest, res: Response) => {
        res.json(req.booking);
    }
);

// GET bookings by user ID
mock.get(
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
mock.post(
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
mock.put(
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
mock.patch(
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
mock.delete(
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

export { mock as bookingsRouter };
