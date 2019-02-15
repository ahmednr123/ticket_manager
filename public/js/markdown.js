/*if($('.md_event')){
	let md_btn = $('.md_event', 'all')
	console.log('md events found')

	if((md_btn.length/2) == 1){
		$('#md_render').addEventListener('click', () => {
			console.log('Textarea: '+document.querySelector('#md_text_box textarea').value)
			let md = window.markdownit()
			let result = md.render(document.querySelector('#md_text_box textarea').value)
			document.querySelector('#md_render_box').innerHTML = result
		})
	} else {
		for (let i = 1; i <= (md_btn.length/2); i++) {
			console.log('MORE RENDERERS')
			$(`#md_render_${i}`).addEventListener('click', () => {
				console.log('Textarea: '+document.querySelector(`#md_text_box_${i} textarea`).value)
				let md = window.markdownit()
				let result = md.render(document.querySelector(`#md_text_box_${i} textarea`).value)
				document.querySelector(`#md_render_box_${i}`).innerHTML = result
			})
		}
	}
}*/

$forEach('a[class*="md_event"]', (el) => {

	el.addEventListener('click', () => {
  	let event_type = el.getAttribute('md-type')
    let event_element = el.getAttribute('md-element')

    $forEach('div[class*="md_block"]', (elx) => {
      if (elx.getAttribute('md-element') == event_element && elx.getAttribute('md-type') == event_type){
        if (event_type == 'render'){
        	let md = window.markdownit()
        	let md_content = document.querySelector(`div[class*="md_block"][md-element="${event_element}"][md-type="text"] textarea`).value
			elx.innerHTML = md.render(md_content) 
        }
        elx.style.display = 'block'
      } else if (elx.getAttribute('md-element') == event_element) {
        elx.style.display = 'none'
      }
    });
  })
})

$forEach('div[class*="md_block"][md-type="render"]', (el) => {
	el.style.display = 'none'
})

function getMarkdown (id) {
	return document.querySelector(`div[class*="md_block"][md-element="${id}"][md-type="text"] textarea`).value
}

function pushMarkdown (id, md) {
	document.querySelector(`div[class*="md_block"][md-element="${id}"][md-type="text"] textarea`).value = md
}

function pushMarkdownByName (name, md) {
	document.querySelector(`textarea[md-name="${name}"]`).value = md
}

function pushMarkdownHTML (id, html) {
	document.querySelector(`div[class*="md_block"][md-element="${id}"][md-type="render"]`).innerHTML = html
}

function getMarkdownByName (name) {
	return document.querySelector(`textarea[md-name="${name}"]`).value
}