function flash () {
	this.flash_arr = []
}

flash.prototype.add = function (type, msg) {
	this.flash_arr.push({type, msg})
}

flash.prototype.render = function () {
	return this.flash_arr
}

module.exports = flash