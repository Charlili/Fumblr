var template = require('../../../_hbs/edit.hbs');
var Post = require('../models/Post.js');
var PostCollection = require('../collections/PostCollection.js');
//var bcrypt = require('../../../js/vendor/bcrypt.min.js');

var UploadView = Backbone.View.extend({

	template: template,
	
	tagName: 'div',
	className: 'edit-container',

	events: {
		'click .submit': 'savePost',
		'change .photo-input': 'previewImage',
		'click .choose': 'showCorrectForm',
		'blur .url-input': 'previewImage'
	},

	initialize: function(options){
		if(options && options.post_id != undefined){
			this.post_id = options.post_id;
		}else{
			Window.Application.navigate('home',{trigger:true});
		}

		var loggedIn = $.get('api/me')
		.success(function(data){
			if(data.length === 0){
				console.log('No user logged in.');
				Window.Application.navigate('home',{trigger:true});				
			}else{
				this.me_id = data.id;
				$('footer').addClass('hide');

				this.post = new Post({
					id: this.post_id
				});
				this.post.fetch({success:this.fillIn});

			}
		}.bind(this));
		
	},
	fillIn: function(){
		if(this.post.get('type') == 'quote'){
			this.$el.find('.quote-input').val(this.post.get('content'));
			this.$el.find('.author-input').val(this.post.get('author'));
			this.$el.find('.quote-upload').removeClass('hide');
		}else{
			var img = document.createElement('img');
			$(img).addClass('photo-preview');
			this.$el.find('.img-upload').removeClass('hide');
			var url = 'uploads/' + this.post.get('user_id') + "/" + this.post.get('id') + this.post.get('content');
			img.setAttribute('src', this.post.get());
			this.fileB = img;
			this.extension = this.post.get('content');
			this.$el.find('.preview-cont').append(this.fileB);

		}
		this.$el.find('.description-input').val(this.post.get('description'));
	},

	render: function(){
		this.$el.html(this.template());
		return this;
	},

	showCorrectForm: function(e){
		e.preventDefault();
		console.log('hullo');
		this.$el.find('form.hide').removeClass('hide');
		switch($(e.currentTarget).attr('alt')){
			case 'quote':
				this.$el.find('.img-upload').addClass('hide');
				break;
			default:
				this.$el.find('.quote-upload').addClass('hide');
				break;
		}
	},

	previewImage: function(e){
		console.log('changed');
		this.fileB = this.checkFile(e);
		console.log(this.fileB);
		if(this.fileB != false){
			this.$el.find('.photo-p').remove();
			this.$el.find('.photo-preview').remove();
			this.$el.find('.preview-cont').append(this.fileB);
		}
	},

	checkFile: function(e){

		//if url-input is clicked but nothing entered -> just reuse file from previous upload (like an image) if it exists boyo
		var check = false;
		if(this.fileB !== undefined && this.fileB != false){check = this.fileB;}

		var $form = this.$el.find('.img-upload');

		//if upload file with input
		if($(e.currentTarget).attr('name') != 'url'){
			if(this.$el.find('.photo-input')[0].files.length > 0){
				//this.name = $(this.$el.find('.photo-input')[0]).val();
				var file = this.$el.find('.photo-input')[0].files[0];
				this.name = file.name;
		        this.extension = this.name.replace(/^.*\./, '.');
		        //console.log(this.extension);

				var file = this.$el.find('.photo-input')[0].files[0];
				//if uploaded is an image
				if(file.type.search('image') != -1) {
					var reader = new FileReader();
					var img = document.createElement('img');
					$(img).addClass('photo-preview');
		        	reader.onload = function(event) {
			        	var errorString = "no error in errorString";
				            
			        	img.onload = function() {
				          	if(img.width > 2592 || img.height > 2592) {
				              errorString = 'De afbeelding moet kleiner zijn dan 2593x1936';
				              return check;
				            }
				            //console.log(errorString);
			          	}
			          	img.setAttribute('src', reader.result);

			        };
			        reader.readAsDataURL(file);
			        return img;

				}else{

					this.hideErrors($form);
					this.errorInput($form);
					return check;
				}
			}else{
				this.hideErrors($form);
				this.errorInput($form);
				return check;
			}
			return check;
		}else{
			//if upload file with url
			var input = this.$el.find('.url-input').val();
			
			if(input.length > 0){
				this.extension = input.replace(/^.*\./, '.');
				var img = document.createElement('img');
				$(img).addClass('photo-preview');
				$(img).addClass('url-upload');
	        	img.setAttribute('src', input);
	          	if(img.width > 2592 || img.height > 2592) {
	              errorString = 'De afbeelding moet kleiner zijn dan 2593x1936';
	              return check;
	            }
		        return img;
		    }else{
		    	//niks in input gezet
		    	return check;
		    }
		}
	},

	savePost: function(e){
		console.log('saving post');
		e.preventDefault();
		var fileB = true;
		var error = false;

		var $form;

		if(!this.$el.find('.img-upload').hasClass('hide')){
			$form = this.$el.find('.img-upload');
			//fileB = this.checkFile(e);
			this.hideErrors($form);
			error = this.errorInput($form);
		}else{
			$form = this.$el.find('.quote-upload');
			this.hideErrors($form);
			error = this.errorInput($form);
		}

		console.log(error);
		console.log(this.fileB);

		if(this.fileB != false && error == false){

			if($form.attr('action') == 'quote-upload'){
				console.log('saving quote shizzle');
				var type = "quote";
				var content = $form.find('.quote-input').val();
				var author = $form.find('.author-input').val();			
			}else{
				console.log('saving image shizzle');
				var type = "image";
				var content = this.extension;
				var author = "";
				
			}
			var description = $form.find('.description-input').val();

			var post = new Post({
				user_id: this.me_id,
				type: type,
				content: content,
				author: author,
				description: description
			});
			console.log(post);
			post.save(undefined, {
				success: function(data){
					console.log('saved post: ');
					console.log(data.attributes.id);
					if($form.attr('action') == 'img-upload'){
						this.saveImage(data.attributes.id);
						
					}else{
						Window.Application.navigate('me',{trigger:true});
					}
				}.bind(this),
				error: function(e){
					console.log(e);
				}
			});
		}
	},
	saveImage: function(post_id){

		var data = new FormData();
		data.append('post_id',post_id);
		data.append('user_id',this.me_id);

		//check if preview image is from url
		if(this.$el.find('.photo-preview').hasClass('url-upload')){
			data.append('url',this.$el.find('.photo-preview').attr('src'));
		}else{
			//preview is from upload, not url
			var file = this.$el.find('.photo-input')[0].files[0];
			//geen image
			if(file.type.search('image') >= 0){
				data.append('SelectedFile', this.$el.find('.photo-input')[0].files[0]);
			}
			
		}	
			
		$.ajax({

			url: 'api/upload/',
			data: data,
			type: 'POST',
			enctype: 'multipart/form-data',
			processData: false,
			contentType: false

		}).done(function(data){

			console.log('done saving image');
			Window.Application.navigate('me',{trigger:true});

		}.bind(this));
		

	},

	getInfo: function(model){
		return model;
	},

	errorInput: function($form){
		console.log(' checking errors');
		var error = false;
		//console.log($form);
		//console.log($form.find('.description-input').val());
		if($form.find('.description-input').val() === ""){
			console.log('Please fill in a description');
			$form.find('.error-description').html('Please fill in a description');
			$form.find('.error-description').addClass('error');
			$form.find('.description-input').addClass('error');
			error = true;
		}
		return error;

	},

	hideErrors: function($form){
		console.log('hiding errors');
		if($form.find('.description-input').val() !== ""){
			$form.find('.error-description').removeClass('error');
			$form.find('.description-input').removeClass('error');
			error = false;
		}
		if($form.find('.quote-input').length !== 0 && $form.find('.quote-input').val() !== ""){
			$form.find('.error-quote').removeClass('error');
			$form.find('.quote-input').removeClass('error');
			error = false;

		}
	}

});

module.exports = UploadView;