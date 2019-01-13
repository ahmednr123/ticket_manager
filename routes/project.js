/*

PROJECT : {id, name, desc, creator, birthday}
PROJECT_CONFIG : {id, ip_add, port, qr_code}
PROJECT_GROUP : {id, username}

*/

let express = require('express')
let router = express.Router()

router.get('/', (req, res) => {
	res.end('project')
})

module.exports = router