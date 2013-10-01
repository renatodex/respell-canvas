respell-canvas
==============

The idea of this framework is to allow the developer to create a whole web application using only javascript and canvas.
I spent hours and hours looking for a solid base to work with HTML5 and Canvas. After no valuable success, i decided to start this project.

Bellow, i will talk about the main parts of this tool, and at the end, i will give some insights about what is possible to do.

The concept of Javascript Controllers
-------------------------

If you already worked with Ruby on Rails, Zend Framework, ASP.NET MVC or other MVC frameworks, you will feel confortable using Respell Canvas.
The idea of controllers here is to allow the developer to segment and divide group of actions into small pieces of code, and structure them in a manner to keep the code right and clean.

Example: /controllers/tasks_controller.js

```
define(['controller'], function(Controller) {
	return {
		index : function() {
			
		},
		
		create : function(task_name, task_priority) {
			
		},
		
		delete : function(task_id) {
			
		}
	}
});
```

Like any other MVC framework, the controller have clear and direct definitions about which actions are hosted on its declaration.
Actions represent http requests, but can be used to aux and help the main controller action, serving only as private or protected actions.

Controller Dispatching (routes)
-------------------------

In a server side MVC framework, Controller Actions are commonly dispatched as HTTP request. On canvas, each action will be dispatched as a Rendering action. 
A Rendering Action resets the actual canvas and clear the stage preparing the rendering cycle for a new work and play.

```
define(['route', 'controller'], function(App, Controller) {
	App.routes({
		'index' : Controller.dispatch('tasks', 'create'),
		'tasks/delete/:task_id' : Controller.dispatch('tasks', 'delete')
	})
	
	App.start('tasks', 'index');
	
	return App;
});
```

To make this job possible, we use Backbone.Routes to map each route and dispatch the related controller action.
There are also some helper methods which allows you to define what is the first rendering action loaded, or what to do before or after a  Rendering Request.

Saving and Restoring States
-------------------------

Every web app will need ways to interact with the user and change the stage.
The Canvas API provide a rich interface to save and restore our stages, and this system is wrapped inside the Controller module.

Consider we have a homepage, which have some shapes drawed on there.
At some point, the user click in a button, and we want to show a lightbox modal with some information.
When the modal pops out, we can clean the whole stage and restore the last instance of the Rendered Action to start Drawing on top of the last scene state.
See how its done:

```
define(['controller', 'rendering_request'], function(Controller, Request) {
	return {
		home_page : function() {
			//= some code to draw our homepage
		},
		
		my_modal : function() {
			Request.restore();
			//= some code to draw our modal
		}
	}
});
```

In this way, you will draw your home page, and your button event can even clean the whole stage without loosing information about the scene state. It can be restored using the RenderingRequest module.

Rendering Requests
-------------------------

In Respell, a Rendering Request is like an HTTP Request. The main difference is that the URL will change according to the History API and instead of a page refresh, you will see a new canvas rendering.
As a developer, you can decide if your Request will redraw your stage, or not. Sometimes you just want to work on top of what your are rendering, and sometimes, you want to have a clean canvas to work out.
Whathever you decides, every Rendering Request will always save your actual scene in order to be possible to retrieve exactly what was drawed on your canvas before your Request.

Lets see an example using a custom rendering action that do something with request data and after redirect to a new action:

```
define(['controller', 'rendering_request'], function(Controller, Request) {
	return {
		create : function(task_id, task_name) {
			//= methods to save the task on database via json requests
			Controller.redirect('my_modal', {saved_id: 11})
		},
		
		after_save : function(saved_id) {
			Controller.data('my_id', saved_id)
			//= some code to draw our modal
		}
	}
});
```

With this construction, you are redirecting your create action to the after_save page.
In addition, the after_save page set a my_id variable to the RenderingView, containing the newly saved id.
At first look, it seems to be overlayered, but having a controller will help you to separate in a very smart way what is logic and what is output data.

Rendering Views
-------------------------

Following the MVC specification, Controllers must serve as bridges to deliver data to "Views". The end user operating the application will only see the View, thats where all magic happens. This include Text Rendering, Shape Rendering, Animations, Events, and all.

As Canvas Rendering is a bit difficult than normal DOM Rendering, respell provides an architecture to break all isolated View shape rendering into separate files. They are called Rendering Parts

Model -> Controller -> Rendering View -> Rendering Parts

```
\app
	\controllers
		- task_controller.js
	\views
		\task
			\index
				_header.js
				_text_on_top.js
				_main_div.js
				_buttons.js
				_footer.js 
			\create
			\delete
```
		
An exemplo of a single rendering part would be as follow:

```
file: /app/views/task/_header.js

define(function() {
	var Header = function() {
		//= code to render the header
	}
	
	return Header;
})
```


Features Backlog
-------------------------

- Implement the concept of Controller.
	-> Each controller can have several actions inside.
	-> Each action is treated as a rendering action. (like a scene)
- Implement the concept of Route.
	-> A route redirect to a controller.
	-> Initially, we will only have index routes.
- Implement a simple way to switch between actions.
- Create an identifier collection which will store every unique identifier of generated simbols.
- Generic object implementation.
	-> Must have X and Y coordinates
	-> May have Width and Height
	-> Must have an identifier name
	-> 
- Image drawing implementation.
	-> Generated images must have a unique identifier
	-> Can be positioned at X and Y coordinates based on canvas width and height. (pixel based)
	-> Every object will have a unique rendering method which can be defined before creation.
	-> 
- Text drawing implementation.
-