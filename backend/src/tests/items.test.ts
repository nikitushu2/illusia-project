// @ts-nocheck
import { describe, it, beforeEach, after } from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";
import {
  privateItemsRouter,
  publicItemsRouter,
  adminItemsRouter,
} from "../controllers/items";
import * as itemService from "../services/itemService";
import { mock } from "node:test";

// Mock authentication middleware
const mockAuth = (req, _res, next) => {
  req.applicationUser = { id: 1, role: "USER" };
  next();
};

const mockAdminAuth = (req, _res, next) => {
  req.applicationUser = { id: 1, role: "ADMIN" };
  next();
};

// Create test app with the routers
const app = express();
app.use(express.json());
app.use("/public/items", publicItemsRouter);
app.use("/private/items", mockAuth, privateItemsRouter);
app.use("/admin/items", mockAdminAuth, adminItemsRouter);

// Sample item data
const sampleItem = {
  id: 1,
  name: "Test Item",
  description: "Test Description",
  imageUrl: "http://example.com/image.jpg",
  price: 99.99,
  quantity: 10,
  categoryId: 1,
  createdAt: `${new Date()}`,
  updatedAt: `${new Date()}`,
  size: "Medium",
  color: "Black",
  itemLocation: "Helsinki",
  storageLocation: "Room 1",
  availability: true,
};

const originalItemService = { ...itemService };
const mockItemService = {
  findAll: mock.fn(),
  findById: mock.fn(),
  findByCategory: mock.fn(),
  search: mock.fn(),
  create: mock.fn(),
  update: mock.fn(),
  remove: mock.fn(),
};

// Replace the original functions with mocks
Object.keys(mockItemService).forEach((key) => {
  itemService[key] = mockItemService[key];
});

describe("Items Controller", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    Object.keys(mockItemService).forEach((key) => {
      mockItemService[key].mock.resetCalls();
    });
  });

  // PUBLIC ROUTER TESTS
  describe("Public Items Router", () => {
    it("GET / should return all items", async () => {
      
      mockItemService.findAll.mock.mockImplementation(() =>
        Promise.resolve([sampleItem])
      );

      const response = await request(app).get("/public/items").expect(200);

      assert.deepStrictEqual(response.body, [sampleItem]);
      assert.strictEqual(mockItemService.findAll.mock.callCount(), 1);
    });

    it("GET /category/:categoryId should return items by category", async () => {
      // Setup mock
      mockItemService.findByCategory.mock.mockImplementation(() =>
        Promise.resolve([sampleItem])
      );

      // Make request
      const response = await request(app)
        .get("/public/items/category/1")
        .expect(200);

      // Assertions
      assert.deepStrictEqual(response.body, [sampleItem]);
      assert.strictEqual(mockItemService.findByCategory.mock.callCount(), 1);
      assert.strictEqual(
        mockItemService.findByCategory.mock.calls[0].arguments[0],
        1
      );
    });

    it("GET /search should return items matching search query", async () => {
      // Setup mock
      mockItemService.search.mock.mockImplementation(() =>
        Promise.resolve([sampleItem])
      );

      // Make request
      const response = await request(app)
        .get("/public/items/search?q=test")
        .expect(200);

      // Assertions
      assert.deepStrictEqual(response.body, [sampleItem]);
      assert.strictEqual(mockItemService.search.mock.callCount(), 1);
      assert.strictEqual(
        mockItemService.search.mock.calls[0].arguments[0],
        "test"
      );
    });

    it("GET /search should return 400 if query is missing", async () => {
      await request(app)
        .get("/public/items/search")
        .expect(400)
        .expect((res) => {
          assert.deepStrictEqual(res.body, {
            error: "Search query is required",
          });
        });
    });

    it("GET /:id should return a specific item", async () => {
      // Setup mock
      mockItemService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleItem)
      );

      // Make request
      const response = await request(app).get("/public/items/1").expect(200);

      // Assertions
      assert.deepStrictEqual(response.body, sampleItem);
      assert.strictEqual(mockItemService.findById.mock.callCount(), 1);
      assert.strictEqual(
        mockItemService.findById.mock.calls[0].arguments[0],
        1
      );
    });

    it("GET /:id should return 404 if item not found", async () => {
      // Setup mock
      mockItemService.findById.mock.mockImplementation(() =>
        Promise.resolve(null)
      );

      // Make request
      await request(app).get("/public/items/999").expect(404);
    });
  });

  // PRIVATE ROUTER TESTS
  describe("Private Items Router", () => {
    it("POST / should create a new item", async () => {
      // Setup mock
      const newItemData = {
        name: "New Item",
        description: "New Description",
        price: 49.99,
        quantity: 5,
        categoryId: 2,
      };

      mockItemService.create.mock.mockImplementation(() =>
        Promise.resolve({
          id: 2,
          ...newItemData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      // Make request
      const response = await request(app)
        .post("/private/items")
        .send(newItemData)
        .expect(201);

      // Assertions
      assert.strictEqual(response.body.name, newItemData.name);
      assert.strictEqual(mockItemService.create.mock.callCount(), 1);
      assert.deepStrictEqual(
        mockItemService.create.mock.calls[0].arguments[0],
        newItemData
      );
    });

    it("GET /:id should return a specific item for authenticated users", async () => {
      // Setup mock
      mockItemService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleItem)
      );

      // Make request
      const response = await request(app).get("/private/items/1").expect(200);

      // Assertions
      assert.deepStrictEqual(response.body, sampleItem);
    });

    it("PUT /:id should update an item", async () => {
      // Setup mocks
      const updateData = {
        name: "Updated Item",
        price: 79.99,
      };

      const updatedItem = {
        ...sampleItem,
        ...updateData,
      };

      mockItemService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleItem)
      );
      mockItemService.update.mock.mockImplementation(() =>
        Promise.resolve(updatedItem)
      );

      // Make request
      const response = await request(app)
        .put("/private/items/1")
        .send(updateData)
        .expect(200);

      // Assertions
      assert.deepStrictEqual(response.body, updatedItem);
      assert.strictEqual(mockItemService.update.mock.callCount(), 1);
      assert.strictEqual(mockItemService.update.mock.calls[0].arguments[0], 1);
      assert.deepStrictEqual(
        mockItemService.update.mock.calls[0].arguments[1],
        updateData
      );
    });

    it("PUT /:id should return 404 if item not found", async () => {
      // Setup mock
      mockItemService.findById.mock.mockImplementation(() =>
        Promise.resolve(null)
      );

      // Make request
      await request(app)
        .put("/private/items/999")
        .send({ name: "Updated Item" })
        .expect(404);
    });
  });

  // ADMIN ROUTER TESTS
  describe("Admin Items Router", () => {
    it("PUT /:id should update an item (admin version)", async () => {
      // Setup mocks
      const updateData = {
        name: "Updated Item",
        price: 79.99,
      };

      const updatedItem = {
        ...sampleItem,
        ...updateData,
      };

      mockItemService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleItem)
      );
      mockItemService.update.mock.mockImplementation(() =>
        Promise.resolve(updatedItem)
      );

      // Make request
      const response = await request(app)
        .put("/admin/items/1")
        .send(updateData)
        .expect(200);

      // Assertions
      assert.deepStrictEqual(response.body, updatedItem);
      assert.strictEqual(mockItemService.update.mock.callCount(), 1);
      assert.strictEqual(mockItemService.update.mock.calls[0].arguments[0], 1);
      assert.deepStrictEqual(
        mockItemService.update.mock.calls[0].arguments[1],
        updateData
      );
    });

    it("PATCH /:id/quantity should update just the quantity of an item", async () => {
      // Setup mocks
      const quantityUpdate = { quantity: 15 };
      const updatedItem = { ...sampleItem, quantity: 15 };

      mockItemService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleItem)
      );
      mockItemService.update.mock.mockImplementation(() =>
        Promise.resolve(updatedItem)
      );

      // Make request
      const response = await request(app)
        .patch("/admin/items/1/quantity")
        .send(quantityUpdate)
        .expect(200);

      // Assertions
      assert.deepStrictEqual(response.body, updatedItem);
      assert.strictEqual(mockItemService.update.mock.callCount(), 1);
      assert.strictEqual(mockItemService.update.mock.calls[0].arguments[0], 1);
      assert.deepStrictEqual(
        mockItemService.update.mock.calls[0].arguments[1],
        quantityUpdate
      );
    });

    it("DELETE /:id should delete an item", async () => {
      // Setup mocks
      mockItemService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleItem)
      );
      mockItemService.remove.mock.mockImplementation(() =>
        Promise.resolve(true)
      );

      // Make request
      await request(app).delete("/admin/items/1").expect(204);

      // Assertions
      assert.strictEqual(mockItemService.remove.mock.callCount(), 1);
      assert.strictEqual(mockItemService.remove.mock.calls[0].arguments[0], 1);
    });

    it("DELETE /:id should return 404 if item not found", async () => {
      // Setup mock
      mockItemService.findById.mock.mockImplementation(() =>
        Promise.resolve(null)
      );

      // Make request
      await request(app).delete("/admin/items/999").expect(404);
    });
  });
});

// After all tests, restore the original functions
after(() => {
  Object.keys(originalItemService).forEach((key) => {
    itemService[key] = originalItemService[key];
  });
});
