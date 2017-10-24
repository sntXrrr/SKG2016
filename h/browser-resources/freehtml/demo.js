(function($, global, document) {

	// global.modules is an object the page.js looks at to fire event-callbacks on on page lifecycle
	var modules = global.modules = global.modules || {};

	// break out if your module has already been defined
	if (modules['yournamespace-demo']) {
		return;
	} else {
		// define your module
		modules['yournamespace-demo'] = (function () {

			var handlers = {
				navigate: function (event) {
					// trigger the 'navigate' to transition to an other page
					$(document.body).trigger(new jQuery.Event('navigate', {
						url: '/'
					}));
				}
			};

			/**
			* These lifecycle event are called on **every** page-tansition.
			* It's your responsibility to do or not do something based on your own criteria,
			* This can be DOM structure, current URL, or whatever
			*/
			var methods = {
				mount: function () {
					console.log('freeHTML demo mount');
					// this method is called after all resources are loaded

					// example clickbinding navigating the page with a transition
					$('.yournamespace-demo').on('click', handlers.navigate);
				},
				init: function () {
					console.log('freeHTML demo init');
					// this method is called after resources are loaded and page transition is about to begin
				},
				render: function () {
					console.log('freeHTML demo render');
					// this method is called last, after transition is complete
				},
				unmount: function () {
					console.log('freeHTML demo unmount');
					// this method is called as page-transition is started
					// CLENAUP: restore, remove all HTML your modified, remove evenbindings etc.
					$('.yournamespace-demo').off('click', handlers.navigate);
				}
			};

			/*
			* This is the API your module returns to the page.js
			*/
			return {
				mount: methods.mount,
				init: methods.init,
				render: methods.render,
				unmount: methods.unmount
			};
		}());
	}
}(jQuery, window, document));
