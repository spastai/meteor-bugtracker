/**
* Origin: Copied from AndroidEdikMeteor 
* Date 2013.03.24
* Version 0.0.2
*/ 
var CustomRouter = Backbone.Router.extend({
	routes: {
    	"test/:id": "test", 
    	"register/:id": "register",
    	"": "start" 
  	},
  	start: function() {
  	},
  	register: function(id) {
		var inivation = Invitations.findOne({_id: id});
		if(inivation) {
			Session.set("registrationObj", {
				email: inivation.email
			});
		}
		Session.set("pageView","Registration");
  	},
  	test: function(id) {
  		v("Test:"+id);
		Session.set("pageView","Tests");
		Session.set("testCase",id);
  	},
});

Router = new CustomRouter;
//v("Router created");

Meteor.startup(function() {
	Backbone.history.start({pushState: true});
	Meteor.autorun(function() {
	});
	//v("Backbone started");
});

Handlebars.registerHelper('pageContent', function(){
	var action = Session.get("pageView") || "TicketListPage";
	//v("Page name:"+action);
	return Template[action]();
});
