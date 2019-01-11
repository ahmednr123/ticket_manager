//const exec = require('child_process').exec;
const cron = require('node-cron')

module.exports = {
	setTokenTime: (db, dt, token) => {
		console.log('DATE: ' + dt)
		console.log('DATE TYPE: ' + typeof(dt))

		let day = dt.getDate()
		let month = dt.getMonth() + 1

		let hour = dt.getHours()
		let minute = dt.getMinutes()

		let task = cron.schedule(`${minute} ${hour} ${day} ${month} *`, () => {
			console.log("CRON HAPPENED!")
			db.query(`DELETE FROM tokens WHERE token=${token}`, (err) => {
				if(err){
					console.log('Error - theGuy:sendTokenTime')
					console.log('============================')
					console.log(err)
				} else {
					task.destroy()
				}
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