const PopUp = function (id, json) {

	this.id = id
	this.action = json.action
	this.method = json.method

	this.popup = ""

	this.add_element = function (label, name, html) {
		let content = `<section>`
		content += `<label for="${name ? name : ""}"> ${label} </label>`
		content += html
		content += `</section>`
		this.popup += content
	}

	this.wrap_parent = function (content) {
		return `<form id="${this.id}" class="popup_child" action="${action}" method="${method}">${content}</form>`
	}

	this.input = (type, attributes) => {
		let content = ``

		content += `type = "${type}" `

		for (key in attributes)
			content += `${key} = "${attributes[key]}" `

		return `<input ${content} >`
	}

	this.select = (attributes, options) => {
		let content = `<select `

		for (key in attributes)
			content += `${key} = "${attributes[key]}" `

		content += `>`

		let inner_content = ``
		for (option in options) {
			let value = option['_value']
			delete option['_value']

			inner_content += `<option `

			for (key in option)
				inner_content += `${key} = "${option[key]}"`

			inner_content += `> ${value} </option>`
		}

		content += `${inner_content} </select>`

		return content
	}

	this.options = (type, attributes, boxes) => {
		let content = ``

		let name = attributes['name']
		delete attributes['name']

		for (box in boxes) {
			let value = boxes['_value']
			delete boxes['_value']

			boxes['name'] = name
			content += ` ${this.input('checkbox', boxes)} ${value}`

			content += `<br>`
		}

		return content
	}
}

PopUp.prototype.add = function (label, type, attributes, extra) {
	switch (type) {
		case 'text':
		case 'password':
		case 'button':
		case 'submit':
			// no extra
			this.add_element(label, attributes['name'], this.input(type, attributes))
			break
		case 'select':
			// {attributes..., _value}
			this.add_element(label, attributes['name'], this.select(attributes, extra))
			break
		case 'radio':
		case 'checkbox':
			// {attributes..., _value}
			this.add_element(label, attributes['name'], this.options(type, attributes, extra))
			break
		default:
			console.log(`POPUP BUILDER ERROR: type: ${type} not found`)
	}
}

PopUp.prototype.render = function () {
	return this.wrap(this.popup)
}

PopUp.prototype.add_raw = function (html) {
	this.popup += html
}

module.exports = PopUp