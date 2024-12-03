"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubProduct = exports.removeSubProduct = exports.filterProducts = exports.getFilterValues = exports.updateProduct = exports.getProductDetail = exports.removeProduct = exports.addSubProduct = exports.getCategoryDetail = exports.addProducts = exports.deleteCategories = exports.getCategories = exports.updateCategory = exports.addCategory = exports.getProducts = void 0;
const CategoriModel_1 = __importDefault(require("../models/CategoriModel"));
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const SubProductModel_1 = __importDefault(require("../models/SubProductModel"));
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { parentId, title, description, slug } = body;
    try {
        const category = yield CategoriModel_1.default.find({
            $and: [{ slug }, { parentId }],
        });
        if (category.length > 0) {
            throw new Error("Category already exists");
        }
        const newCategory = new CategoriModel_1.default(body);
        yield newCategory.save();
        res.status(200).json({
            data: newCategory,
            message: "add category successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.addCategory = addCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize } = req.query;
    try {
        const skip = (Number(page) - 1) * Number(pageSize);
        const categories = yield CategoriModel_1.default.find({
            $or: [{ isDeleted: false }, { isDeleted: null }],
        })
            .skip(skip)
            .limit(Number(pageSize));
        res.status(200).json({
            data: categories,
            message: "add category successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getCategories = getCategories;
const getCategoryDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const item = yield CategoriModel_1.default.findById(id);
        res.status(200).json({
            data: item,
            message: "add category successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getCategoryDetail = getCategoryDetail;
const finAndRemoveCategoryInProducts = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield CategoriModel_1.default.find({ parentId: id });
    if (items && items.length > 0) {
        items.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            finAndRemoveCategoryInProducts(item._id);
        }));
    }
    yield handleRemoveCategoryInProducts(id);
});
const handleRemoveCategoryInProducts = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield CategoriModel_1.default.findByIdAndDelete(id);
    const products = yield ProductModel_1.default.find({ categories: { $all: id } });
    if (products && products.length > 0) {
        products.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            const cats = item._doc.categories;
            const index = cats.findIndex((cat) => cat === id);
            if (index !== -1) {
                cats.splice(index, 1);
            }
            yield ProductModel_1.default.findByIdAndUpdate(item._id, {
                categories: cats,
            });
        }));
    }
});
const deleteCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, isDeleted } = req.query;
    try {
        // if (isDeleted) {
        //   await CategoryModel.findByIdAndDelete(id);
        // } else {
        //   await CategoryModel.findByIdAndUpdate(id, {
        //     isDeleted: false,
        //   });
        // }
        yield finAndRemoveCategoryInProducts(id);
        res.status(200).json({
            data: [],
            message: "Delete category successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.deleteCategories = deleteCategories;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const body = req.body;
    try {
        yield CategoriModel_1.default.findByIdAndUpdate(id, body);
        const category = yield CategoriModel_1.default.findById(id);
        res.status(200).json({
            data: category,
            message: "Update category successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.updateCategory = updateCategory;
// Products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize, title } = req.query;
    yield checkDeletedProduct();
    const filter = {};
    filter.isDeleted = false;
    if (title) {
        filter.slug = { $regex: title };
    }
    try {
        const skip = (Number(page) - 1) * Number(pageSize);
        const products = yield ProductModel_1.default.find(filter)
            .skip(skip)
            .limit(Number(pageSize));
        const items = [];
        if (products.length > 0) {
            products.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                const children = yield SubProductModel_1.default.find({
                    productId: item._id,
                    isDeleted: false,
                });
                items.push(Object.assign(Object.assign({}, item._doc), { subItems: children }));
                items.length === products.length &&
                    res.status(200).json({
                        data: {
                            items,
                            totalItems: yield ProductModel_1.default.find({
                                isDeleted: false,
                            }).countDocuments(),
                        },
                        message: "Get products successfully!!!",
                    });
            }));
        }
        else {
            res.status(200).json({
                data: [],
                message: "Get products successfully!!!",
            });
        }
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getProducts = getProducts;
const checkDeletedProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("get and check deleted product about 30 days from now");
});
const getProductDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const item = yield ProductModel_1.default.findById(id);
        const subProducts = yield SubProductModel_1.default.find({
            productId: id,
            isDeleted: false,
        });
        res.status(200).json({
            data: {
                product: item,
                subProducts,
            },
            message: " successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getProductDetail = getProductDetail;
const addProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const newProduct = new ProductModel_1.default(body);
        yield newProduct.save();
        res.status(200).json({
            data: newProduct,
            message: "add products successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.addProducts = addProducts;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const body = req.body;
    try {
        yield ProductModel_1.default.findByIdAndUpdate(id, body);
        const product = yield ProductModel_1.default.findById(id);
        res.status(200).json({
            data: product,
            message: "Update product successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.updateProduct = updateProduct;
const addSubProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const subProducts = new SubProductModel_1.default(body);
        yield subProducts.save();
        res.status(200).json({
            data: subProducts,
            message: "add subProducts successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.addSubProduct = addSubProduct;
const updateSubProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const body = req.body;
    try {
        yield SubProductModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: "Updated!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.updateSubProduct = updateSubProduct;
const removeSubProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, isSoftDelete } = req.query;
    try {
        if (isSoftDelete) {
            yield SubProductModel_1.default.findByIdAndUpdate(id, { isDeleted: true });
        }
        else {
            yield SubProductModel_1.default.findByIdAndDelete(id);
        }
        res.status(200).json({
            data: [],
            message: "remove subProducts successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.removeSubProduct = removeSubProduct;
const handleRemoveSubProduct = (items) => __awaiter(void 0, void 0, void 0, function* () {
    items.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        yield SubProductModel_1.default.findByIdAndUpdate(item._id, { isDeleted: true });
    }));
});
const removeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const subItems = yield SubProductModel_1.default.find({ productId: id });
        if (subItems.length > 0) {
            yield handleRemoveSubProduct(subItems);
        }
        yield ProductModel_1.default.findByIdAndUpdate(id, { isDeleted: true });
        res.status(200).json({
            message: "remove subProducts successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.removeProduct = removeProduct;
const getFilterValues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const datas = yield SubProductModel_1.default.find();
        const colors = [];
        const sizes = [];
        const prices = [];
        if (datas.length > 0) {
            datas.forEach((item) => {
                item.color && !colors.includes(item.color) && colors.push(item.color);
                item.size && sizes.push({ label: item.size, value: item.size });
                prices.push(item.price);
            });
        }
        res.status(200).json({
            data: {
                colors,
                sizes,
                prices,
            },
            message: "successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getFilterValues = getFilterValues;
const filterProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { colors, size, price, categories } = body;
    let filter = {};
    if (colors && colors.length > 0) {
        filter.color = { $all: colors };
    }
    if (size) {
        filter.size = { $eq: size };
    }
    if (price && price.length > 0) {
        filter["$and"] = [
            {
                price: { $lte: price[1] },
            },
            {
                price: {
                    $gte: price[0],
                },
            },
        ];
    }
    try {
        const subProducts = yield SubProductModel_1.default.find(filter);
        if (categories) {
        }
        else {
        }
        const productIds = [];
        const products = [];
        if (subProducts.length > 0) {
            subProducts.forEach((item) => !productIds.includes(item.productId) &&
                productIds.push(item.productId));
            productIds.forEach((id) => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield ProductModel_1.default.findById(id);
                const children = subProducts.filter((element) => element.productId === id);
                const items = Object.assign(Object.assign({}, product._doc), { subItems: children });
                products.push(items);
                if (products.length === productIds.length) {
                    res.status(200).json({
                        data: {
                            items: products,
                            totalItems: products.length,
                        },
                    });
                }
            }));
        }
        else {
            res.status(200).json({ data: [] });
        }
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.filterProducts = filterProducts;
//# sourceMappingURL=products.js.map