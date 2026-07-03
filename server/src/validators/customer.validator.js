import { body } from "express-validator";

export const customerValidation = [

    body("name")
        .notEmpty()
        .withMessage("Name Required"),

    body("email")
        .isEmail()
        .withMessage("Invalid Email"),

    body("phone")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone Must Be 10 Digits"),

    body("company")
        .notEmpty()
        .withMessage("Company Required")

];