const router = require('express').Router()
const controller = require('./user.controller')

router.get('/list', controller.list)
router.post('/stripePay', controller.stripePay)

module.exports = router