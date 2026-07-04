import express from "express";

import protect from "../middlewares/auth.middleware.js";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";

import {
  customerValidation,
  validate,
} from "../validators/customer.validator.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getCustomers)
  .post(customerValidation, validate, createCustomer);

router
  .route("/:id")
  .get(getCustomerById)
  .put(customerValidation, validate, updateCustomer)
  .delete(deleteCustomer);

export default router;