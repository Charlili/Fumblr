var User = Backbone.Model.extend({
	//wat doet dit??
	urlRoot: '/RMDII/opdracht/api/users',

	initialize: function(options){
		if(options){
			this.email = options.email;
			this.id = options.id;
		}
	},

	methodUrl: function(method){
		//if method === read; = checken als het een GET is! 
		if(method === "read" && this.email){
			this.urlRoot = "/RMDII/opdracht/api/users/email/" + this.email;
			return;
		}
		if(method === "read" && this.id){
			this.url = "/RMDII/opdracht/api/users/" + this.id;
			return;
		}
		this.urlRoot = '/RMDII/opdracht/api/users';

	},

	sync: function(method, model, options) {
		if(model.methodUrl && model.methodUrl(method.toLowerCase())) {
			options = options || {};
			options.urlRoot = model.methodUrl(method.toLowerCase());
		}
    Backbone.Collection.prototype.sync.apply(this, arguments);
	}

});

module.exports = User;