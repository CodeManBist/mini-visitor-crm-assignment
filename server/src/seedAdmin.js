import dotenv from "dotenv";
dotenv.config();

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
      process.exit(0);
    }

    await User.create({
      name: "Admin",
      email: "admin@crm.com",
      password: "Admin@123", // Plain password
      role: "Admin",
    });

    console.log("✅ Admin Created Successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();