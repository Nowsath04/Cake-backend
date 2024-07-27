const ErrorMiddleware = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500

    let message = err.message;
    console.log(message);
    let error = new Error(message);
    if (err.name == "ValidationError") {
        message = Object.values(err.errors).map(value => value.message)
        error = new Error(message, 400)
    }
    return res.status(err.statusCode).json({
        success: false,
        message: error.message || "internal server error",
        stack: error.stack,
        error
    })
}

module.exports = ErrorMiddleware