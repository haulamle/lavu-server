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
exports.getExportData = exports.getForm = exports.removeSupplier = exports.update = exports.getSuppliers = exports.addNew = void 0;
const SupplierModel_1 = __importDefault(require("../models/SupplierModel"));
const supplier_1 = require("../forms/supplier");
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize } = req.query;
    try {
        const skip = (Number(page) - 1) * Number(pageSize);
        const items = yield SupplierModel_1.default.find({ isDeleted: false })
            .skip(skip)
            .limit(Number(pageSize));
        const total = yield SupplierModel_1.default.countDocuments({ isDeleted: false });
        res.status(200).json({
            data: {
                items,
                total,
            },
            message: "Get suppliers successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getSuppliers = getSuppliers;
const addNew = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const newSupplier = new SupplierModel_1.default(body);
        newSupplier.save();
        res.status(200).json({
            data: newSupplier,
            message: "add new supplier successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.addNew = addNew;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        yield SupplierModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            data: [],
            message: "update supplier successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.update = update;
const removeSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        yield SupplierModel_1.default.findByIdAndUpdate(id, { isDeleted: true });
        res.status(200).json({
            data: [],
            message: "delete supplier successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.removeSupplier = removeSupplier;
const getForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = {
            title: "Supplier",
            layout: "horizontal",
            labelCol: 6,
            wrapperCol: 18,
            formItems: supplier_1.supplierForm,
        };
        res.status(200).json({
            message: "",
            data: form,
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getForm = getForm;
const getExportData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { start, end } = req.query;
    const filter = {};
    if (start && end) {
        filter.createdAt = {
            $gte: new Date(start),
            $lte: new Date(end),
        };
    }
    try {
        const items = yield SupplierModel_1.default.find(filter);
        const data = [];
        if (items.length > 0) {
            items.forEach((item) => {
                const value = {};
                body.forEach((key) => {
                    value[key] = item[key] ? item[key] : "";
                });
                data.push(value);
            });
        }
        res.status(200).json({
            data,
            message: "export suppliers successfully!!!",
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getExportData = getExportData;
//# sourceMappingURL=supplier.js.map