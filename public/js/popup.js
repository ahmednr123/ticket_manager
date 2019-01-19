const urlParams = new URLSearchParams(window.location.search)

if(urlParams.get('popup')){
	$('.popup_bg').style.display = 'block'
}

if(window.location.pathname == '/su') {
	console.log('Its super user alright')
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
	        	$('#parent_ticket_query').parentNode.removeChild($('#parent_ticket_query'))
	        }
	    }
	}
}