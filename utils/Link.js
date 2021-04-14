const jwt = require('jwt')

function createLink(options) {

    const { salt, data, route, id } = options

    const secret = 'ABC' + salt
    const payload = data
    const token = await jwt.sign(payload, secret, { expiresIn: '15m' })

    return `https://localhost:3000/${route}/${id}/${token}`
}

module.exports = createLink
