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

const cp = require('child_process')

router.use((req, res, next) => {
	if(!req.session.username)
		res.redirect('/auth/login')
	else
		next()
})

router.get('/', (req, res) => {
	res.render('projects', {super_user:req.session.super_user})
})

router.get('/all', async (req, res) => {
	if(req.session.username && req.session.super_user) { 
		let projects = await db.getAllProjects()
		res.end(JSON.stringify(projects))
		return
	}
	res.end('404')
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
		project.name = req.query.name
		project.group = req.query.group
		project.desc = decodeURI(req.query.desc)
		project.repo_name = req.query.repo_name
		project.repo_type = req.query.repo_type

		//cards.add('ok', 'Project Created')
		cards.add('err', 'Wrong Input!')
		cards.add('warn', 'Project name already exists!')
		cards.add('warn', 'Dont make use of spaces.')

		/*db.createProject(project, (err) => {
			if(err){
				//cards.add('err', 'Server Error')
				//return
				throw err
			}
			
			cards.add('ok', 'Project Created')

			cp.exec(`mkdir /srv/git/${project.repo_name}; cd /srv/git/${project.repo_name}; git init --bare`, (err, stdout, stderr) => {
				if (err) throw err
				console.log(`Empty Repo created at /srv/git/${project.repo_name}`)
				res.end(JSON.stringify(cards.render()))
			})
		})*/
		res.end(JSON.stringify(cards.render()))
	} else 
		res.end('404')
})

module.exports = router