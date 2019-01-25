
let _global = {}
_global.md_text_one = true
_global.md_text_two = true

xhrRequest('/account/all', (res) => {
	_global.users = JSON.parse(res)
	console.log(_global.users)
	put_users (_global.users)
})

document.getElementById('admin_link').classList.add('selected')

document.addEventListener('click', (el) => {
	if(el.target.classList.contains('popup_bg'))
		document.getElementsByClassName('popup_bg')[0].style.display = 'none';
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
		switch (el.id) {
			case 'create_ticket':
				hideall_popup()
				let parent_ticket_neg = $('.parent_ticket_neg', 'all')
	        	for(let i = 0; i < parent_ticket_neg.length; i++){
	        		parent_ticket_neg[i].style.display = "table-row"
	        	}
	        	$('#parent_ticket_query').style.display = "table-row"
	        	let radios = document.forms["ticket_form"].elements["parent_ticket"];
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

let radios = document.forms["ticket_form"].elements["parent_ticket"];
for(let i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function() {
        if(this.value === 'yes'){
        	let parent_ticket_neg = $('.parent_ticket_neg', 'all')
        	for(let i = 0; i < parent_ticket_neg.length; i++){
        		parent_ticket_neg[i].style.display = "none"
        	}
        } else {
        	let parent_ticket_neg = $('.parent_ticket_neg', 'all')
        	for(let i = 0; i < parent_ticket_neg.length; i++){
        		parent_ticket_neg[i].style.display = "table-row"
        	}
        	$('#parent_ticket_query').style.display = "none"
        	//$('#parent_ticket_query').parentNode.removeChild($('#parent_ticket_query'))
        }
    }
}

function put_users (users) {
	$forEach('.all_users', (el) => {
		if (el.getAttribute('name') == 'ticket') {
			el.innerHTML = input_checkbox ('handlers', users)
		} else if (el.getAttribute('name') == 'project') {
			el.innerHTML = input_checkbox ('group', users) 
		}
	})
}

function input_checkbox (name, users) {
	let html = ``
	let super_user = `<span class="tag">(su)</span>`
	for (let i = 0; i < users.length; i++) {
		let innerHTML = `<input type="checkbox" name=${name} value=${users[i].username}> ${users[i].full_name}${(users[i].type=='superuser')?super_user:''} <br>`
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

$('#createProjectBtn').addEventListener('click', () => {
	let project_form = document.forms["project_form"].elements
	let group = project_form['group']
	let desc = encodeURIComponent(project_form['desc'].value)

	let pg_html = ''
	for(let i = 0; i < group.length; i++){
		if (group[i].checked)
			pg_html += `&group=${group[i].value}`
	}
	console.log(`/project/create?name=${project_form['name'].value}&desc=${desc}&repo_name=${project_form['repo_name'].value}&repo_type=${project_form['repo_type'].value}${pg_html}`)
	xhrRequest(`/project/create?name=${project_form['name'].value}&desc=${desc}&repo_name=${project_form['repo_name'].value}&repo_type=${project_form['repo_type'].value}${pg_html}`, (res) => {
		
	})
})

