/*

PROJECT : {id, name, desc, creator, birthday}
PROJECT_CONFIG : {id, ip_add, port, qr_code}
PROJECT_GROUP : {id, username}

*/
//const workingDirPath = `/srv/git`

const express = require('express')
const router = express.Router()

const db = require('../modules/db.js')
const flash = require('../modules/flash.js')
const fs_system = require('../modules/fs_system.js')
const constants = require('../modules/constants.js')

const cp = require('child_process')

router.use((req, res, next) => {
	if(!req.session.username)
		res.redirect('/auth/login')
	else
		next()
})

router.get('/', async (req, res) => {
	let projects = await db.getAllProjects()
	res.render('projects', {super_user:req.session.super_user, projects})
})

router.get('/all', async (req, res) => {
	if(req.session.username && req.session.super_user) { 
		let projects = await db.getAllProjects()
		res.end(JSON.stringify(projects))
		return
	}
	res.end('404')
})

router.get('/node', async (req, res) => {
	let project = await db.getProject(req.query.id)
	let md = await fs_system.getMarkdown('project', project.id, constants.MD_DESC)
	project.desc_html = md.html
	project.desc_md = md.markdown

	res.end(JSON.stringify(project))
})

router.get('/create', (req, res) => {
	if(req.session.username && req.session.super_user) {
		let cards = new flash()

		if(!req.query.group || !req.query.name || !req.query.repo_name || !req.query.repo_type) {
			cards.add('err', 'All fields are required!')
			res.end(JSON.stringify(cards.render()))
			return
		}

		let project = {}
		project.name = decodeURIComponent(req.query.name)
		project.group = req.query.group
		project.desc = (req.query.desc)?decodeURIComponent(req.query.desc):""
		project.repo_name = req.query.repo_name + '.git'
		project.repo_type = req.query.repo_type

		cards.add('ok', 'Project Created')
		//cards.add('err', 'Wrong Input!')
		//cards.add('warn', 'Project name already exists!')
		//cards.add('warn', 'Dont make use of spaces.')

		db.createProject(project, async (err, id) => {
			if(err){
				cards.add('err', 'Server Error')
				throw err
				return
			}

			await fs_system.saveMarkdown('project', id, constants.MD_DESC, project.desc)
			
			cards.add('ok', 'Project Created')

			cp.exec(`mkdir /srv/git/${project.repo_name}; git init --bare /srv/git/${project.repo_name}`, (err, stdout, stderr) => {
				if (err) throw err
				console.log(`=============================`)
				console.log(stdout)
				console.log(`=============================`)
				res.end(JSON.stringify(cards.render()))
			})
		})

		res.end(JSON.stringify(cards.render()))
	} else 
		res.end('404')
})

router.get('/update', async (req, res) => {
	let cards = new flash()

	let id = req.query.id
	let desc = (req.query.desc)?decodeURIComponent(req.query.desc):""

	await fs_system.saveMarkdown('project', id, constants.MD_DESC, desc)

	cards.add('ok', 'Ticket updated')
	res.end(JSON.stringify(cards.render()))
})

module.exports = router