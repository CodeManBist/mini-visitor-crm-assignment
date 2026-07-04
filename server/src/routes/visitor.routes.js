import express from "express";

import protect from "../middlewares/auth.middleware.js";

import {
  checkInVisitor,
  checkOutVisitor,
  getVisitors,
  getVisitorById,
  getVisitorHistory,
} from "../controllers/visitor.controller.js";

import {
  visitorValidation,
  validate,
} from "../validators/visitor.validator.js";

const router = express.Router();

// Protect all visitor routes
router.use(protect);

// Visitor Check In (create visitor resource)
router.post("/", visitorValidation, validate, checkInVisitor);

// Get All Visitors (Search + Pagination)
router.get("/", getVisitors);

// Visitor History
router.get("/history", getVisitorHistory);

// Get Visitor By ID
router.get("/:id", getVisitorById);

// Visitor Check Out
router.put("/:id/checkout", checkOutVisitor);

export default router;