import { Request, Response } from "express";
import CategoryModel from "../models/CategoriModel";
import ProductModel from "../models/ProductModel";
import SubProductModel from "../models/SubProductModel";

const addCategory = async (req: any, res: any) => {
  const body = req.body;
  const { parentId, title, description, slug } = body;
  try {
    const category = await CategoryModel.find({
      $and: [{ slug }, { parentId }],
    });
    if (category.length > 0) {
      throw new Error("Category already exists");
    }

    const newCategory = new CategoryModel(body);
    await newCategory.save();

    res.status(200).json({
      data: newCategory,
      message: "add category successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const getCategories = async (req: any, res: any) => {
  const { page, pageSize } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(pageSize);
    const categories = await CategoryModel.find({
      $or: [{ isDeleted: false }, { isDeleted: null }],
    })
      .skip(skip)
      .limit(Number(pageSize));
    res.status(200).json({
      data: categories,
      message: "add category successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const getCategoryDetail = async (req: any, res: any) => {
  const { id } = req.query;

  try {
    const item = await CategoryModel.findById(id);

    res.status(200).json({
      data: item,
      message: "add category successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const finAndRemoveCategoryInProducts = async (id: string) => {
  const items = await CategoryModel.find({ parentId: id });
  if (items && items.length > 0) {
    items.forEach(async (item: any) => {
      finAndRemoveCategoryInProducts(item._id);
    });
  }
  await handleRemoveCategoryInProducts(id);
};

const handleRemoveCategoryInProducts = async (id: string) => {
  await CategoryModel.findByIdAndDelete(id);
  const products = await ProductModel.find({ categories: { $all: id } });

  if (products && products.length > 0) {
    products.forEach(async (item: any) => {
      const cats = item._doc.categories;

      const index = cats.findIndex((cat: any) => cat === id);
      if (index !== -1) {
        cats.splice(index, 1);
      }

      await ProductModel.findByIdAndUpdate(item._id, {
        categories: cats,
      });
    });
  }
};

const deleteCategories = async (req: any, res: any) => {
  const { id, isDeleted } = req.query;

  try {
    // if (isDeleted) {
    //   await CategoryModel.findByIdAndDelete(id);
    // } else {
    //   await CategoryModel.findByIdAndUpdate(id, {
    //     isDeleted: false,
    //   });
    // }
    await finAndRemoveCategoryInProducts(id);

    res.status(200).json({
      data: [],
      message: "Delete category successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const updateCategory = async (req: any, res: any) => {
  const { id } = req.query;
  const body = req.body;

  try {
    await CategoryModel.findByIdAndUpdate(id, body);
    const category = await CategoryModel.findById(id);
    res.status(200).json({
      data: category,
      message: "Update category successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Products

const getProducts = async (req: any, res: any) => {
  const { page, pageSize } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(pageSize);
    const products = await ProductModel.find({
      isDeleted: false,
    })
      .skip(skip)
      .limit(Number(pageSize));

    const items: any = [];

    if (products.length > 0) {
      products.forEach(async (item: any) => {
        const children = await SubProductModel.find({
          productId: item._id,
        });
        items.push({
          ...item._doc,
          subItems: children,
        });

        items.length === products.length &&
          res.status(200).json({
            data: items,
            message: "Get products successfully!!!",
          });
      });
    } else {
      res.status(200).json({
        data: [],
        message: "Get products successfully!!!",
      });
    }
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};
const getProductDetail = async (req: any, res: any) => {
  const { id } = req.query;
  try {
    const item = await ProductModel.findById(id);

    res.status(200).json({
      data: item,
      message: " successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const addProducts = async (req: any, res: any) => {
  const body = req.body;
  try {
    const newProduct = new ProductModel(body);
    await newProduct.save();

    res.status(200).json({
      data: newProduct,
      message: "add products successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req: any, res: any) => {
  const { id } = req.query;
  const body = req.body;

  try {
    await ProductModel.findByIdAndUpdate(id, body);
    const product = await ProductModel.findById(id);

    res.status(200).json({
      data: product,
      message: "Update product successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const addSubProduct = async (req: any, res: any) => {
  const body = req.body;
  try {
    const subProducts = new SubProductModel(body);
    await subProducts.save();

    res.status(200).json({
      data: subProducts,
      message: "add subProducts successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const handleRemoveSubProduct = async (items: any[]) => {
  items.forEach(async (item: any) => {
    await SubProductModel.findByIdAndUpdate(item._id, { isDeleted: true });
  });
};

const removeProduct = async (req: any, res: any) => {
  const { id } = req.query;
  try {
    const subItems = await SubProductModel.find({ productId: id });
    if (subItems.length > 0) {
      await handleRemoveSubProduct(subItems);
    }
    await ProductModel.findByIdAndUpdate(id, { isDeleted: true });

    res.status(200).json({
      message: "remove subProducts successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export {
  getProducts,
  addCategory,
  updateCategory,
  getCategories,
  deleteCategories,
  addProducts,
  getCategoryDetail,
  addSubProduct,
  removeProduct,
  getProductDetail,
  updateProduct,
};
