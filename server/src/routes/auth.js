const router = require('express').Router()
const controller = require('../controllers/controller')
const middleware = require('../controllers/middleware')
const upload = require('../multer/multerConfig')

router.post('/register', controller.registerUser) 

router.post('/login', controller.loginUser)

router.get('/requestRefresh', controller.requestRefresh)

router.delete('/delete/:id', middleware.verifyTokenAndUser, controller.deleteUser)

router.get('/lobby', middleware.verifyToken, controller.lobbyUser)

router.get('/history/:userName/:page', controller.historyUser)

router.post('/upload', upload.array('file', 'fileName') ,controller.upload)

router.get('/logout', controller.logoutUser)

module.exports = router