let express = require('express')
let router = express.Router()

router.use((req, res, next) => {
	if(!req.session.username)
		res.redirect('/auth/login')
	else
		next()
})

router.get('/', (req, res) => {
	res.render('tickets', {super_user:req.session.super_user})
})

module.exports = router