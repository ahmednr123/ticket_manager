
let _global = {}
_global.md_text_one = true
_global.md_text_two = true

xhrRequest('/account/all', (res) => {
	_global.users = JSON.parse(res)
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

function put_users (name, users) {
	$forEach('.all_users', () => {
		
	})
}

function input_checkbox (name, values) {

}