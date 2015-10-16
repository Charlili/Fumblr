
var HomeView = require('../views/HomeView.js');
var RegisterView = require('../views/RegisterView.js');
var UploadView = require('../views/UploadView.js');

var Application = Backbone.Router.extend({

	routes: {
		//pagina: functie
		"home": "home",
		"me":"me",
		"post": "post",
		"register": "register",
		"*actions": "default"
	},

	empty: function(){
		//container clearen
		$('.container').empty();
	},

	home: function(){
		this.empty();
		this.home = new HomeView();
		$('.container').append(this.home.render().el);
	},

	me: function(){
		this.empty();
		this.home = new HomeView({
			me: true
		});
		$('.container').append(this.home.render().el);
	},

	post: function(){
		this.empty();
		this.post = new UploadView();
		$('.container').append(this.post.render().el);
	},

	register: function(){
		this.empty();
		this.register = new RegisterView();
		$('.container').append(this.register.render().el);
	},

	default: function(){
		this.navigate("home", {trigger: true});
		
	}

});

module.exports = Application;