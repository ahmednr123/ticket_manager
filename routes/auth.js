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

function htmlEntities(str) {
	if(!str || typeof(str) == 'number') return undefined;
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

router.get('/', (req, res) => {
	res.redirect('/login')
})

router.get('/signup', (req, res) => {
	res.render('auth/temp_signup')
})

router.post('/signup', (req, res) => {
	let userData = {}
	userData.username = htmlEntities(req.body.uname)
	userData.email = htmlEntities(req.body.email)
	userData.password = htmlEntities(req.body.pass)
	userData.type = htmlEntities(req.body.type)
	userData.full_name = htmlEntities(req.body.fname)

	db.saveUser(userData)

	res.end("Maybe the user was saved!")
})

router.get('/login', (req, res) => {

	let cards = new flash()
	let redirect = null

	if (req.query.prompt) {
		cards.add('err', 'You have to be <b>logged in</b>')
	}

	if (req.query.redirect) {
		// MAY HAVE TO SANITIZE
		redirect = req.query.redirect
	}

	if(!req.session.username)
		res.render('auth/login', {flash: cards.render(), redirect})
	else
		res.redirect('/')
})

router.post('/login', async (req, res) => {
	let username = htmlEntities(req.body.uname)
	let password = htmlEntities(req.body.pass)
	
	let auth = await db.loginUser(username, password)

	let redirect = null

	console.log(auth)

	if (req.query.redirect) 
		redirect = req.query.redirect

	if(auth == true){
		req.session.username = username

		if (redirect) {
			let redirect_uri = decodeURI(redirect)
			res.redirect(redirect_uri)
			return
		}

		res.end('you are logged in')
	} else {
		let cards = new flash()
		cards.add('err', 'Wrong Credentials')

		res.render('auth/login', {flash: cards.render(), redirect})
	}
})

router.get('/repass', (req, res) => {
	res.render('auth/repass')
})

router.post('/repass', async (req, res) => {
	let cards = new flash()

	if(req.body.sendtoken){
		let username = htmlEntities(req.body.uname)

		let isUser = await db.checkUser(username)

		if(!isUser) {
			cards.add('err', `User doesn't exist`)
			res.render('auth/repass', {flash: cards.render()})
			return
		}

		let tokens = await db.checkToken(username, constants.TL_PASSWORD_RESET)

		if(tokens > 0) {
			cards.add('info', `Email Already sent!`)
			res.render('auth/repass', {flash: cards.render()})
			return
		} 

		let token = await db.createToken(username, constants.TL_PASSWORD_RESET)
		let email = await db.getEmail(username)

		const mailOptions = {
			from: 'Admin',
			to: email,
			subject: 'Set your password',
			text: `Follow the link http://localhost:8080/auth/setPassword?token=${token}&username=${username}`
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error){
				console.log("MAIL ERROR: " + error)
				cards.add('err', `Server Error Occured`)
				res.render('auth/repass', {flash: cards.render()})
			} else {
				console.log('Email sent: ' + info.response)
				cards.add('ok', `Email Sent`)
				res.render('auth/repass', {flash: cards.render()})
			}
			return
		})

	} else 
		res.render('auth/repass', {flash: cards.render()})
})

router.get('/setPassword', async (req, res) => {
	let username = htmlEntities(req.query.username)
	let token = htmlEntities(req.query.token)

	let isToken = await db.checkToken(token, username, constants.TL_PASSWORD_RESET)

	if(isToken)
		res.render('auth/set_password', {username, token})
	else
		res.end('404 - Not Found')
})

router.post('/setPassword', async (req, res) => {
	let username = htmlEntities(req.body.uname)
	let token = htmlEntities(req.body.token)
	let password = htmlEntities(req.body.pass)
	let re_password = htmlEntities(req.body.re_pass)

	let cards = new flash()

	let isRePasswordSame = password != re_password
	let isPasswordEnough = password.length < 8

	if(isRePasswordSame)
		cards.add('err', `Passwords don't match`)

	if(isPasswordEnough)
		cards.add('err', 'Password must contain atleast <b>8 characters</b>')

	if(isPasswordEnough || isRePasswordSame) {
		res.render('auth/set_password', {flash:cards.render(), username, token})
		return
	}

	let isToken = await db.checkToken(token, username, constants.TL_PASSWORD_RESET)

	if (isToken) {
		db.savePassword(username, password)
		db.deleteToken(token, username, constants.TL_PASSWORD_RESET)
	}

	res.redirect('/auth/login')
})

module.exports = router