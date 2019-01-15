const express = require('express')
const router = express.Router()

const db = require('../modules/db.js')
const flash = require('../modules/flash.js')
const constants = require('../modules/constants.js')

router.get('/', (req, res) => {
	//if(!req.session.username)
	//	res.redirect('/auth/login')
	//else
		res.render('index')
})

module.exports = router