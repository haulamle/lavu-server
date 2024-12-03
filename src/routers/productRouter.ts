import { Router } from "express";
import {
  addCategory,
  addProducts,
  addSubProduct,
  deleteCategories,
  filterProducts,
  getCategories,
  getCategoryDetail,
  getFilterValues,
  getProductDetail,
  getProducts,
  removeProduct,
  removeSubProduct,
  updateCategory,
  updateProduct,
  updateSubProduct,
} from "../controllers/products";

const router = Router();
router.get("/", getProducts);
router.get("/detail", getProductDetail);
router.post("/add-new", addProducts);
router.post("/add-sub-product", addSubProduct);
router.delete("/delete", removeProduct);
router.put("/update", updateProduct);
router.delete("/remove-sub-product", removeSubProduct);
router.put("/update-sub-product", updateSubProduct);

//category
router.post("/add-category", addCategory);
router.get("/get-categories", getCategories);
router.get("/categories/detail", getCategoryDetail);
router.delete("/delete-categories", deleteCategories);
router.put("/update-category", updateCategory);
router.get("/get-filter-values", getFilterValues);
router.post("/filter-products", filterProducts);
export default router;
