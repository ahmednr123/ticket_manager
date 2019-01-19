const config = require('../configuration.js')

const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmail.user,
    pass: config.gmail.pass
  }
});

const express = require('express')
const router = express.Router()

const db = require('../modules/db.js')
const flash = require('../modules/flash.js')

const constants = require('../modules/constants.js')

router.use((req, res, next) => {
	if(!req.session.username)
		res.redirect('/auth/login')
	else
		next()
})

router.get('/', (req, res) => {
	res.render('admin', {super_user:req.session.super_user})
})

router.post('/createProject', async (req, res) => {
	let project = {}
	project.name = req.body.name
	// - Project handlers
	project.desc = req.body.desc

	let cards = new flash()

	db.createProject(project, (err) => {
		if(err)
			cards.add('err', 'Server Error')
		else
			cards.add('ok', 'Project Created')

		res.render('projects', {flash:cards.render()})
	})
})

/*

router.post('/createProject', async (req, res) => {
	let project = {}
	project.name = req.body.name
	project.desc = req.body.desc

	let password = req.body.password

	let cards = new flash()

	if (!(await db.loginUser(req.session.username, password))){
		cards.add('err', 'Wrong Password')
		res.render('su/projects', {flash:cards.render()})
		return
	}

	db.createProject(project, (err) => {
		if(err)
			cards.add('err', 'Server Error')
		else
			cards.add('ok', 'Project Created')

		res.render('su/projects', {flash:cards.render()})
	})
})

router.post('/createTicket', async (req, res) => {
	let ticket = {}
	ticket.name = req.body.name
	ticket.desc = req.body.desc
	ticket.priority = req.body.priority

	let password = req.body.password

	let cards = new flash()

	if (!(await db.loginUser(req.session.username, password))){
		cards.add('err', 'Wrong Password')
		res.render('su/tickets', {flash:cards.render()})
		return
	}

	db.createTicket(project, (err) => {
		if(err)
			cards.add('err', 'Server Error')
		else
			cards.add('ok', 'Ticket Created')

		res.render('su/tickets', {flash: cards.render()})
	})
})


router.post('/createUser', async (req, res) => {
	let cards = new flash()

	let userData = {}
	userData.username = req.body.uname
	userData.email = req.body.email
	userData.password = req.body.pass
	userData.type = req.body.type
	userData.full_name = req.body.fname

	if (await db.checkUser(userData.username)) {
		cards.add('err', 'Username already taken')
		res.render('su/users', {flash: cards.render()})
		return
	}

	db.saveUser(userData)

	cards.add('ok', 'User created')
	res.render('su/users', {flash: cards.render()})
})

*/

module.exports = router