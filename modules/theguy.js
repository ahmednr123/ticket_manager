//const exec = require('child_process').exec;
const cron = require('node-cron')

module.exports = {
	setTokenTime: (db, dt, token) => {
		let day = dt.getDate()
		let month = dt.getMonth() + 1

		let hour = dt.getHours()
		let minutes = dt.getMinutes()

		cron.schedule(`${minutes} ${hours} ${day} ${month} ?`, () => {
			db.query(`DELETE FROM tokens WHERE token=${token}`, (err) => {
				if(err) console.log('error')
			})
		})
	}
}

/*var yourscript = exec('sh shellscript.sh', 
(error, stdout, stderr) => {
	console.log(`${stdout}`);
	console.log(`${stderr}`);
	if (error !== null) {
		 console.log(`exec error: ${error}`);
	}
});
*/