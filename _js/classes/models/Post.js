var Post = Backbone.Model.extend({
	//wat doet dit??
	urlRoot: '/RMDII/opdracht/api/posts',

	/*initialize: function(options){
		if(options){
			//this.user_id = options.user_id;
			this.id = options.id;
		}
	},

	methodUrl: function(method){
		//if method === read; = checken als het een GET is! 
		if(method === "read" && this.id){
			this.urlRoot = "/RMDII/opdracht/api/posts/" + this.id;
			return;
		}
		this.urlRoot = '/RMDII/opdracht/api/posts';

	},*/


});

module.exports = Post;