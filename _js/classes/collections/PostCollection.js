var Post = require('../models/Post.js');

var PostCollection = Backbone.Collection.extend({

	model: Post,
	url: '/RMDII/opdracht/api/posts',

	initialize: function(options){
		if(options){
			this.user_id = options.user_id;
		}
	},

	comparator: function(post) {
		return - post.get("id");
	},

	filterPosts:function(query){
		return this.filter(function(post){
			//dus als het gevonden is
			return post.get('content').toLowerCase().indexOf(query) > -1 ||
			post.get('description').toLowerCase().indexOf(query) > -1 || 
			post.get('author').toLowerCase().indexOf(query) > -1;
		});
	},

	//sorteren van posts, .sort oproepen voor je je posts rendert

	methodUrl: function(method){
		//if method === read; = checken als het een GET is! 
		if(method === "read" && this.user_id){
			this.url = "/RMDII/opdracht/api/posts/user/" + this.user_id;
			return;
		}
		this.url = '/RMDII/opdracht/api/posts';

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
		this.url = '/RMDII/opdracht/api/posts';

	}*/

});

module.exports = PostCollection;