import mongoose from "mongoose";

import dotenv from 'dotenv'
dotenv.config()

const { MONGO_URI } = process.env;

export const connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};