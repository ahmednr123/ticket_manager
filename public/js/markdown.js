if($('.md_event')){
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
}