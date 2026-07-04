import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

    // If it's an instance of ApiError, use its statusCode and message
    if (err instanceof ApiError) {
        return ApiResponse.error(res, err.message, err.statusCode);
    }

    // For other errors, avoid leaking internals in production
    const message = err.message || "Internal Server Error";

    return ApiResponse.error(res, message, statusCode);
};

export default errorHandler;