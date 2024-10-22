import SupplierModel from "../models/SupplierModel";

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
export { addNew, getSuppliers, update, removeSupplier };
