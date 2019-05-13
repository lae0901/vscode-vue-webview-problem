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
		redirect_click()
		{
			console.log('hello');
		},

		getObjectList_click( )
		{
			console.log('getObjectLIst') ;
		}
	}
})

