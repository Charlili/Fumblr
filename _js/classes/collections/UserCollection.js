var User = require('../models/User.js');

var UserCollection = Backbone.Collection.extend({

	model: User,
	url: '/RMDII/opdracht/api/users',

	initialize: function(options){
		if(options){
			this.week_id = options.week_id;
			this.id = options.id;
		}
	},

	//sorteren van users, .sort oproepen voor je je users rendert
	comparator: function(user) {
		if(user.get('total')){
			return - user.get("total");
		}
	},

	methodUrl: function(method){
		//if method === read; = checken als het een GET is! 
		if(method === "read" && this.week_id){
			this.url = "/RMDII/opdracht/api/week/users/" + this.week_id;
			return;
		}
		if(method === "read" && this.id){
			this.url = "/RMDII/opdracht/api/users/" + this.id;
			return;
		}
		this.url = '/RMDII/opdracht/api/users';

	},

	sync: function(method, model, options) {
		if(model.methodUrl && model.methodUrl(method.toLowerCase())) {
			options = options || {};
			options.url = model.methodUrl(method.toLowerCase());
		}
    Backbone.Collection.prototype.sync.apply(this, arguments);
	}/*,

	methodUrl: function(method){
		//if method === read; = checken als het een GET is! 
		this.url = '/RMDII/opdracht/api/users';

	}*/

});

module.exports = UserCollection;