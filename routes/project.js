/*

PROJECT : {id, name, desc, creator, birthday}
PROJECT_CONFIG : {id, ip_add, port, qr_code}
PROJECT_GROUP : {id, username}

*/

let express = require('express')
let router = express.Router()

router.use((req, res, next) => {
	if(!req.session.username)
		res.redirect('/auth/login')
	else
		next()
})

router.get('/', (req, res) => {
	res.render('projects', {super_user:req.session.super_user})
})

router.get('/create', (req, res) => {
	if(req.session.username && req.session.super_user) {
		let project = {}
		project.name = req.body.name
		project.group = req.body.project_group
		project.desc = req.body.desc
		project.repo_name = req.body.repo_name

		let cards = new flash()

		db.createProject(project, (err) => {
			if(err)
				cards.add('err', 'Server Error')
			else
				cards.add('ok', 'Project Created')

			res.render('projects', {flash:cards.render()})
		})
	} else 
		res.end('404')
})

module.exports = router