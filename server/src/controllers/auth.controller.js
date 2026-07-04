import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = generateToken(user._id);

    return ApiResponse.success(res, "Login successful", { token, user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }});
});