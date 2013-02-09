var pomodoroLength = 20;
// Collections
//
// {name}
Meteor.subscribe("projects");
// {project_id, owner_id, title, body, comments: [{author_id, text, timestamp}]}
Meteor.subscribe("issues");

// {login, name}
//People = new Meteor.Collection('People');

// Chosen filters in sidebar
Session.set('project_id', null);
Session.set('owner_id', null);

// Currently viewed ticket
Session.set('ticket_id', null);

Session.set("filterHideCompleted",true);

Meteor.startup(function () {
});

// Main view renderer
Template.main.page_name_content = function () {
	if(Meteor.user())  {
		var action = Session.get("page_name");
		// console.log("Page name:"+action);
		if(action && Template[action]) {
			return Template[action]();
		} else {
			// sets default page
			return Template['TicketListPage']();
		}
	} else {
		return Template['TicketListPage']();
	} 
};
Template.main.viewing_ticket = function () {
    return ! Session.equals('ticket_id', null);
};

// Helpers
Handlebars.registerHelper('checked',function(input){
	//console.log("Checked:"+input);
	return input? "checked":"";
});

Handlebars.registerHelper('session',function(input){
    return Session.get(input);
});

Handlebars.registerHelper('sessionField',function(input, field){
    return Session.get(input)[field];
});

Handlebars.registerHelper('for', function(context, block) {
  var ret = "";

  for(var i=0; i < context; i++) {
    ret = ret + block(context[i]);
  }
  return ret;
});
