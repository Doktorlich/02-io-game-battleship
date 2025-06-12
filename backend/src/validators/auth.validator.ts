import { body } from "express-validator";
import User from "../models/user.model";

export const registerValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email.")
        .isLength({ min: 5, max: 50 })
        .withMessage("E-mail must be at least 5 characters long.")
        .custom(async (value, { req }) => {
            const userDoc = await User.findOne({ email: value });
            if (userDoc) {
                return Promise.reject("E-mail address already exists.");
            }
        })
        .normalizeEmail(),
    body("name").trim().notEmpty().isLength({ min: 5, max: 50 }),
    body("password")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long"),
    body("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password have to match!");
            }
            return true;
        }),
];
