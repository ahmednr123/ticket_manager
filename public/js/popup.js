const urlParams = new URLSearchParams(window.location.search)

if(urlParams.get('popup')){
	$('.popup_bg').style.display = 'block'
}

if(window.location.pathname == '/su') {
	console.log('Its super user alright')
}