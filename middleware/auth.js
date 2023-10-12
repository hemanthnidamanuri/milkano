const jwt = require('jsonwebtoken');
const { UnAuthorisedError } = require('../errors');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnAuthorisedError('Authenticated error');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, name: payload.name };
        next();
    } catch (error) {
        throw new UnAuthorisedError(error);
    }
}

module.exports = auth;