const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

class App {

    constructor(PORT, controllers) {
        this.app = express()
        this.port = PORT
        this.connectDataBase()
        this.initMiddlewares()
        this.initControllers(controllers)
    }

    initMiddlewares() {
        this.app.use(express.urlencoded())
        this.app.use(express.json())
    }

    initControllers(controllers) {
        controllers.forEach(controller => this.app.use('/', controller.router))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on ${this.port}`)
        })
    }

	connectDataBase() {
		mongoose.connect('mongodb://localhost:27017/mydb', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false})
				.then(() => console.log('Connected to database'))
				.catch(error => console.log('Connection to database failed', error))
	}
}

module.exports = App