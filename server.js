require('dotenv')
const App = require('./app')
const PostController = require('./Controllers/Posts')
const Authentication = require('./Controllers/Authentication')
const PasswordReset = require('./Controllers/Password-reset')

const { PORT = 3000 } = process.env

const server = new App(PORT, [
    new PostController(),
    new Authentication(),
    new PasswordReset()
])

server.listen()