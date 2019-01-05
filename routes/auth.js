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

const constants = require('../modules/constants.js')

function htmlEntities(str) {
	if(!str || typeof(str) == 'number') return undefined;
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

router.get('/signup', (req, res) => {
	res.render('temp_signup')
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
	res.render('login')
})

router.post('/login', async (req, res) => {
	let username = htmlEntities(req.body.uname)
	let password = htmlEntities(req.body.pass)
	
	let auth = await db.loginUser(username, password);

	console.log(auth)

	if(auth == true){
		req.session.username = username
		res.end('You are logged in!');
	} else 
		res.redirect('/auth/login')
})

router.get('/repass', (req, res) => {
	res.render('repass')
})

router.post('/repass', async (req, res) => {
	if(req.body.sendtoken){
		let uname = htmlEntities(req.body.uname)
		let token = await db.createToken(username, constants.TL_PASSWORD_RESET)
		let email = await db.getUserEmail(uername)

		const mailOptions = {
			from: 'Admin',
			to: email,
			subject: 'Set your password',
			text: `Follow the link http://localhost/auth/setPassword?token=${token}&username=${username}`
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error)
				console.log(error)
			else
				console.log('Email sent: ' + info.response)
		})
		// error sending mechanism
		//res.render('repass', {error:true, msg: ''})
	}

	if(req.body.changepass){
		
		res.render('repass', {error:true, msg: ''})
	}
	console.log(req.body)
	res.redirect('/repass')
})

router.get('/setPassword', async (req, res) => {
	let uname = htmlEntities(req.body.uname)
	let token = htmlEntities(req.body.token)

	let isToken = await db.checkToken(token, uname)

	if(isToken)
		res.render('set_password')
	else
		res.end('404 - Not Found')
})

router.post('/setPassword', (req, res) => {
	let uname = htmlEntities(req.body.uname)
	let token = htmlEntities(req.body.token)
	let password = htmlEntities(req.body.pass)


	
	res.redirect('/auth/login')
})

module.exports = router

/*
const mailOptions = {
  from: 'The ',
  to: 'ahmednr123@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
}

transporter.sendMail(mailOptions, (error, info) => {
  if (error)
    console.log(error)
  else
    console.log('Email sent: ' + info.response)
})
*/