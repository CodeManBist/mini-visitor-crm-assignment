import Visitor from "../models/visitor.model.js";
import asyncHandler from "express-async-handler";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Create a new visitor (check-in)
export const checkInVisitor = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  // Prevent duplicate active check-ins for the same phone
  const existing = await Visitor.findOne({ phone, isCheckedOut: false });
  if (existing) {
    throw new ApiError(409, "This visitor already has an active check-in");
  }

  const visitor = await Visitor.create(req.body);

  return ApiResponse.success(res, "Visitor checked in successfully", visitor, 201);
});

// Check out a visitor
export const checkOutVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) throw new ApiError(404, "Visitor not found");

  if (visitor.isCheckedOut) {
    throw new ApiError(400, "Visitor already checked out");
  }

  visitor.isCheckedOut = true;
  visitor.checkOutTime = new Date();

  await visitor.save();

  return ApiResponse.success(res, "Visitor checked out successfully", visitor);
});

// Get active visitors (with search + pagination)
export const getVisitors = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const query = {
    isCheckedOut: false,
    $or: [
      { visitorName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { personToMeet: { $regex: search, $options: "i" } },
    ],
  };

  const total = await Visitor.countDocuments(query);

  const visitors = await Visitor.find(query)
    .sort({ checkInTime: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return ApiResponse.success(res, "Active visitors fetched successfully", {
    total,
    page,
    pages: Math.ceil(total / limit),
    data: visitors,
  });
});

// Get visitor by id
export const getVisitorById = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) throw new ApiError(404, "Visitor not found");

  return ApiResponse.success(res, "Visitor fetched successfully", visitor);
});

// Get visitor history (checked-out visitors)
export const getVisitorHistory = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const query = {
    isCheckedOut: true,
    $or: [
      { visitorName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { personToMeet: { $regex: search, $options: "i" } },
    ],
  };

  const total = await Visitor.countDocuments(query);

  const visitors = await Visitor.find(query)
    .sort({ checkOutTime: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return ApiResponse.success(res, "Visitor history fetched successfully", {
    total,
    page,
    pages: Math.ceil(total / limit),
    data: visitors,
  });
});

 