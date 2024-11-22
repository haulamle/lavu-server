import { Router } from "express";
import {
  addCategory,
  addProducts,
  addSubProduct,
  deleteCategories,
  getCategories,
  getCategoryDetail,
  getProductDetail,
  getProducts,
  removeProduct,
  updateCategory,
  updateProduct,
} from "../controllers/products";

const router = Router();
router.get("/", getProducts);
router.get("/detail", getProductDetail);
router.post("/add-new", addProducts);
router.post("/add-sub-product", addSubProduct);
router.delete("/delete", removeProduct);
router.put("/update", updateProduct);

//category
router.post("/add-category", addCategory);
router.get("/get-categories", getCategories);
router.get("/categories/detail", getCategoryDetail);
router.delete("/delete-categories", deleteCategories);
router.put("/update-category", updateCategory);
export default router;
