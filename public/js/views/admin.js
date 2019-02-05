
let _global = {}
_global.md_text_one = true
_global.md_text_two = true

function loadData () {
	xhrRequest('/account/all', (res) => {
		_global.users = JSON.parse(res)
		put_users (_global.users)
	})

	xhrRequest('/ticket/all', (res) => {
		_global.parent_tickets = JSON.parse(res)
		put_parent_tickets (_global.parent_tickets)
	})

	xhrRequest('/project/all', (res) => {
		_global.projects = JSON.parse(res)
		put_projects (_global.projects)
	})
}

loadData ()

document.getElementById('admin_link').classList.add('selected')

document.addEventListener('click', (el) => {
	if(el.target.classList.contains('popup_bg')){
		document.getElementsByClassName('popup_bg')[0].style.display = 'none';
		clearForms()
	}
})

function hideall_popup () {
	Array.prototype.forEach.call(document.querySelectorAll('.popup_child'), function (el) {
		el.style.display = 'none'
	});
	$('.loader').style.display = 'block'
}

Array.prototype.forEach.call(document.querySelectorAll('.popup_link'), function (el) {
	el.addEventListener('click', function () {
		document.getElementsByClassName('popup_bg')[0].style.display = 'block';
		loadData ()
		switch (el.id) {
			case 'create_ticket':
				hideall_popup()
				let parent_ticket_neg = $('.parent_ticket_neg', 'all')
	        	for(let i = 0; i < parent_ticket_neg.length; i++){
	        		parent_ticket_neg[i].style.display = "table-row"
	        	}
	        	$('#parent_ticket_query').style.display = "table-row"
	        	let radios = document.forms["ticket_form"].elements["parent_ticket_query"];
				for(let i = 0, max = radios.length; i < max; i++) {
					radios[i].checked = false
				}
				$('.loader').style.display = 'none'
				document.getElementById('tickets').style="block"
				break;
			case 'create_project':
				hideall_popup()
				$('.loader').style.display = 'none'
				document.getElementById('projects').style="block"
				break;
			case 'create_user':
				hideall_popup()
				$('.loader').style.display = 'none'
				document.getElementById('users').style="block"
		}
	})
});

function md_btn_one_click () {
	if (_global.md_text_one) {
		document.getElementById('md_text_box_1').style.display = 'block'
		document.getElementById('md_render_box_1').style.display = 'none'
	} else {
		document.getElementById('md_render_box_1').style.display = 'block'
		document.getElementById('md_text_box_1').style.display = 'none'
	}
}

function md_btn_two_click () {
	if (_global.md_text_two) {
		document.getElementById('md_text_box_2').style.display = 'block'
		document.getElementById('md_render_box_2').style.display = 'none'
	} else {
		document.getElementById('md_render_box_2').style.display = 'block'
		document.getElementById('md_text_box_2').style.display = 'none'
	}
}

document.getElementById('md_text_1').addEventListener('click', () =>{
	_global.md_text_one = true
	md_btn_one_click()
})

document.getElementById('md_render_1').addEventListener('click', () =>{
	_global.md_text_one = false
	md_btn_one_click()
})

document.getElementById('md_text_2').addEventListener('click', () =>{
	_global.md_text_two = true
	md_btn_two_click()
})

document.getElementById('md_render_2').addEventListener('click', () =>{
	_global.md_text_two = false
	md_btn_two_click()
})

Array.prototype.forEach.call(document.querySelectorAll('textarea'), function (el) {
	el.addEventListener('keyup', function () {
		el.style.height = (el.scrollHeight) + 'px';
	})
});

let radios = document.forms["ticket_form"].elements["parent_ticket_query"];
for(let i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function() {
        if(this.value === '1'){
        	let parent_ticket_neg = $('.parent_ticket_neg', 'all')
        	for(let i = 0; i < parent_ticket_neg.length; i++){
        		parent_ticket_neg[i].style.display = "none"
        	}
        } else {
        	let parent_ticket_neg = $('.parent_ticket_neg', 'all')
        	for(let i = 0; i < parent_ticket_neg.length; i++){
        		parent_ticket_neg[i].style.display = "table-row"
        	}
        	//$('#parent_ticket_query').style.display = "none"
        	//$('#parent_ticket_query').parentNode.removeChild($('#parent_ticket_query'))
        }
    }
}

function put_users (users) {
	$forEach('.all_users', (el) => {
		if (el.getAttribute('name') == 'ticket') {
			el.innerHTML = user_checkbox ('handlers', users)
		} else if (el.getAttribute('name') == 'project') {
			el.innerHTML = user_checkbox ('group', users) 
		}
	})
}

function put_parent_tickets () {
	$forEach('.all_parent_tickets', (el) => {
		if (_global.parent_tickets.length == 0) {
			el.innerHTML = '<span style="font-size:14px;color:grey">No parent tickets available</span>'
		} else {
			el.innerHTML = ticket_radiobox ('parent_ticket', _global.parent_tickets)
		}
	})
}

function put_projects () {
	$forEach('.all_projects', (el) => {
		if (_global.projects.length == 0) {
			el.innerHTML = '<span style="font-size:14px;color:grey">No projects available</span>'
		} else {
			el.innerHTML = project_radiobox ('project', _global.projects)
		}
	})
}

function user_checkbox (name, users) {
	let html = ``
	let super_user = `<span class="tag">(su)</span>`
	for (let i = 0; i < users.length; i++) {
		let innerHTML = `<input type="checkbox" name=${name} value=${users[i].username}> ${users[i].full_name}${(users[i].type=='superuser')?super_user:''} <br>`
		html += innerHTML
	}

	return html.slice(0, html.length - 4)
}

function ticket_radiobox (name, tickets) {
	let html = ``
	for (let i = 0; i < tickets.length; i++) {
		let innerHTML = `<input type="radio" name=${name} value=${tickets[i].id}> ${tickets[i].name}<br>`
		html += innerHTML
	}

	return html.slice(0, html.length - 4)
}

function project_radiobox (name, projects) {
	let html = ``
	for (let i = 0; i < projects.length; i++) {
		let innerHTML = `<input type="radio" name=${name} value=${projects[i].id}> ${projects[i].name}<br>`
		html += innerHTML
	}

	return html.slice(0, html.length - 4)
}

$forEach('.delete_btn', (el) => {
	el.addEventListener('click', (ev) => {
		if (el.getAttribute('action') == 'delete_user') {
			let username = el.getAttribute('username')
			if(confirm(`Delete user: "${username}"?`)) {
				xhrRequest(`/delete?username=${username}`, (res) => {
					console.log(`Deleted user: ${username}, reply: ${res}`)
				})
			}
		}
	})
})

function add_flash (type, msg) {

	let fc_html = ''

	let flash_card = (type, msg) => {
		return `<div class="flash_card ${type}">${msg}</div>`
	} 

	if (type=='err')
		fc_html = flash_card('fc_err', msg)
	else if (type=='warn')
		fc_html = flash_card('fc_warn', msg)
	else if (type=='ok')
		fc_html = flash_card('fc_ok', msg)
	else 
		fc_html = flash_card('fc_info', msg)
	
	$forEach('.flash_msgs', (el) => {
		console.log('making changes')
		el.innerHTML += fc_html
	})

}

function clearForms(clear_flash = true) {
	if(clear_flash) {
		$forEach('.flash_msgs', (el) => {
			el.innerHTML = ''
		})
	}
	
	$forEach('form', (el) => {
		el.reset()
	})
}

$('#createProjectBtn').addEventListener('click', () => {
	let project_form = document.forms["project_form"].elements

	$forEach('.flash_msgs', (el) => {
		el.innerHTML = ''
	})

	let url = '/project/create?' + getArguments(project_form)

	console.log(url)
	xhrRequest(url, popup_callback)
})

$('#createUserBtn').addEventListener('click', () => {
	let user_form = document.forms["user_form"].elements

	$forEach('.flash_msgs', (el) => {
		el.innerHTML = ''
	})

	let url = '/account/create?' + getArguments(user_form)

	console.log(url)
	xhrRequest(url, popup_callback)
})

$('#createTicketBtn').addEventListener('click', () => {
	let ticket_form = document.forms["ticket_form"].elements

	$forEach('.flash_msgs', (el) => {
		el.innerHTML = ''
	})

	let url = '/ticket/create?' + getArguments(ticket_form)

	console.log(url)
	xhrRequest(url, popup_callback)
})


function getArguments (form) {
	function CheckWithAll (val, arr) {
		let check = false

		for (let i = 0; i < arr.length; i++)
			check = check || (val == arr[i])

		return check
	}

	let url = ''

	for (let i in form) {
		console.log(`${form[i].name} => ${form[i].value}`)
		if( CheckWithAll(form[i].type, ['text', 'email', 'password', 'radio', 'select-one', 'checkbox', 'textarea']) ){
			if((form[i].type != 'radio' || form[i].checked) && (form[i].type != 'checkbox' || form[i].checked))
				url += `${form[i].name}=${encodeURIComponent(form[i].value)}&`
		}
	}

	return url.slice(0, url.length - 1)
}

function popup_callback (res) {
	console.log(res)
	let flash = JSON.parse(res)
	let failed = false
	
	console.log(flash)
	
	for (let i = 0; i < flash.length; i++) {
		add_flash(flash[i].type, flash[i].msg)
		if (flash[i].type == 'err')
			failed = true
	}

	if(!failed)
		clearForms(false)
	
	scrollToTop(600)
}

// https://stackoverflow.com/a/24559613
function scrollToTop(scrollDuration) {
    var cosParameter = window.scrollY / 2,
        scrollCount = 0,
        oldTimestamp = performance.now();
    function step (newTimestamp) {
        scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) window.scrollTo(0, 0);
        if (window.scrollY === 0) return;
        window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}