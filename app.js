console.log('carregou app')
// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
	"urlArgs": "bust=" + (new Date()).getTime(), 
    "paths": {
      "app": "app/",
      "jquery": "vendor/jquery"
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);