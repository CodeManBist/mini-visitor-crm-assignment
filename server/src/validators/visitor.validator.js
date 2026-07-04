import { body, validationResult } from "express-validator";

export const visitorValidation = [
  body("visitorName")
    .trim()
    .notEmpty()
    .withMessage("Visitor name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Visitor name must be between 2 and 50 characters"),

  body("phone")
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please provide a valid 10-digit phone number"),

  body("personToMeet")
    .trim()
    .notEmpty()
    .withMessage("Person to meet is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Person to meet must be between 2 and 50 characters"),

  body("purpose")
    .trim()
    .notEmpty()
    .withMessage("Purpose is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Purpose must be between 3 and 100 characters"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};