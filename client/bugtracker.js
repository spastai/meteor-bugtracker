// Collections
//
// {name}
Meteor.subscribe("projects");
// {project_id, owner_id, title, body, comments: [{author_id, text, timestamp}]}
// Tickets = new Meteor.Collection('Tickets');

// {login, name}
//People = new Meteor.Collection('People');

// Chosen filters in sidebar
Session.set('project_id', null);
Session.set('owner_id', null);

// Currently viewed ticket
Session.set('ticket_id', null);

// Main view renderer
Template.main.page_name_content = function () {
	if(Meteor.user())  {
		var action = Session.get("page_name");
		// console.log("Page name:"+action);
		if(action && Template[action]) {
			return Template[action]();
		} else {
			// sets default page
			return Template['SchedulePage']();
		}
	} else {
		return Template['Login']();
	} 
};
Template.main.viewing_ticket = function () {
    return ! Session.equals('ticket_id', null);
};


// New project 
Template.new_project.events({
	'click .save': function (event, template) {
        Session.set('page_name', 'list_page');
		
	}
});	

// Helpers
Handlebars.registerHelper('checked',function(input){
	//console.log("Checked:"+input);
	return input? "checked":"";
});

Handlebars.registerHelper('sessionField',function(input, field){
    return Session.get(input)[field];
});


