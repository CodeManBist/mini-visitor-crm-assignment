import asyncHandler from "express-async-handler";
import Customer from "../models/customer.model.js";
import Visitor from "../models/visitor.model.js";

export const getDashboardStats = asyncHandler(async (req, res) => {

  const totalCustomers = await Customer.countDocuments();

  const activeCustomers = await Customer.countDocuments({
    status: "Active",
  });

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  const visitorsToday = await Visitor.countDocuments({
    checkInTime: {
      $gte: today,
      $lt: tomorrow,
    },
  });

  const checkedInVisitors = await Visitor.countDocuments({
    isCheckedOut: false,
  });

  res.status(200).json({
    success: true,
    data: {
      totalCustomers,
      activeCustomers,
      visitorsToday,
      checkedInVisitors,
    },
  });

});