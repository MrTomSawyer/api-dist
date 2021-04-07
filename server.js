require('dotenv')
const App = require('./app')
const PostController = require('./posts/controller')

const { PORT = 3000 } = process.env

const server = new App(PORT, [new PostController()])

server.listen()