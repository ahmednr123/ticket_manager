const express = require('express')
const app = express()

app.use(express.static('public'))

app.set('view engine', 'pug')

app.get('/', (req, res) => {
	res.render('index')
})

app.get('/login', (req, res) => {
	res.render('login')
})

app.listen(8080, () => {
	console.log('Server started at 8080')
})
