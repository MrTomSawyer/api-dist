const NotAuthorizedError = require('../utils/errors/NotAuthorizedError')
const jwt = require('jwt')

const auth = (req, res, next) => {
    const { authorization } = req.headers

    if(!authorization || !authorization.startsWith('Bearer ')) {
        return next(new NotAuthorizedError('Authorization is required'))
    }

    const token = authorization.replace('Bearer ', '')

    const payload

    try {
        payload = jwt.verify(token, 'ABC')
    } catch (error) {
        return next(new NotAuthorizedError('Authorization is required'))
    }

    req.user = payload

    return next()
}

module.exports = auth