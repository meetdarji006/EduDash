class ApiResponse<T = unknown> {
    statusCode: number;
    data: T | null;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: T | null, message: string, success = true) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success;
    }
}
export { ApiResponse };

class ErrorResponse extends Error {
    statusCode: number;
    data: null;
    success: boolean;
    override message : string;

    constructor(
        statusCode: number,
        message = "Something went wrong",
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
    }
}
export { ErrorResponse }
