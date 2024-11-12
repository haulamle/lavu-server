import { Router } from "express";
import {
  addCategory,
  addProducts,
  addSubProduct,
  deleteCategories,
  getCategories,
  getCategoryDetail,
  getProducts,
  removeProduct,
  updateCategory,
} from "../controllers/products";

const router = Router();
router.get("/", getProducts);
router.post("/add-new", addProducts);
router.post("/add-sub-product", addSubProduct);
router.delete("/delete", removeProduct);

//category
router.post("/add-category", addCategory);
router.get("/get-categories", getCategories);
router.get("/categories/detail", getCategoryDetail);
router.delete("/delete-categories", deleteCategories);
router.put("/update-category", updateCategory);
export default router;
