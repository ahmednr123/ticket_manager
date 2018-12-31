const crypto = require('crypto')

function genPassword (password) {
	let salt = crypto.randomBytes(16).toString('hex')
	let hash = salt + ':' + crypto.pbkdf2Sync(password, salt, 100, 64, 'sha256').toString('hex')
	return hash
}

function checkPassword (password, chash) {
	console.log(typeof(chash))
	let salt = chash.split(':')[0]
	let hash = chash.split(':')[1]

	let new_hash = crypto.pbkdf2Sync(password, salt, 100, 64, 'sha256').toString('hex')

	return new_hash === hash
}

module.exports = { genPassword, checkPassword }