// @ts-nocheck
import { describe, it, beforeEach, after } from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";
import {
  privateBookingsRouter,
  adminBookingsRouter,
} from "../controllers/bookings";
import * as bookingService from "../services/bookingService";
import { mock } from "node:test";
import { BookingStatus } from "../types/booking";

// Mock authentication middleware
const mockUserAuth = (req, _res, next) => {
  req.applicationUser = { id: 5, role: "USER", email: "user@example.com" };
  next();
};

const mockAdminAuth = (req, _res, next) => {
  req.applicationUser = { id: 1, role: "ADMIN", email: "admin@example.com" };
  next();
};

// Create test apps with the routers
const privateApp = express();
privateApp.use(express.json());
privateApp.use(mockUserAuth); // Apply user auth middleware
privateApp.use("/bookings", privateBookingsRouter);

const adminApp = express();
adminApp.use(express.json());
adminApp.use(mockAdminAuth); // Apply admin auth middleware
adminApp.use("/bookings", adminBookingsRouter);

// Sample booking data
const sampleBooking = {
  id: 1,
  user: {
    id: 5,
    email: "user@example.com",
    displayName: "Test User",
  },
  startDate: `${new Date("2025-01-01")}`,
  endDate: `${new Date("2025-01-30")}`,
  status: BookingStatus.RESERVED,
  createdAt: `${new Date()}`,
  items: [
    {
      id: 1,
      itemId: 5,
      quantity: 2,
    },
  ],
};

const sampleBookingsList = [
  sampleBooking,
  {
    id: 2,
    user: {
      id: 6,
      email: "user2@example.com",
      displayName: "Test User 2",
    },
    startDate: `${new Date("2025-02-01")}`,
    endDate: `${new Date("2025-02-28")}`,
    status: BookingStatus.PENDING_APPROVAL,
    createdAt: `${new Date()}`,
    items: [
      {
        id: 2,
        itemId: 6,
        quantity: 1,
      },
    ],
  },
];

// Store original service functions
const originalBookingService = { ...bookingService };

// Create mock functions
const mockBookingService = {
  findAll: mock.fn(),
  findById: mock.fn(),
  findByUserId: mock.fn(),
  createCompleteBooking: mock.fn(),
  updateCompleteBooking: mock.fn(),
  updateStatus: mock.fn(),
  remove: mock.fn(),
};

// Replace the original functions with mocks
Object.keys(mockBookingService).forEach((key) => {
  bookingService[key] = mockBookingService[key];
});

describe("Bookings Controller", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    Object.keys(mockBookingService).forEach((key) => {
      mockBookingService[key].mock.resetCalls();
    });
  });

  describe("Admin Bookings Router", () => {
    it("GET / should return all bookings", async () => {
      mockBookingService.findAll.mock.mockImplementation(() =>
        Promise.resolve(sampleBookingsList)
      );

      const response = await request(adminApp).get("/bookings").expect(200);

      assert.deepStrictEqual(response.body, sampleBookingsList);
      assert.strictEqual(mockBookingService.findAll.mock.callCount(), 1);
    });

    it("GET /id/:id should return a specific booking", async () => {
      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleBooking)
      );

      const response = await request(adminApp)
        .get("/bookings/id/1")
        .expect(200);

      assert.deepStrictEqual(response.body, sampleBooking);
      assert.strictEqual(mockBookingService.findById.mock.callCount(), 1);
      assert.strictEqual(
        mockBookingService.findById.mock.calls[0].arguments[0],
        1
      );
    });

    it("GET /id/:id should return 404 if booking not found", async () => {
      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(null)
      );

      await request(adminApp).get("/bookings/id/999").expect(404);
    });

    it("GET /user/:userId should return bookings for a specific user", async () => {
      mockBookingService.findByUserId.mock.mockImplementation(() =>
        Promise.resolve([sampleBooking])
      );

      const response = await request(adminApp)
        .get("/bookings/user/5")
        .expect(200);

      assert.deepStrictEqual(response.body, [sampleBooking]);
      assert.strictEqual(mockBookingService.findByUserId.mock.callCount(), 1);
      assert.strictEqual(
        mockBookingService.findByUserId.mock.calls[0].arguments[0],
        5
      );
    });

    it("POST / should create a new booking", async () => {
      const newBookingData = {
        userId: 5,
        startDate: "2025-03-01",
        endDate: "2025-03-30",
        status: BookingStatus.PENDING_APPROVAL,
        items: [{ itemId: 5, quantity: 1 }],
      };

      const createdBooking = {
        id: 3,
        user: {
          id: 5,
          email: "user@example.com",
          displayName: "Test User",
        },
        startDate: `${new Date("2025-03-01")}`,
        endDate: `${new Date("2025-03-30")}`,
        status: BookingStatus.PENDING_APPROVAL,
        createdAt: `${new Date()}`,
        items: [
          {
            id: 3,
            itemId: 5,
            quantity: 1,
          },
        ],
      };

      mockBookingService.createCompleteBooking.mock.mockImplementation(() =>
        Promise.resolve(createdBooking)
      );

      const response = await request(adminApp)
        .post("/bookings")
        .send(newBookingData)
        .expect(201);

      assert.deepStrictEqual(response.body, createdBooking);
      assert.strictEqual(
        mockBookingService.createCompleteBooking.mock.callCount(),
        1
      );
      assert.deepStrictEqual(
        mockBookingService.createCompleteBooking.mock.calls[0].arguments[0],
        newBookingData
      );
    });

    it("POST / should return 400 if required fields are missing", async () => {
      const incompleteData = {
        userId: 5,
        // Missing startDate, endDate, status, or items
      };

      await request(adminApp)
        .post("/bookings")
        .send(incompleteData)
        .expect(400);
    });

    it("PUT /id/:id should update a booking", async () => {
      const updateData = {
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        status: BookingStatus.RESERVED,
        items: [{ id: 1, itemId: 5, quantity: 3 }],
      };

      const updatedBooking = {
        ...sampleBooking,
        startDate: `${new Date("2025-04-01")}`,
        endDate: `${new Date("2025-04-30")}`,
        status: BookingStatus.RESERVED,
        items: [
          {
            id: 1,
            itemId: 5,
            quantity: 3,
          },
        ],
      };

      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleBooking)
      );

      mockBookingService.updateCompleteBooking.mock.mockImplementation(() =>
        Promise.resolve(updatedBooking)
      );

      const response = await request(adminApp)
        .put("/bookings/id/1")
        .send(updateData)
        .expect(200);

      assert.deepStrictEqual(response.body, updatedBooking);
      assert.strictEqual(
        mockBookingService.updateCompleteBooking.mock.callCount(),
        1
      );
    });

    it("PUT /id/:id should return 400 if no fields are provided for update", async () => {
      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleBooking)
      );

      await request(adminApp).put("/bookings/id/1").send({}).expect(400);
    });

    it("PATCH /id/:id/status should update booking status", async () => {
      const statusUpdate = {
        status: BookingStatus.CANCELLED,
      };

      const updatedBooking = {
        ...sampleBooking,
        status: BookingStatus.CANCELLED,
      };

      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleBooking)
      );

      mockBookingService.updateStatus.mock.mockImplementation(() =>
        Promise.resolve(updatedBooking)
      );

      const response = await request(adminApp)
        .patch("/bookings/id/1/status")
        .send(statusUpdate)
        .expect(200);

      assert.deepStrictEqual(response.body, updatedBooking);
      assert.strictEqual(mockBookingService.updateStatus.mock.callCount(), 1);
      assert.strictEqual(
        mockBookingService.updateStatus.mock.calls[0].arguments[0],
        1
      );
      assert.strictEqual(
        mockBookingService.updateStatus.mock.calls[0].arguments[1],
        BookingStatus.CANCELLED
      );
    });

    it("PATCH /id/:id/status should return 400 if status is missing", async () => {
      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleBooking)
      );

      await request(adminApp)
        .patch("/bookings/id/1/status")
        .send({})
        .expect(400);
    });

    it("DELETE /id/:id should delete a booking", async () => {
      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleBooking)
      );

      mockBookingService.remove.mock.mockImplementation(() =>
        Promise.resolve()
      );

      await request(adminApp).delete("/bookings/id/1").expect(204);

      assert.strictEqual(mockBookingService.remove.mock.callCount(), 1);
      assert.strictEqual(
        mockBookingService.remove.mock.calls[0].arguments[0],
        1
      );
    });
  });

  describe("Private Bookings Router", () => {
    it("GET /my-bookings should return bookings for the current user", async () => {
      mockBookingService.findByUserId.mock.mockImplementation(() =>
        Promise.resolve([sampleBooking])
      );

      const response = await request(privateApp)
        .get("/bookings/my-bookings")
        .expect(200);

      assert.deepStrictEqual(response.body, [sampleBooking]);
      assert.strictEqual(mockBookingService.findByUserId.mock.callCount(), 1);
      assert.strictEqual(
        mockBookingService.findByUserId.mock.calls[0].arguments[0],
        5 // User ID from mockUserAuth
      );
    });

    it("GET /:id should return a specific booking owned by the current user", async () => {
      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleBooking)
      );

      const response = await request(privateApp).get("/bookings/1").expect(200);

      assert.deepStrictEqual(response.body, sampleBooking);
      assert.strictEqual(mockBookingService.findById.mock.callCount(), 1);
    });

    it("GET /:id should return 404 if booking is not owned by the current user", async () => {
      const otherUserBooking = {
        ...sampleBooking,
        user: {
          id: 6, // Different from the authenticated user (5)
          email: "other@example.com",
          displayName: "Other User",
        },
      };

      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(otherUserBooking)
      );

      await request(privateApp).get("/bookings/1").expect(404);
    });

    it("POST / should create a new booking for the current user", async () => {
      const newBookingData = {
        startDate: "2025-03-01",
        endDate: "2025-03-30",
        status: BookingStatus.PENDING_APPROVAL,
        items: [{ itemId: 5, quantity: 1 }],
      };

      const createdBooking = {
        id: 3,
        user: {
          id: 5,
          email: "user@example.com",
          displayName: "Test User",
        },
        startDate: `${new Date("2025-03-01")}`,
        endDate: `${new Date("2025-03-30")}`,
        status: BookingStatus.PENDING_APPROVAL,
        createdAt: `${new Date()}`,
        items: [
          {
            id: 3,
            itemId: 5,
            quantity: 1,
          },
        ],
      };

      mockBookingService.createCompleteBooking.mock.mockImplementation(() =>
        Promise.resolve(createdBooking)
      );

      const response = await request(privateApp)
        .post("/bookings")
        .send(newBookingData)
        .expect(201);

      assert.deepStrictEqual(response.body, createdBooking);
      assert.strictEqual(
        mockBookingService.createCompleteBooking.mock.callCount(),
        1
      );

      // Check that the userId was automatically set to the current user's ID
      const serviceCallArg =
        mockBookingService.createCompleteBooking.mock.calls[0].arguments[0];
      assert.strictEqual(serviceCallArg.userId, 5);
      assert.strictEqual(serviceCallArg.startDate, newBookingData.startDate);
      assert.strictEqual(serviceCallArg.endDate, newBookingData.endDate);
      assert.strictEqual(serviceCallArg.status, newBookingData.status);
      assert.deepStrictEqual(serviceCallArg.items, newBookingData.items);
    });

    it("PUT /:id should update a booking owned by the current user", async () => {
      const updateData = {
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        items: [{ id: 1, itemId: 5, quantity: 3 }],
      };

      const updatedBooking = {
        ...sampleBooking,
        startDate: `${new Date("2025-04-01")}`,
        endDate: `${new Date("2025-04-30")}`,
        items: [
          {
            id: 1,
            itemId: 5,
            quantity: 3,
          },
        ],
      };

      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleBooking)
      );

      mockBookingService.updateCompleteBooking.mock.mockImplementation(() =>
        Promise.resolve(updatedBooking)
      );

      const response = await request(privateApp)
        .put("/bookings/1")
        .send(updateData)
        .expect(200);

      assert.deepStrictEqual(response.body, updatedBooking);
      assert.strictEqual(
        mockBookingService.updateCompleteBooking.mock.callCount(),
        1
      );

      // Check that the userId was set to the current user's ID and status preserved
      const serviceCallArg =
        mockBookingService.updateCompleteBooking.mock.calls[0].arguments[0];
      assert.strictEqual(serviceCallArg.id, 1);
      assert.strictEqual(serviceCallArg.userId, 5);
      assert.strictEqual(serviceCallArg.status, sampleBooking.status);
    });

    it("DELETE /:id should delete a booking owned by the current user", async () => {
      mockBookingService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleBooking)
      );

      mockBookingService.remove.mock.mockImplementation(() =>
        Promise.resolve()
      );

      await request(privateApp).delete("/bookings/1").expect(204);

      assert.strictEqual(mockBookingService.remove.mock.callCount(), 1);
      assert.strictEqual(
        mockBookingService.remove.mock.calls[0].arguments[0],
        1
      );
    });
  });
});

// After all tests, restore the original functions
after(() => {
  Object.keys(originalBookingService).forEach((key) => {
    bookingService[key] = originalBookingService[key];
  });
});
