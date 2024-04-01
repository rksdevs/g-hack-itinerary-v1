const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error);
}

const basicErrorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    //Bad object id
    if(err.name === 'CastError' && err.kind === "ObjectId") {
        message = "Resource Not Found";
        statusCode = 404
    }

    res.status(statusCode).json({
        message,
        "stack": process.env.NODE_ENV === "production" ? "Pancakes": err.stack,  
    })
}

export {notFound, basicErrorHandler}