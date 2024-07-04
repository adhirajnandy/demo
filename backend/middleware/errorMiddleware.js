const notFound = (req, res, next) =>
    {
        const error = new Error(`Not Found - ${req.originalUrl}`);
        res.status(404);
        next(error);
    };

const errorHandler = (err,req,res,next) => {
    let statusCode = res.statusCode === 200 ? 500 :res.statusCode;
    let message = err.message;

    // Check for Mongoose bad Object Id
    if(err.name === 'CastError' && err.kind === 'ObjectId'){
        message = `Order not found`;
        statusCode = 404;
    }

    res.status(statusCode).json({
        message,
    })
}

export { notFound, errorHandler };