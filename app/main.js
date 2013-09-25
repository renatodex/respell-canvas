define(['jquery'], function($) {
	
	var Main = function() {
		var init = function() {
			console.log('carregou main')
		} 
		
		return {
			init:init
		}
	}();
	
	return Main;
})