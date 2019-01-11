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
			if(err) console.log(err)
		})
	},

	savePassword: (username, password) => {
		password = crypt.genPassword(password)

		db.query(`UPDATE users SET password="${password}" WHERE username="${username}"`, (err) => {
			if(err) console.log(err)
		})
	},

	checkUser: async (username) => {
		let records = await query(`SELECT * FROM users WHERE username="${username}"`)
		return (records.length > 0) ? true : false
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
			if(err) console.log(err)
		})
	},

	createToken: (username, label) => {
		let token = crypt.genRandomKey(20).toString('hex')

		db.query(`INSERT INTO tokens (token, username, label, birthdate, deathdate) VALUES ("${token}", "${username}", "${label}", NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR))`, (err) => {
			if(err) console.log(err)
		})

		db.query('SELECT DATE_ADD(NOW(), INTERVAL 3 HOUR)', (err, result, fields) => {
			if(err) console.log(err)
			theguy.setTokenTime(db, result[0][fields[0].name], token)
		})

		return token

	},

	getEmail: async (username) => {
		let records = await query(`SELECT email FROM users WHERE username="${username}";`)
		return records[0].email
	}
}