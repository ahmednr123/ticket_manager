show_loader()

$('#complex_container').style.display = 'none'
$('#simple_container').style.display = 'none'

document.getElementById('tickets_link').classList.add('selected')

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

xhrRequest(`/ticket/node?id=16`, (res) => {
	console.log(res)
})

$forEach('.popup_link', (el) => {
	el.addEventListener('click', () => {
		xhrRequest(`/ticket/node?id=${el.getAttribute('ticket_id')}`, (res) => {
			console.log(res)
			let ticket = JSON.parse(res)

			$('#ticket_name').innerHTML = ticket.name
			$('#ticket_proj_name').innerHTML = ticket.project_name
			$('#ticket_handlers').innerHTML = ticket.handlers || '-'
			$('#ticket_id').innerHTML = ticket.ticket_id || '-'

			// SUPER USER
			if($('#update_desc')) {
				$('#update_desc').setAttribute('ticket_id', ticket.id)

				pushMarkdownByName('desc', ticket.desc_md)
				pushMarkdownHTML(1, ticket.desc_html)
			} else {
				$('#ticket_desc').innerHTML = ticket.desc_html
			}

			if($('#update_doc')) {
				$('#update_doc').setAttribute('ticket_id', ticket.id)
			}

			if(ticket.owner) {
				$('#simple_container').style.display = 'none'
				$('#complex_container').style.display = 'block'

				pushMarkdownByName('doc', ticket.doc_md)
				pushMarkdownHTML(document.querySelectorAll('.md_event').length/2, ticket.doc_hmtl)
			} else {
				$('#simple_container').style.display = 'block'
				$('#complex_container').style.display = 'none'

				$('#ticket_doc').innerHTML = ticket.doc_html
			}

			hide_loader()
		})
	})
})

if($('#update_desc')){
	$('#update_desc').addEventListener('click', () => {
		let id = $('#update_desc').getAttribute('ticket_id')
		let desc = getMarkdownByName('desc')
		xhrRequest(`/ticket/update?id=${id}&type=description&desc=${encodeURIComponent(desc)}`, (res) => {
			console.log(res)
		})
	})
}

if($('#update_doc')) {
	$('#update_doc').addEventListener('click', () => {
		let id = $('#update_doc').getAttribute('ticket_id')
		let doc = getMarkdownByName('doc')
		xhrRequest(`/ticket/update?id=${id}&type=documentation&doc=${encodeURIComponent(desc)}`, (res) => {
			console.log(res)
		})
	})

	$('#complete').addEventListener('click', () => {
		let id = $('#update_doc').getAttribute('ticket_id')
		xhrRequest(`/ticket/complete?id=${id}`, (res) => {
			console.log(res)
		})
	})
}

Array.prototype.forEach.call(document.querySelectorAll('textarea'), function (el) {
	el.addEventListener('keyup', function () {
		el.style.height = (el.scrollHeight) + 'px';
	})
});

function show_loader () {
	$('.popup_child').style.display = 'none'
	$('.loader').style.display = 'block'

	if($('#update_doc'))
		$('#update_doc').setAttribute('ticket_id', '0')
	if($('#update_desc'))
		$('#update_desc').setAttribute('ticket_id', '0')
}

function hide_loader () {
	$('.loader').style.display = 'none'
	$('.popup_child').style.display = 'block'
}