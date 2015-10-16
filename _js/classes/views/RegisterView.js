var template = require('../../../_hbs/register.hbs');
var User = require('../models/User.js');
var UserCollection = require('../collections/UserCollection.js');
var bcrypt = require('../../../js/vendor/bcrypt.min.js');

var RegisterView = Backbone.View.extend({

	template: template,
	
	tagName: 'div',
	className: 'register-container',

	events: {
		'click .submit': 'addUser',
		'change .photo-input': 'previewImage'
	},

	initialize: function(){
			this.user;
	},

	render: function(){
		this.$el.html(this.template());
		return this;
	},
	
	/*useLocation: function(e){
		//console.log('use location');
		navigator.geolocation.getCurrentPosition(foundLocation, noLocation);

		function foundLocation(position)
		{
			var lat = position.coords.latitude;
			var long = position.coords.longitude;

			$.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&sensor=false').success(function(data){
			console.log(data.results[0].address_components);
			//var straat = data.address_components.long_name + " " + data.address_components.long_name;
			//var postcode = parseInt(data.results.address_components.long_name);
			//console.log(straat,postcode);

			var itemRoute='';
			var itemPc='';
			var itemSnumber='';
			var arrAddress = data.results[0].address_components;
			// iterate through address_component array
			$.each(arrAddress, function (i, address_component) {
			    //console.log('address_component:'+i);

			    if (address_component.types[0] == "route"){
			        //console.log(i+": route:"+address_component.long_name);
			        itemRoute = address_component.long_name;
			    }

			    if (address_component.types[0] == "postal_code"){ 
			        //console.log("pc:"+address_component.long_name);  
			        itemPc = address_component.long_name;
			    }

			    if (address_component.types[0] == "street_number"){ 
			        //console.log("street_number:"+address_component.long_name);  
			        itemSnumber = address_component.long_name;
			    }
			    //return false; // break the loop   
			});
			//console.log(itemRoute,itemSnumber,itemPc);
			$('.street-input').val(itemRoute + " " + itemSnumber);
			$('.town-input').val(itemPc);
		});
		//alert('Found location: ' + lat + ', ' + long);
		}
		function noLocation()
		{
			alert('Could not find location');
		}

		
	},*/

	previewImage: function(e){
		console.log('changed');
		var fileB = this.checkFile();
		if(fileB != false){
			this.$el.find('.photo-preview').remove();
			//this.$el.find('.photo-input').remove();
			this.$el.find('.preview-cont').append(fileB);
		}
	},

	checkFile: function(){
		//console.log("checkFile");
		if(this.$el.find('.photo-input')[0].files.length > 0){
			var filename = $(this.$el.find('.photo-input')[0]).val();
	        this.extension = filename.replace(/^.*\./, '.');
	        //console.log(this.extension);


			var file = this.$el.find('.photo-input')[0].files[0];
			if(file.type.search('image') != -1) {
				var reader = new FileReader();
				var img = document.createElement('img');
				$(img).addClass('photo-preview');
	        	reader.onload = function(event) {
		        	var errorString = "no error in errorString";
			            
		        	img.onload = function() {
			          	if(img.width > 2592 || img.height > 2592) {
			              errorString = 'De afbeelding moet kleiner zijn dan 2593x1936';
			              return;
			            }
			            //console.log(errorString);
		          	}
		          	img.setAttribute('src', reader.result);


		        };
		        reader.readAsDataURL(file);
		        return img;

			}else{
				this.hideErrors();
				this.errorInput();
				return false;
			}
		}else{
			this.hideErrors();
			this.errorInput();
			return false;
		}
		return false;
	},

	validateEmail: function(email){

    var re = /\S+@\S+\.\S+/;
    return re.test(email);

	},

	addUser: function(e){


		e.preventDefault();
		console.log("RegisterView: addUser");
		var error = false;
		//validation checks
		this.hideErrors();
		this.errorInput();

		
		if(!error){
			//check if photo is valid
				//check of user bestaat
			var email = false;
			var exist = new User({email: this.$el.find('.email-input').val()});
			exist.fetch({
				success: function(model,response){
					//console.log(response);
					if(response.length === 0){
						console.log('addUser: User doesnt exist. Time to create.!');

						if(this.validateEmail(this.$el.find('.email-input').val())){
							email = true;
							this.$el.find('.error-email').removeClass('error');
							this.$el.find('.email-input').removeClass('error');
						}else{
							email = false;
							this.$el.find('.error-email').html('Vul a.u.b. een geldig e-mailadres in');
							this.$el.find('.error-email').addClass('error');
							this.$el.find('.email-input').addClass('error');
						}

						if(email){
							this.saveUser();
						}

					}else{
						console.log('addUser: User exists! Dont create user!');
						this.$el.find('.error-email').html('Dit e-mailadres is al in gebruik.');
						this.$el.find('.error-email').addClass('error');
						this.$el.find('.email-input').addClass('error');
					}
				}.bind(this)
			});				
			

		}		
	},

	

	saveUser: function(){

		//this.$el.find('.password-input').val(),
		var hash = bcrypt.hashSync(this.$el.find('.password-input').val(), 8);
		//bcrypt.compareSync("B4c0/\/", hash);
		console.log(hash);
		this.user = new User({
			username: this.$el.find('.username-input').val(),
			email: this.$el.find('.email-input').val(),
			password: hash,
			extension: this.extension
		});
		
		this.user.save();
		console.log(this.user);
		this.listenToOnce(this.user,'sync',this.addToSession);
		//this.listenTo(this.user,'sync',this.addToSession);
		
	},

	/*saveExtension: function(){
		console.log(this.extension);
		this.user.set('extension',this.extension);
		this.user.save();
		this.listenToOnce(this.user, 'sync',this.addToSession);
	},*/

	addToSession: function(){
		console.log('RegisterView: addToSession');
		//Window.Application.activeUser = this.user;
		//$.post('login.php',data);
		
		var dataUser = {
			'id': this.user.get('id')			
		};

		$.post('api/me',dataUser)
		.success(function(data){
			console.log('[RegisterView] Saved user to session');
			this.saveImage();
			
			
		}.bind(this));
	},

	saveImage: function(){
		var fileB = this.checkFile();
		if(fileB != false){

			var data = new FormData();
		    data.append('SelectedFile', this.$el.find('.photo-input')[0].files[0]);

		    //data.append('user_id', this.user.get['id']);

		    var request = new XMLHttpRequest();

			request.onreadystatechange = function(){
			    if(request.readyState == 4){
			        try {
			            var resp = JSON.parse(request.response);
			        } catch (e){
			            var resp = {
			                status: 'error',
			                data: request.responseText
			            };
			        }
			        sourceFile = $($(resp.data).get(0)).val();
			        //console.log(sourceFile);
			        //var destFile = $($(resp.data).get(1)).val();
			        //console.log(destFile);
			    }
			}.bind(this);
			request.open('POST', 'api/upload/user');
			request.send(data);
			
			Window.Application.navigate('home',{trigger:true});
			//Window.Application.navigate('waiting',{trigger:true});
		}
	},

	getInfo: function(model){
		return model;
	},

	errorInput: function(){
		console.log('error');
		if(this.$el.find('.name-input').val() === ""){

			this.$el.find('.error-name').html('Vul a.u.b. je voor- en achternaam in');
			this.$el.find('.error-name').addClass('error');
			this.$el.find('.name-input').addClass('error');
			error = true;
		}
		if(this.$el.find('.email-input').val() === ""){
			this.$el.find('.error-email').html('Vul a.u.b. je e-mailadres in');
			this.$el.find('.error-email').addClass('error');
			this.$el.find('.email-input').addClass('error');
			error = true;
		}
		if(this.$el.find('.password-input').val() === ""){
			this.$el.find('.error-pass').html('Vul a.u.b. een wachtwoord in');
			this.$el.find('.error-pass').addClass('error');
			this.$el.find('.password-input').addClass('error');
			error = true;
		}

		if(this.$el.find('.username-input').val() === ""){
			this.$el.find('.error-username').html('Vul a.u.b. een straat en huisnummer in');
			this.$el.find('.error-username').addClass('error');
			this.$el.find('.username-input').addClass('error');
			error = true;

		}

		if(this.$el.find('.photo-input')[0].files.length === 0){
			this.$el.find('.photo-p').addClass('red');
			this.$el.find('.photo-p').html("Je afbeelding mag niet groter zijn dan 5MB. Gelieve een foto up te loaden.")
		}

	},

	hideErrors: function(){
		console.log('hiding errors');
		if(this.$el.find('.name-input').val() !== ""){
			this.$el.find('.error-name').removeClass('error');
			this.$el.find('.name-input').removeClass('error');
			error = false;
		}
		if(this.$el.find('.email-input').val() !== ""){
			this.$el.find('.error-email').removeClass('error');
			this.$el.find('.email-input').removeClass('error');
			error = false;

		}
		if(this.$el.find('.password-input').val() !== ""){
			this.$el.find('.error-pass').removeClass('error');
			this.$el.find('.password-input').removeClass('error');
			error = false;

		}
		if(this.$el.find('.username-input').val() !== ""){
			this.$el.find('.error-username').removeClass('error');
			this.$el.find('.username-input').removeClass('error');
			error = false;

		}
	}

});

module.exports = RegisterView;