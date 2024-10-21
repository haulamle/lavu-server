import SupplierModel from "../models/SupplierModel";

// const getProducts = async (req: any, res: any) => {
//   try {
//     res.status(200).json({
//       data: [],
//       message: "Get products successfully!!!",
//     });
//   } catch (error: any) {
//     res.status(404).json({
//       message: error.message,
//     });
//   }
// };

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
export { addNew };
