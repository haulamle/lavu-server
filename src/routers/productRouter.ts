import { Router } from "express";
import {
  addCategory,
  addProducts,
  deleteCategories,
  getCategories,
  getProducts,
  updateCategory,
} from "../controllers/products";

const router = Router();
router.get("/", getProducts);
router.post("/add-new", addProducts);

//category
router.post("/add-category", addCategory);
router.get("/get-categories", getCategories);
router.delete("/delete-categories", deleteCategories);
router.put("/update-category", updateCategory);
export default router;
