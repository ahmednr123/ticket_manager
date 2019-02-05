const mysql = require('mysql')
const util = require('util')
const config = require('../configuration.js')

const crypt = require('./crypt.js')

const theguy = require('./theguy.js')

const db = mysql.createConnection({
	host: config.mysql_host,
	user: config.mysql_user,
	password: config.mysql_password,
	database: config.mysql_database
})

db.connect((err) => {
	if(err)
		throw err;
})

const query = util.promisify(db.query).bind(db)

module.exports = {
	loginUser: async (username, password) => {
		let records = await query(`SELECT password FROM users WHERE username="${username}"`)

		return crypt.checkPassword(password, records[0].password)
	},

	saveUser: (userData, callback) => {
		userData.password = crypt.genPassword(userData.password)

		db.query(`INSERT INTO users (full_name, username, email, password, type) VALUES ("${userData.full_name}", "${userData.username}", "${userData.email}", "${userData.password}", "${userData.type}")`, (err) => {
			if(err) throw err
			callback()
		})
	},

	savePassword: (username, password) => {
		password = crypt.genPassword(password)

		db.query(`UPDATE users SET password="${password}" WHERE username="${username}"`, (err) => {
			if(err) throw err
		})
	},

	checkUser: async (username) => {
		let records = await query(`SELECT * FROM users WHERE username="${username}"`)
		return (records.length > 0) ? true : false
	},

	checkUserType: async (user_type, username) => {
		let record = await query(`SELECT type FROM users WHERE username="${username}"`)
		console.log('FROM checkUserType '+user_type+' == '+record[0].type+', '+(record[0].type === user_type))
		return (record[0].type === user_type)
	},

	getUserDetails: async (username) => {
		let user = await query(`SELECT * FROM users WHERE username="${username}"`)
		return user[0]
	},

	getAllUsers: async () => {
		let users = await query(`SELECT * FROM users`)
		return users
	},

	getAllProjects: async () => {
		//let projects = await query(`select p1.id, p1.name, p1.description, p1.birthday, p1.repo_name, p1.repo_type, 
		//	p2.username, p3.ip_addr, p3.port, p3.qr_code from projects p1, project_handlers p2, project_config p3`)
		let projects = await query(`SELECT id,name FROM projects`)
		return projects
	},

	getAllTickets: async (isParent) => {
		let tickets = await query(`SELECT id,name FROM tickets ${isParent?'WHERE parent=TRUE':''}`)
		return tickets
	},

	updateUserDetails: (details) => {
		db.query(`UPDATE users SET full_name="${details.full_name}", email="${details.email}", phone="${details.phone}" WHERE username="${details.username}"`, (err) => {
			if(err) throw err
		})
	},

	checkToken: async (token, username, label) => {
		let records = null
		
		// Lazy Coding : to ignore token
		if(!label)
			records = await query(`SELECT * FROM tokens WHERE username="${token}" AND label="${username}"`)
		else
			records = await query(`SELECT * FROM tokens WHERE token="${token}" AND username="${username}" AND label="${label}"`)
		
		return records.length//(records.length > 0) ? true : false
	},

	deleteToken: (token, username, label) => {
		db.query(`DELETE FROM tokens WHERE token="${token}" AND username="${username}" AND label="${label}"`, (err) => {
			if(err) throw err
		})
	},

	createToken: (username, label) => {
		let token = crypt.genRandomKey(20).toString('hex')

		db.query(`INSERT INTO tokens (token, username, label, birthdate, deathdate) VALUES ("${token}", "${username}", "${label}", NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR))`, (err) => {
			if(err) throw err
		})

		db.query('SELECT DATE_ADD(NOW(), INTERVAL 3 HOUR)', (err, result, fields) => {
			if(err) throw err
			theguy.setTokenTime(db, result[0][fields[0].name], token)
		})

		return token
	},

	getEmail: async (username) => {
		let records = await query(`SELECT email FROM users WHERE username="${username}";`)
		return records[0].email
	},

	createProject: (project, callback) => {
		db.query(`INSERT INTO projects (name, description, repo_name, repo_type, birthday) VALUES ("${project.name}", "${project.desc | ''}", "${project.repo_name}", "${project.repo_type}", NOW())`, (err, result) => {
			if (err) throw err
			
			let id = result.insertId
			for (let i = 0; i < project.group.length; i++) {
				db.query(`INSERT INTO project_handlers (id, username) VALUES ("${id}", "${project.group[i]}")`, (err) => {
					if (err) throw err
				})
			}

			db.query(`INSERT INTO project_config (id, ip_addr, port) VALUES ("${id}", "192.168.0.107", "${3000 + parseInt(id)}")`, (err) => {
				if (err) throw err
			})

			callback()
		})

	},

	createTicket: (ticket, callback) => {

		if (ticket.parent) {
			db.query(`INSERT INTO tickets (name, description, birthday, parent) VALUES ("${ticket.name}", "${ticket.desc}", NOW(), 1)`, (err) => {
				if (err) throw err
				callback()
			})
		} else {
			db.query(`INSERT INTO tickets (name, ticket_id, description, priority, birthday, parent) VALUES ("${ticket.name}", "${ticket.ticket_id}", "${ticket.desc}", "${ticket.priority}", NOW(), 0)`, (err, result) => {
				if (err) throw err
				let id = result.insertId
				db.query(`INSERT INTO ticket_hierarchy (id, child_id) VALUES (${ticket.project}, ${id})`, (err) => {
					if (err) throw err
				})
				for (let i = 0; i < ticket.handlers.length; i++) {
					db.query(`INSERT INTO ticket_handlers (id, username) VALUES (${id}, ${ticket.handlers[i]})`, (err) => {
						if (err) throw err
					})
				}
				callback()
			})
		}
	},

	getSSH: async (username) => {
		let ssh_pubs = await query(`SELECT name, added_on from user_ssh WHERE username="${username}";`)
		return ssh_pubs
	},

	addSSH: (name, username, ssh_pub) => {
		db.query(`INSERT INTO user_ssh (name, username, ssh_pub, added_on) VALUES ("${name}", "${username}", "${ssh_pub}", NOW())`, (err) => {
			if(err) throw err
		})
	}
}