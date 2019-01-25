let express = require('express')
let router = express.Router()

router.use((req, res, next) => {
	if(!req.session.username)
		res.redirect('/auth/login')
	else
		next()
})

router.get('/', (req, res) => {
	res.render('tickets', {super_user:req.session.super_user})
})

router.get('/all', async (req, res) => {
	if(req.session.username && req.session.super_user) { 
		let tickets = await db.getAllTickets()
		res.end(JSON.stringify(tickets))
	}
})

router.post('/create', async (req, res) => {
	if(req.session.username && req.session.super_user) {
		let ticket = {}
		ticket.name = req.query.name
		ticket.desc = req.query.desc
		ticket.priority = req.query.priority
		ticket.handlers = req.query.handlers

		let cards = new flash()

		db.createTicket(ticket, (err) => {
			if(err)
				cards.add('err', 'Server Error')
			else
				cards.add('ok', 'Ticket Created')

			res.render('su/tickets', {flash: cards.render()})
		})
	}
})

module.exports = router