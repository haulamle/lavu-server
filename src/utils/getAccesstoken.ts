import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const getAccesstoken = async (payload: {
  _id: Types.ObjectId;
  email: string;
  rule: number;
}) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
    // expiresIn: "1d",
  });
  return token;
};
