import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { Category } from "../models/index";
import { InferCreationAttributes } from "sequelize";
import * as categoryService from "../services/categoryService";

interface CategoryRequest extends Request {
  category: Category | null;
}

type CategoryCreationAttributes = InferCreationAttributes<Category>;

interface CategoryUpdateRequest {
  name?: string;
  description?: string;
}

const categoriesRouter = Router();

const categoryFinder = async (req: CategoryRequest, _res: Response, next: NextFunction) => {
  req.category = await categoryService.findById(req.params.id);
  next();
};

// Get all categories
categoriesRouter.get("/", async (_req: Request, res: Response) => {
  const categories = await categoryService.findAll();
  res.json(categories);
});

// Create a new category
categoriesRouter.post("/", async (req: Request<{}, {}, CategoryCreationAttributes>, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// Get a specific category by ID
categoriesRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => categoryFinder(req as CategoryRequest, res, next), (req, res) => {
  if ((req as CategoryRequest).category) {
    res.json((req as CategoryRequest).category);
  } else {
    res.status(404).end();
  }
});

// Get a category with its items
categoriesRouter.get('/:id/items', async (req: Request, res: Response) => {
  const categoryWithItems = await categoryService.findWithItems(req.params.id);
  
  if (categoryWithItems) {
    res.json(categoryWithItems);
  } else {
    res.status(404).end();
  }
});

// Update a category
categoriesRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => categoryFinder(req as CategoryRequest, res, next), async (req: Request<{id: string}, {}, CategoryUpdateRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const typedReq = req as unknown as CategoryRequest;
    const category = typedReq.category;
    
    if (!category) {
      res.status(404).end();
      return;
    }
    
    const updatedCategory = await categoryService.update(category, req.body);
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

// Delete a category
categoriesRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => categoryFinder(req as CategoryRequest, res, next), async (req, res) => {
  const typedReq = req as unknown as CategoryRequest;
  const category = typedReq.category;

  if (category) {
    await categoryService.remove(category);
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

export { categoriesRouter }; 