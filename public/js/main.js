let chatbox = document.querySelector('#chatbox > textarea')
chatbox.addEventListener('keydown', (ev) => {
	if (ev.keyCode == 13) {
		ev.preventDefault()
		chatbox.value = ''
	}
})

chatbox.addEventListener('keyup', (ev) => {
	if (ev.keyCode == 13) {
		ev.preventDefault()
	}
})