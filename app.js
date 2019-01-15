const express = require('express')
const app = express()

const path = require('path')

const authRoutes = require('./routes/auth.js')
const suRoutes = require('./routes/superuser.js')
const projRoutes = require('./routes/project.js')
const accRoutes = require('./routes/account.js')

const bodyParser = require('body-parser')
const session = require('express-session');

app.use(session({secret: 'root', saveUninitialized: true, resave: true}));

//app.use(express.static('public', { maxAge: 86400000 }));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/auth', authRoutes)
app.use('/su', suRoutes)
app.use('/project', projRoutes)
app.use('/account', accRoutes)

app.set('view engine', 'pug')
app.locals.basedir = path.join(__dirname, 'views')

app.get('/', (req, res) => {
	//if(!req.session.username)
	//	res.redirect('/auth/login')
	//else
		res.render('index')
})

app.listen(8080, () => {
	console.log('Server started at 8080')
})