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

export default {};
import asyncHandler from "express-async-handler";
import Visitor from "../models/visitor.model.js";


// ===============================
// Check In Visitor
// POST /api/visitors/checkin
// ===============================
export const checkInVisitor = asyncHandler(async (req, res) => {
  const {
    visitorName,
    phone,
    personToMeet,
    purpose,
  } = req.body;

  const visitor = await Visitor.create({
    visitorName,
    phone,
    personToMeet,
    purpose,
  });

  res.status(201).json({
    success: true,
    message: "Visitor checked in successfully.",
    data: visitor,
  });
});


// ===============================
// Get All Visitors
// GET /api/visitors
// ===============================
export const getVisitors = asyncHandler(async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const query = {
    $or: [
      {
        visitorName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        personToMeet: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  };

  const totalVisitors = await Visitor.countDocuments(query);

  const visitors = await Visitor.find(query)
    .sort({ checkInTime: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,

    totalVisitors,

    currentPage: page,

    totalPages: Math.ceil(totalVisitors / limit),

    data: visitors,
  });

});


// ===============================
// Get Visitor By ID
// GET /api/visitors/:id
// ===============================
export const getVisitorById = asyncHandler(async (req, res) => {

  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {

    res.status(404);

    throw new Error("Visitor not found");

  }

  res.status(200).json({

    success: true,

    data: visitor,

  });

});


// ===============================
// Check Out Visitor
// PUT /api/visitors/:id/checkout
// ===============================
export const checkOutVisitor = asyncHandler(async (req, res) => {

  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {

    res.status(404);

    throw new Error("Visitor not found");

  }

  if (visitor.isCheckedOut) {

    res.status(400);

    throw new Error("Visitor already checked out");

  }

  visitor.isCheckedOut = true;

  visitor.checkOutTime = new Date();

  await visitor.save();

  res.status(200).json({

    success: true,

    message: "Visitor checked out successfully.",

    data: visitor,

  });

});


// ===============================
// Visitor History
// GET /api/visitors/history
// ===============================
export const getVisitorHistory = asyncHandler(async (req, res) => {

  const history = await Visitor.find()
    .sort({
      checkInTime: -1,
    });

  res.status(200).json({

    success: true,

    count: history.length,

    data: history,

  });

});