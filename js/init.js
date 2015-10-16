fallback.load({
	jQuery: [
		'//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',
		'js/vendor/jquery.min.js'
	],
	Handlebars: [
	'//cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.min.js',
	'js/vendor/handlebars.min.js'
	],
	_: [
	'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
	'js/vendor/underscore.min.js'
	],
	Backbone: [
	'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js',
	'js/vendor/backbone.min.js'
	],
	'app.js': 'js/app.js'
	
}, {
	shim: {
		'Backbone' : ['Handlebars', '_', 'jQuery'],
		'app.js' : ['Backbone']
	}
});

/*fallback.ready(['']function(){
	init();
});*/