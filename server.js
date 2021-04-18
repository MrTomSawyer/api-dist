require('dotenv')
const App = require('./app')
const PostController = require('./Controllers/Posts')
const Authentication = require('./Controllers/Authentication')
const PasswordReset = require('./Controllers/PasswordReset')
const EmailSetup = require('./Controllers/EmailSetup')
const Profile = require('./Controllers/Profile')
const Advert = require('./Controllers/Advert')

const { PORT = 3000 } = process.env

const server = new App(PORT, [
    new PostController(),
    new Authentication(),
    new PasswordReset(),
    new EmailSetup(),
    new Profile(),
    new Advert()
])

server.listen()
