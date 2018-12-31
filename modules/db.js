const mysql = require('mysql')
const util = require('util')
const config = require('../configuration.js')

const crypt = require('./crypt.js')

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const db = mysql.createConnection({
	host: 'localhost',
	user: 'ahmed',
	password: config.mysql_password,
	database: 'ticket_manager'
})

db.connect((err) => {
	if(err)
		throw err;
})

const query = util.promisify(db.query).bind(db)

module.exports = {
	loginUser: async (username, password) => {
		username = htmlEntities(username)
		password = htmlEntities(password)

		let real_pass = await query(`SELECT password FROM users WHERE username="${username}";`)

		return crypt.checkPassword(password, real_pass[0].password)
	},
	saveUser: (userData) => {
		userData.full_name = htmlEntities(userData.full_name)
		userData.username = htmlEntities(userData.username)
		userData.password = htmlEntities(userData.password)
		userData.type = htmlEntities(userData.type)
		userData.email = htmlEntities(userData.email)

		userData.password = crypt.genPassword(userData.password)

		db.query(`INSERT INTO users (full_name, username, email, password, type) VALUES ("${userData.full_name}", "${userData.username}", "${userData.email}", "${userData.password}", "${userData.type}")`, (err) => {
			if(err) console.log(err)
		})
	}
}