let _global = {}
_global.md_text = true

document.getElementById('tickets_link').classList.add('selected')

document.addEventListener('click', (el) => {
	if(el.target.classList.contains('popup_bg'))
		document.getElementsByClassName('popup_bg')[0].style.display = 'none';
})

Array.prototype.forEach.call(document.querySelectorAll('.popup_link'), function (el) {
	el.addEventListener('click', function () {
		document.getElementsByClassName('popup_bg')[0].style.display = 'block';
	})
});

function md_btn_click () {
	if (_global.md_text) {
		document.getElementById('md_text_box').style.display = 'block'
		document.getElementById('md_render_box').style.display = 'none'
	} else {
		document.getElementById('md_render_box').style.display = 'block'
		document.getElementById('md_text_box').style.display = 'none'
	}
}

document.getElementById('md_text').addEventListener('click', () =>{
	_global.md_text = true
	md_btn_click()
})

document.getElementById('md_render').addEventListener('click', () =>{
	_global.md_text = false
	md_btn_click()
})

Array.prototype.forEach.call(document.querySelectorAll('textarea'), function (el) {
	el.addEventListener('keyup', function () {
		el.style.height = (el.scrollHeight) + 'px';
	})
});