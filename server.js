require('dotenv')
const App = require('./app')
const PostController = require('./posts/controller')
const Authentication = require('./authentication/controller')
const PasswordReset = require('./authentication/password-reset')

const { PORT = 3000 } = process.env

const server = new App(PORT, [
    new PostController(),
    new Authentication(),
    new PasswordReset()
])

server.listen()