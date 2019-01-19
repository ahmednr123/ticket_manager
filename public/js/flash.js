function flash () {
	this.flash_arr = []
}

flash.prototype.add = function (type, msg) {
	this.flash_arr.push({type, msg})
}

flash.prototype.render = function () {
	return this.flash_arr
}

function fc_render (fc_list) {
	let cards = ''

	for (let i = 0; i < fc_list; i++){
		let type = fc_list[i].type
		let msg = fc_list[i].msg
		let card = `<div class="flash_card fc_${type}"> ${msg} </div>`
		cards += card
	}

	$('#flash_cards').innerHTML = cards
}

if ($('#flash_cards')) {
	const urlParams = new URLSearchParams(window.location.search)
	let 
}