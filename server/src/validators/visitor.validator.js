import { body } from "express-validator";

export const visitorValidation = [

    body("visitorName")
        .notEmpty(),

    body("phone")
        .isLength({ min: 10 }),

    body("personToMeet")
        .notEmpty(),

    body("purpose")
        .notEmpty()

];