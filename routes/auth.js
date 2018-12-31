const express = require('express')
const router = express.Router()

const db = require('../modules/db.js')

router.get('/signup', (req, res) => {
	res.render('temp_signup')
})

router.post('/signup', (req, res) => {
	let userData = {}
	userData.username = req.body.uname
	userData.email = req.body.email
	userData.password = req.body.pass
	userData.type = req.body.type
	userData.full_name = req.body.fname

	db.saveUser(userData)

	res.end("Maybe the user was saved!")
})

router.get('/login', (req, res) => {
	res.render('login')
})

router.post('/login', async (req, res) => {
	let username = req.body.uname
	let password = req.body.pass
	
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

router.post('/repass', (req, res) => {
	if(req.body.sendtoken){

		res.render('repass', {error:true, msg: ''})
	}

	if(req.body.changepass){
		
		res.render('repass', {error:true, msg: ''})
	}
	console.log(req.body)
	res.redirect('/repass')
})

module.exports = router