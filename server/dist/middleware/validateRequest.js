import { ZodError } from "zod";
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Parse the request body. If valid, req.body is updated with parsed/typed data
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                // Return a formatted error response to the client
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.message
                });
                return; // Ensure the request doesn't proceed to the controller
            }
            next(error);
        }
    };
};
//# sourceMappingURL=validateRequest.js.map