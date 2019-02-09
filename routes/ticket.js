const express = require('express')
const router = express.Router()

const db = require('../modules/db.js')
const flash = require('../modules/flash.js')
const constants = require('../modules/constants.js')
const fs_system = require('../modules/fs_system.js')

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

router.get('/create', async (req, res) => {
	if(req.session.username && req.session.super_user) {
		let cards = new flash()

		if(!req.query.name || !req.query.parent_ticket_query) {
			cards.add('err', 'All fields are required!')
			res.end(JSON.stringify(cards.render()))
			return
		} else if (!req.query.project) {
			cards.add('err', 'A ticket must be under a project')
			res.end(JSON.stringify(cards.render()))
			return
		}

		let ticket = {}
		ticket.name = decodeURIComponent(req.query.name)
		ticket.project = req.query.project
		ticket.ticket_id = decodeURIComponent(req.query.ticket_id)
		ticket.desc = decodeURIComponent(req.query.desc)
		ticket.priority = req.query.priority
		ticket.handlers = req.query.handlers

		if (typeof(ticket.handlers) == 'string')
			ticket.handlers = [ticket.handlers]

		ticket.parent = (req.query.parent_ticket_query==1)?true:false
		ticket.parent_ticket = req.query.parent_ticket

		console.log(ticket)

		let type = constants.MD_DESC

		if (!ticket.parent) {
			if (!req.query.handlers || !req.query.priority) {
				cards.add('err', 'All fields are required!')
				res.end(JSON.stringify(cards.render()))
				return
			}
			
			if (ticket.desc.length < 100) {
				cards.add('err', 'Description must be more than <b>100 letters!</b>')
				res.end(JSON.stringify(cards.render()))
				return
			}
		}

		db.createTicket(ticket, async (err, id) => {

			await fs_system.saveMarkdown('ticket', id, type, ticket.desc)

			if(err)
				cards.add('err', 'Server Error')
			else
				cards.add('ok', 'Ticket Created')

			res.end(JSON.stringify(cards.render()))
		})

		cards.add('ok', 'Ticket created')

		res.end(JSON.stringify(cards.render()))

		return
	}

	res.end('404')
})

router.get('/update', async (req, res) => {

	let cards = new flash()

	let id = req.query.id
	let type = req.query.type
	let desc = (req.query.desc)?decodeURIComponent(req.query.desc):""

	if(type !== constants.MD_DESC && type !== constants.MD_DOC){
		cards.add('err', '"Type" error')
		res.end(JSON.stringify(cards.render()))
		return
	}

	await fs_system.saveMarkdown('ticket', id, constants.MD_DESC, desc)

	cards.add('ok', 'Ticket updated')
	res.end(JSON.stringify(cards.render()))
})

module.exports = router