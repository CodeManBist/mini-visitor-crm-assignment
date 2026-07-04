import Customer from "../models/customer.model.js";
import asyncHandler from "express-async-handler";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);

  return ApiResponse.success(res, "Customer created successfully", customer, 201);
});

export const getCustomers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ],
  };

  const total = await Customer.countDocuments(query);

  const customers = await Customer.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return ApiResponse.success(res, "Customers fetched successfully", {
    total,
    page,
    pages: Math.ceil(total / limit),
    data: customers,
  });
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return ApiResponse.success(res, "Customer fetched successfully", customer);
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return ApiResponse.success(res, "Customer updated successfully", customer);
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return ApiResponse.success(res, "Customer deleted successfully", null);
});