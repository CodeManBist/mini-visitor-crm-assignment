import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/user.model.js";
import connectDB from "./config/db.js";

const seedAdmin = async () => {
  try {
    await connectDB();

    const exists = await User.findOne({
      email: "admin@crm.com",
    });

    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Admin",
      email: "admin@crm.com",
      password: hashedPassword,
      role: "Admin",
    });

    console.log("Admin Created Successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedAdmin();