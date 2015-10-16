var template_image = require('../../../_hbs/post_image.hbs');
var template_quote = require('../../../_hbs/post_quote.hbs');

var PostView = Backbone.View.extend({

	template_image: template_image,
	template_quote: template_quote,
	
	tagName: 'li',
	className: 'post', 

	events: {
		'click .remove': 'clickDelete',
	},

	clickDelete: function(e){
		e.preventDefault();
		if (window.confirm("Are you sure you want to delete this post?")) {
            this.model.destroy();
        }
		//
	},

	initialize: function(options){
		this.model = options.model;
		this.me_id = options.me_id;

		this.listenTo(this.model, 'destroy', this.remove);
		this.type = this.model.get('type');

	},

	deleteButtons: function(){
		this.$el.find('.icon').remove();
	},

	render: function(){
		console.log('rendering a post');
		//console.log(this.model.attributes);
		switch(this.type){
			case 'quote':
				this.$el.html(this.template_quote(this.model.attributes));
			break;
			default:
				this.$el.html(this.template_image(this.model.attributes));
			break;
		}
		if(this.me_id === undefined){
				this.deleteButtons();
		}else{
			if(this.me_id != this.model.get('user_id')){
				this.deleteButtons();
			}
		}

		//this.$el.html(this.template(this.model.attributes));
		return this;
	}


});

module.exports = PostView;