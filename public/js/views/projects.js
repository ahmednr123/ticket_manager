let _global = {}

document.getElementById('projects_link').classList.add('selected')

Array.prototype.forEach.call(document.querySelectorAll('textarea'), function (el) {
	el.addEventListener('keyup', function () {
		el.style.height = (el.scrollHeight) + 'px';
	})
});

show_loader()

document.addEventListener('click', (el) => {
	if(el.target.classList.contains('popup_bg')){
		document.getElementsByClassName('popup_bg')[0].style.display = 'none';
		show_loader()
	}
})

Array.prototype.forEach.call(document.querySelectorAll('.popup_link'), function (el) {
	el.addEventListener('click', function () {
		document.getElementsByClassName('popup_bg')[0].style.display = 'block';
	})
});

$forEach('.popup_link', (el) => {
	el.addEventListener('click', () => {
		xhrRequest(`/project/node?id=${el.getAttribute('project_id')}`, (res) => {
			let id = el.getAttribute('project_id')
			let project = JSON.parse(res)
			$('#proj_name').innerHTML = project.name
			$('#proj_ip').innerHTML = project.ip_addr
			$('#proj_port').innerHTML = project.port
			
			if ($('.md_render_control')) {
				pushMarkdownHTML(1, project.desc_html)
				pushMarkdown(1, project.desc_md)
				$('#update').setAttribute('project_id', project.id)
			} else {
				$('#proj_desc').innerHTML = project.desc_html
			}

			$('#project_docs').innerHTML = ''

			xhrRequest(`/project/docs?id=${id}`, (res) => {
				let docs = JSON.parse(res)
				for(let i = 0; i < docs.length; i++){
					$('#project_docs').innerHTML += `<h3>${docs[i].name}</h3><br><div class="ph_desc_container">${docs[i].html}</div>`
				}
				//$('#project_docs').innerHTML = res
			})
			
			hide_loader()
		})
	})
})

$('#update').addEventListener('click', () => {
	if($('#update').getAttribute('project_id') != 0) {
		let id = $('#update').getAttribute('project_id')
		//let desc = encodeURIComponent(document.querySelector('#md_text_box textarea').value)
		let desc = getMarkdown(1)
		xhrRequest(`/project/update?id=${id}&desc=${desc}`, (res) => {
			document.getElementsByClassName('popup_bg')[0].style.display = 'none';
			show_loader()
		})
	}
})

function show_loader () {
	$('.popup_child').style.display = 'none'
	$('.loader').style.display = 'block'
	$('#update').setAttribute('project_id', '0')
}

function hide_loader () {
	$('.loader').style.display = 'none'
	$('.popup_child').style.display = 'block'
}