const express = require('express')
const router = express.Router()

const db = require('../modules/db.js')
const flash = require('../modules/flash.js')
const constants = require('../modules/constants.js')

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const fs = require('fs')

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

	let ssh_pubs = await db.getSSH(req.session.username)

	for (let i = 0; i < ssh_pubs.length; i++)
		ssh_pubs[i].date = ssh_pubs[i].added_on.toLocaleString().split(',')[0]

	if(ssh_pubs.length == 0)
		ssh_pubs = undefined

	res.render('account', {super_user:req.session.super_user, username, email, phone, full_name, ssh_pubs})
})

router.get('/all', async (req, res) => {
	if(req.session.username && req.session.super_user){
		let users = await db.getAllUsers()
		res.end(JSON.stringify(users)) 
	} else {
		res.end('404')
	}
})

router.post('/update', upload.single('ssh_pub'), (req, res) => {

	if (!req.session.username) {
		let redirect_uri = "/account"
		let encoded_redirect = encodeURI(redirect_uri)
		res.redirect(`/auth/login?prompt=login&redirect=${encoded_redirect}`)
		return
	}

	if (req.file) {
		console.log(`Got a file: (${global.appRoot}/${req.file.path})`)
		let ssh_pub_name = req.body.ssh_pub_name
		let ssh_pub = fs.readFileSync(`${global.appRoot}/${req.file.path}`)

		fs.appendFileSync(`/home/git/.ssh/authorized_keys`, ssh_pub)
		db.addSSH(ssh_pub_name, req.session.username, ssh_pub)
		fs.unlink(`${global.appRoot}/${req.file.path}`, (err) => {
			if (err) throw err;
		})

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

router.get('/create', (req, res) => {
	let cards = new flash()

	if(req.session.username && req.session.super_user) {
		console.log(req.query)
		cards.add('ok', 'User account was created!')
		res.end(JSON.stringify(cards.render()))
		return
	}

	res.end('404')

})

module.exports = router