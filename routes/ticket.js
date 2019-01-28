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
	res.render('tickets', {super_user:req.session.super_user})
})

router.get('/all', async (req, res) => {
	if(req.session.username && req.session.super_user) { 
		let tickets = await db.getAllTickets(req.query.isParent)
		res.end(JSON.stringify(tickets))
		return
	}
	res.end('404')
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