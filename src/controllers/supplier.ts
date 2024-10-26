import SupplierModel from "../models/SupplierModel";
import { supplierForm } from "../forms/supplier";

const getSuppliers = async (req: any, res: any) => {
  const { page, pageSize } = req.query;
  try {
    const skip = (Number(page) - 1) * Number(pageSize);
    const items = await SupplierModel.find({ isDeleted: false })
      .skip(skip)
      .limit(Number(pageSize));
    const total = await SupplierModel.countDocuments({ isDeleted: false });
    res.status(200).json({
      data: {
        items,
        total,
      },
      message: "Get suppliers successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const addNew = async (req: any, res: any) => {
  const body = req.body;
  try {
    const newSupplier = new SupplierModel(body);
    newSupplier.save();

    res.status(200).json({
      data: newSupplier,
      message: "add new supplier successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const update = async (req: any, res: any) => {
  const body = req.body;
  const { id } = req.query;
  try {
    await SupplierModel.findByIdAndUpdate(id, body);

    res.status(200).json({
      data: [],
      message: "update supplier successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};
const removeSupplier = async (req: any, res: any) => {
  const { id } = req.query;
  try {
    await SupplierModel.findByIdAndUpdate(id, { isDeleted: true });
    res.status(200).json({
      data: [],
      message: "delete supplier successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const getForm = async (req: any, res: any) => {
  try {
    const form = {
      title: "Supplier",
      layout: "horizontal",
      labelCol: 6,
      wrapperCol: 18,
      formItems: supplierForm,
    };

    res.status(200).json({
      message: "",
      data: form,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const getExportData = async (req: any, res: any) => {
  const body = req.body;
  const { start, end } = req.query;
  const filter: any = {};
  if (start && end) {
    filter.createdAt = {
      $gte: new Date(start),
      $lte: new Date(end),
    };
  }
  try {
    const items = await SupplierModel.find(filter);
    const data: any = [];
    if (items.length > 0) {
      items.forEach((item: any) => {
        const value: any = {};
        body.forEach((key: any) => {
          value[key] = item[key] ? item[key] : "";
        });
        data.push(value);
      });
    }
    res.status(200).json({
      data,
      message: "export suppliers successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export { addNew, getSuppliers, update, removeSupplier, getForm, getExportData };
