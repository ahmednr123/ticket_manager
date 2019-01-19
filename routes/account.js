const express = require('express')
const router = express.Router()

const db = require('../modules/db.js')
const flash = require('../modules/flash.js')
const constants = require('../modules/constants.js')

router.get('/', async (req, res) => {

	if (!req.session.username) {
		let redirect_uri = "/account"
		let encoded_redirect = encodeURI(redirect_uri)
		res.redirect(`/auth/login?prompt=login&redirect=${encoded_redirect}`)
		return
	}

	let username = req.session.username
	let details = await db.getUserDetails(username)
	let email = details.email
	let full_name = details.full_name
	let phone = details.phone

	//console.log(details)

	res.render('account', {super_user:req.session.super_user, username, email, phone, full_name})
})

router.post('/update', (req, res) => {

	if (!req.session.username) {
		let redirect_uri = "/account"
		let encoded_redirect = encodeURI(redirect_uri)
		res.redirect(`/auth/login?prompt=login&redirect=${encoded_redirect}`)
		return
	}

	let details = {}
	details.username = req.session.username
	details.full_name = req.body.full_name
	details.email = req.body.email
	details.phone = req.body.phone

	db.updateUserDetails(details)

	res.redirect('/account')
})

module.exports = router