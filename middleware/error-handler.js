const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, UnAuthorisedError } = require('../errors');

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, Please try again later'
    }

    if (err instanceof BadRequestError) {
        customError.msg = err.message || 'Bad Request'
        customError.statusCode = err.StatusCode || 400
    }

    if (err instanceof UnAuthorisedError) {
        customError.msg = err.message || "Authenticated Error, Please enter authorization token"
        customError.statusCode = err.StatusCode || 401
    }

    if (err instanceof NotFoundError) {
        customError.msg = err.message || "invalid with given values"
        customError.statusCode = err.StatusCode || 404
    }

    if (err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors).map((item => item.message)).join(',')
        customError.statusCode = 400
    }

    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate values entered for ${Object.keys(err.keyValue)} field , please choose another value`
        customError.statusCode = 400
    }

    if (err.name === 'CastError') {
        customError.msg = `No item foudn with id: ${err.value}`
        customError.statusCode = 404
    }

    res.status(customError.statusCode).send({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware;