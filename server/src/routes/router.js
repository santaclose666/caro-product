const router = require('./auth')

const route = (app)=>{
    app.use('/', router)
}

module.exports = route