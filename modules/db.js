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

	saveUser: (userData) => {
		userData.password = crypt.genPassword(userData.password)

		db.query(`INSERT INTO users (full_name, username, email, password, type) VALUES ("${userData.full_name}", "${userData.username}", "${userData.email}", "${userData.password}", "${userData.type}")`, (err) => {
			if(err) throw err
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
		let users = await query(`SELECT username, email, full_name, type FROM users`)
		return users
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
		db.query(`INSERT INTO projects (name, description, repo_name, birthday) VALUES ("${project.name}", "${project.desc}", "${project.repo_name}", NOW())`, (err) => {
			if (err) throw err
			callback()
		})
	},

	createTicket: (ticket, callback) => {
		db.query(`INSERT INTO tickets (name, description, priority, birthday) VALUES ("${ticket.name}", "${ticket.desc}", "${ticket.priority}", NOW())`, (err) => {
			if (err) throw err
			callback()
		})
	}
}