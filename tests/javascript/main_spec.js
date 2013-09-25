define(['../../app/main'], function(Main) {
	describe('main loader', function() {
		it('should load application', function() {
			var c = spyOn(console, 'log')
			Main.init();
			expect(c).toHaveBeenCalled();
		})
	})	
})

