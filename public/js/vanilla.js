function $(_element, _i){
	if(!_element)
		return document
	if(_element[0] === '#'){
		return document.getElementById(_element.slice(1))
	} else if (_element[0] === '.') {
		if(_i === 'all')
			return document.getElementsByClassName(_element.slice(1))
		else
			return document.getElementsByClassName(_element.slice(1))[_i | 0]
	} else {
		return document.getElementsByTagName(_element)[_i | 0]
	}
}

var $forEach = function(_element, _func){
	Array.prototype.forEach.call(document.querySelectorAll(_element), _func);
}

let xhrRequest = function(_url, _onReady,_xhr){
	var xhr = _xhr || new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			_onReady(xhr.responseText, _xhr);
		}
	}
	xhr.open("GET", _url, true);
	xhr.send();
}