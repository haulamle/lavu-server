import CategoryModel from "../models/CategoriModel";

const getProducts = async (req: any, res: any) => {
  try {
    res.status(200).json({
      data: [],
      message: "Get products successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

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
  try {
    const categories = await CategoryModel.find();
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
export { getProducts, addCategory, getCategories };
