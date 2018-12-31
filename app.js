const express = require('express')
const app = express()

const authRoutes = require('./routes/auth.js')

const bodyParser = require('body-parser')
const session = require('express-session');

app.use(session({secret: 'root', saveUninitialized: true, resave: true}));

//app.use(express.static('public', { maxAge: 86400000 }));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/auth', authRoutes)

app.set('view engine', 'pug')

app.get('/', (req, res) => {
	if(!req.session.username)
		res.redirect('/auth/login')
	else
		res.render('index')
})

app.listen(8080, () => {
	console.log('Server started at 8080')
})
