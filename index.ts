// src/index.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const dbUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@kan-ban.ugbyo.mongodb.net/?retryWrites=true&w=majority&appName=kan-ban`;
app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
