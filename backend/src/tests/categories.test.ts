// @ts-nocheck
import { describe, it, beforeEach, after } from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";
import { categoriesRouter } from "../controllers/categories";
import * as categoryService from "../services/categoryService";
import { mock } from "node:test";

// Create test app with the router
const app = express();
app.use(express.json());
app.use("/categories", categoriesRouter);

// Sample category data
const sampleCategory = {
  id: 1,
  name: "Test Category",
  description: "Test Description",
  createdAt: `${new Date()}`,
  updatedAt: `${new Date()}`,
};

const originalCategoryService = { ...categoryService };
const mockCategoryService = {
  findAll: mock.fn(),
  findById: mock.fn(),
  findWithItems: mock.fn(),
  create: mock.fn(),
  update: mock.fn(),
  remove: mock.fn(),
};

// Replace the original functions with mocks
Object.keys(mockCategoryService).forEach((key) => {
  categoryService[key] = mockCategoryService[key];
});

describe("Categories Controller", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    Object.keys(mockCategoryService).forEach((key) => {
      mockCategoryService[key].mock.resetCalls();
    });
  });

  describe("Categories Router", () => {
    it("GET / should return all categories", async () => {
      mockCategoryService.findAll.mock.mockImplementation(() =>
        Promise.resolve([sampleCategory])
      );

      const response = await request(app).get("/categories").expect(200);

      assert.deepStrictEqual(response.body, [sampleCategory]);
      assert.strictEqual(mockCategoryService.findAll.mock.callCount(), 1);
    });

    it("POST / should create a new category", async () => {
      const newCategoryData = {
        name: "New Category",
        description: "New Description",
      };

      mockCategoryService.create.mock.mockImplementation(() =>
        Promise.resolve({
          id: 2,
          ...newCategoryData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      const response = await request(app)
        .post("/categories")
        .send(newCategoryData)
        .expect(201);

      assert.strictEqual(response.body.name, newCategoryData.name);
      assert.strictEqual(mockCategoryService.create.mock.callCount(), 1);
      assert.deepStrictEqual(
        mockCategoryService.create.mock.calls[0].arguments[0],
        newCategoryData
      );
    });

    it("GET /:id should return a specific category", async () => {
      mockCategoryService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleCategory)
      );

      const response = await request(app).get("/categories/1").expect(200);

      assert.deepStrictEqual(response.body, sampleCategory);
      assert.strictEqual(mockCategoryService.findById.mock.callCount(), 1);
      assert.strictEqual(
        mockCategoryService.findById.mock.calls[0].arguments[0],
        "1"
      );
    });

    it("GET /:id should return 404 if category not found", async () => {
      mockCategoryService.findById.mock.mockImplementation(() =>
        Promise.resolve(null)
      );

      await request(app).get("/categories/999").expect(404);
    });

    it("GET /:id/items should return a category with its items", async () => {
      const categoryWithItems = {
        ...sampleCategory,
        items: [
          {
            id: 1,
            name: "Test Item",
            description: "Test Item Description",
            price: 99.99,
            categoryId: 1,
          },
        ],
      };

      mockCategoryService.findWithItems.mock.mockImplementation(() =>
        Promise.resolve(categoryWithItems)
      );

      const response = await request(app)
        .get("/categories/1/items")
        .expect(200);

      assert.deepStrictEqual(response.body, categoryWithItems);
      assert.strictEqual(mockCategoryService.findWithItems.mock.callCount(), 1);
      assert.strictEqual(
        mockCategoryService.findWithItems.mock.calls[0].arguments[0],
        "1"
      );
    });

    it("GET /:id/items should return 404 if category not found", async () => {
      mockCategoryService.findWithItems.mock.mockImplementation(() =>
        Promise.resolve(null)
      );

      await request(app).get("/categories/999/items").expect(404);
    });

    it("PUT /:id should update a category", async () => {
      const updateData = {
        name: "Updated Category",
        description: "Updated Description",
      };

      const updatedCategory = {
        ...sampleCategory,
        ...updateData,
      };

      mockCategoryService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleCategory)
      );
      mockCategoryService.update.mock.mockImplementation(() =>
        Promise.resolve(updatedCategory)
      );

      const response = await request(app)
        .put("/categories/1")
        .send(updateData)
        .expect(200);

      assert.deepStrictEqual(response.body, updatedCategory);
      assert.strictEqual(mockCategoryService.update.mock.callCount(), 1);
      assert.strictEqual(
        mockCategoryService.update.mock.calls[0].arguments[0],
        sampleCategory
      );
      assert.deepStrictEqual(
        mockCategoryService.update.mock.calls[0].arguments[1],
        updateData
      );
    });

    it("PUT /:id should return 404 if category not found", async () => {
      mockCategoryService.findById.mock.mockImplementation(() =>
        Promise.resolve(null)
      );

      await request(app)
        .put("/categories/999")
        .send({ name: "Updated Category" })
        .expect(404);
    });

    it("DELETE /:id should delete a category", async () => {
      mockCategoryService.findById.mock.mockImplementation(() =>
        Promise.resolve(sampleCategory)
      );
      mockCategoryService.remove.mock.mockImplementation(() =>
        Promise.resolve(true)
      );

      await request(app).delete("/categories/1").expect(204);

      assert.strictEqual(mockCategoryService.remove.mock.callCount(), 1);
      assert.strictEqual(
        mockCategoryService.remove.mock.calls[0].arguments[0],
        sampleCategory
      );
    });

    it("DELETE /:id should return 404 if category not found", async () => {
      mockCategoryService.findById.mock.mockImplementation(() =>
        Promise.resolve(null)
      );

      await request(app)
        .delete("/categories/999")
        .expect(404)
        .expect((res) => {
          assert.deepStrictEqual(res.body, { error: "Category not found" });
        });
    });
  });
});

// After all tests, restore the original functions
after(() => {
  Object.keys(originalCategoryService).forEach((key) => {
    categoryService[key] = originalCategoryService[key];
  });
});
