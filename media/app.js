// tester/esprima/app.js

var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!'
	},
	created: function( )
	{
		console.log('vue created') ;
	},
	mounted: function( )
	{
		console.log('vue mounted') ;
	},
	methods:
	{
		ok_click( )
		{
			this.message = 'ok' ;
			console.log('ok_click') ;
		}
	}
})

