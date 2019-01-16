document.addEventListener('DOMContentLoaded', () => {
	let popup_elem = document.createElement('div')
	popup_elem.setAttribute('id', 'popup_parent')
	document.getElementsByTagName('body')[0].appendChild(popup_elem)

	popup_elem.addEventListener('click', () => {

	})
}, false);

const PopUp = function (id, json) {

	if(!document.getElementById('popup_parent')) {
		let popup_elem = document.createElement('div')
		popup_elem.setAttribute('id', 'popup_parent')
		document.getElementsByTagName('body')[0].appendChild(popup_elem)
	}

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
		let form = document.createElement('form')
		
		form.setAttribute('id', this.id)
		form.setAttribute('class', 'popup_child')
		form.setAttribute('action', this.action)
		form.setAttribute('method', this.method)
		form.innerHTML = content

		return form
		//return `<form id="${this.id}" class="popup_child" action="${this.action}" method="${this.method}">${content}</form>`
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
	let el =  this.wrap(this.popup)
	document.getElementById('popup_parent').appendChild(el)
}

PopUp.prototype.add_raw = function (html) {
	this.popup += html
}

function popup_hide () {
	Array.prototype.forEach.call(document.querySelectorAll('.popup_child'), function (el) {
		el.style.display = 'none'
	});
}

