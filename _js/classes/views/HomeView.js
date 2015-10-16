var PostCollection = require('../collections/PostCollection.js');
var PostView = require('./PostView.js');
var template = require('../../../_hbs/home.hbs');
var User = require('../models/User.js');
var bcrypt = require('../../../js/vendor/bcrypt.min.js');

var HomeView = Backbone.View.extend({


	template: template,
	className: 'home-container',
	
	events: {
		//'click .tweet': 'addPost',
		'click .login': 'showLogin',
		'click .logout': 'logout',
		'click .login-submit': 'login',
		'change .filter-select': 'filterPosts',
		'input .search-input': 'inputSearch' 
	},

	initialize: function(options){
		
		this.collection = new PostCollection();
		if (!navigator.onLine){
			this.render();
			this.collection = new PostCollection(JSON.parse(localStorage.collection));
			this.renderPosts(this.collection);
			this.$el.find('.upload').addClass('hide');
		}
		this.listenTo(this.collection, 'sync', this.renderPosts);
		if(!options){
			//page = #home, see whole collection
			
			var loggedIn = $.get('api/me')
			.success(function(data){
				if(data.length === 0){
					console.log('No user logged in.');
					$('header .login').removeClass('hide');
					$('header .register').removeClass('hide');
					$('footer .post').addClass('hide');
					this.$el.find('footer .upload').addClass('hide');
				}else{
					this.me = data.id;
					this.$el.find('footer .user-p').text(data.username);
					this.$el.find('footer .user-img').attr('src','uploads/users/'+data.id+data.extension);
					this.$el.find('footer .user-p').removeClass('hide');
					this.$el.find('footer .user-img').removeClass('hide');
					//show button to personal collection
					$('header h2 a').removeClass('hide');
					//show logout button
					$('header .logout').removeClass('hide');
				}
			}.bind(this));
			this.collection.fetch({
				success: function(collection, response) {
					console.log('saving to localStorage');
					localStorage.collection = JSON.stringify(collection);
				},
				error: function () {
					Window.Application.navigate('home', {trigger: true});
				}
			});

		}else{
			//page = #me, see my collection

			var loggedIn = $.get('api/me')
			.success(function(data){
				if(data.length === 0){
					console.log('No user logged in.');
					if(options){
						Window.Application.navigate('home',{trigger:true});
					}
				}else{
					this.me = data.id;

					this.$el.find('footer .user-p').text(data.username);
					this.$el.find('footer .user-img').attr('src','uploads/users/'+data.id+data.extension);
					this.$el.find('footer .user-p').removeClass('hide');
					this.$el.find('footer .user-img').removeClass('hide');

					this.collection = new PostCollection({
						user_id: data.id
					});
					this.collection.fetch({
						success: function(collection, response) {
							console.log('saving to localStorage');
							localStorage.collection = JSON.stringify(collection);
							this.renderPosts(this.collection);
						}.bind(this),
						error: function () {
							Window.Application.navigate('home', {trigger: true});
						}
					});
					//$('header h2').html('Welcome '+data.username+'. <a href="#home" class="h2-button">See everything.</a>');
					$('header h2 a').html('See everything');
					$('header h2 a').attr('href','#home');
					$('header h2 a').removeClass('hide');
					//show logout button
					$('header .logout').removeClass('hide');
					
				}
				//this.listenTo(this.collection, 'sync', this.renderPosts);
			}.bind(this));
		}
		
		

	},

	inputSearch: function(e){
		e.preventDefault();
		var input = $(e.currentTarget).val().toLowerCase();
		//console.log(input);
		if(input !== ""){
			this.$el.find('.addstudent').hide();
			this.renderPosts(
				this.collection.filterPosts(input)
				);
		}else{
			this.$el.find('.addstudent').show();
			this.collection.fetch();
		}

	},

	filterPosts: function(e){
		console.log();
		var newC = new PostCollection();
		this.collection.forEach(function(post, index){
			//post.removeClass('hide');
			this.$posts = this.$el.find('.collection');
			console.log(post);
			this.$posts.empty();
			if(post.attributes.type == $(e.currentTarget ).find("option:selected").val()){
				newC.add(post);
			}
		}.bind(this));
		this.renderPosts(newC);
	},

	renderPosts: function(filteredCollection){
		
		if(filteredCollection.length <= 0){
			this.collection.forEach(this.renderPost, this);
		}else{
			filteredCollection.forEach(this.renderPost, this);
		}
	},

	showLogin: function(e){
		e.preventDefault();
		$('.login-form').addClass('show');
	},

	login: function(e){
		e.preventDefault();
		//this.hideErrors();
		this.errorInput();
		$('.show').css('height','auto');

		console.log("HomeView: login");
		var error = false;
		//validation checks
		if(this.errorInput()){
			console.log("errorinput");
			error = true;
		}		
		if(!error){

			this.$el.find('.error-email').removeClass('error');
			this.$el.find('.error-pass').removeClass('error');
			this.$el.find('.email-input').removeClass('error');
			this.$el.find('.password-input').removeClass('error');

			//check if photo is valid
			
			//check of user bestaat
			this.user = new User({email: this.$el.find('.email-input').val()});
			this.user.fetch({
				success: function(model,response){
					//console.log(response);
					if(response.length === 0){
						this.$el.find('.error-email').addClass('error');
						this.$el.find('.error-email').html('U heeft een verkeerd e-mailadres ingegeven.');
						this.$el.find('.email-input').addClass('error');
						console.log('User doesnt exist! Error: wrong emailadress');
						
					}else{
						console.log('User exists! Check if password matches');
						if(bcrypt.compareSync(this.$el.find('.password-input').val(), model.get('password'))){
							console.log('Password matches. Save user in session');
							this.addToSession();
							
						}else{
							this.$el.find('.error-pass').addClass('error');
							this.$el.find('.error-pass').html('U heeft een verkeerd wachtwoord ingegeven.');
							this.$el.find('.password-input').addClass('error');
							console.log('User doesnt exist! Error: wrong emailadress');
						}
					}
				}.bind(this)
			});
		}

	},

	addToSession: function(){
		console.log('HomeView: login - addToSession');
		var dataUser = {
			'id': this.user.get('id')			
		};

		$.post('api/me',dataUser)
		.success(function(data){
			//console.log('[HomeView] Saved user to session');
			Window.Application.navigate('me',{trigger:true});
		});
	},

	logout:function(e){
		e.preventDefault();
		$.post('api/logout');
		/*.success(function(){*/
			Window.Application.navigate('',{trigger:true});
		/*});*/
		
	},

	errorInput: function(){
		//console.log('error');
		var error = false;
		if(this.$el.find('.email-input').val() === ""){
			this.$el.find('.error-email').addClass('error');
			this.$el.find('.error-email').html('Vul a.u.b. een e-mailadres in');
			this.$el.find('.email-input').addClass('error');
			error = true;
		}
		if(this.$el.find('.password-input').val() === ""){
			this.$el.find('.error-pass').addClass('error');
			this.$el.find('.error-pass').html('Vul a.u.b. een wachtwoord in');
			this.$el.find('.password-input').addClass('error');
			error = true;
		}
		return error;

	},

	hideErrors: function(){
		console.log('hiding errors');
		if(this.$el.find('.email-input').val() === ""){
			this.$el.find('.email-input').removeClass('error');
		}
		if(this.$el.find('.password-input').val() === ""){
			this.$el.find('.password-input').removeClass('error');
		}
	},

	renderPost: function(model){
		var view = new PostView({
			model: model,
			me_id: this.me
		});
		//console.log(view.render().el);
		this.$posts.append(view.render().el);
	},

	render: function(){
				
		this.$el.html(this.template());
		this.$posts = this.$el.find('.collection');

		return this;

	}

});

module.exports = HomeView;