/*

PROJECT : {id, name, desc, creator, birthday}
PROJECT_CONFIG : {id, ip_add, port, qr_code}
PROJECT_GROUP : {id, username}

*/

let express = require('express')
let router = express.Router()

router.use((req, res, next) => {
	if(!req.session.username)
		res.redirect('/auth/login')
	else
		next()
})

router.get('/', (req, res) => {
	res.render('projects', {super_user:req.session.super_user})
})

module.exports = router