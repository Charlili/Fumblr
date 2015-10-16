var Handlebars = require("hbsfy/runtime");
var Application = require("./classes/routers/Application.js");


$.ajaxSetup({
    statusCode: {
        401: function(){
            // Redirec the to the login page.
            //window.location.replace('/#login');
            console.log("401 statuscode. There is no user logged in.")        
        },
        403: function() {
            // 403 -- Access denied
            //window.location.replace('/#home');
            console.log("403 statuscode. User is not admin.")
        }
    }
});

function init() {

    //reset cache
    window.addEventListener('load', checkCache, false);
	//nieuwe router aanmaken:
	Window.Application = new Application();
	//backbone gaat router opstarten:
	Backbone.history.start();

}

function checkCache(e){

    // Check if a new cache is available on page load.
    window.applicationCache.addEventListener('updateready', function(e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            if (confirm('A new version of this site is available. Load it?')) {
                window.applicationCache.swapCache();
                window.location.reload();
            }
            } else {
                // Manifest didn't changed. Nothing new to server.
            }
        }, false);
}

init();