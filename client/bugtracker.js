// Collections
//
// {name}
Projects = new Meteor.Collection('Projects');
// {project_id, owner_id, title, body, comments: [{author_id, text, timestamp}]}
Tickets = new Meteor.Collection('Tickets');
// {login, name}
People = new Meteor.Collection('People');

// Chosen filters in sidebar
Session.set('project_id', null);
Session.set('owner_id', null);

// Currently viewed ticket
Session.set('ticket_id', null);

Template.main.page_name_content = function () {
	var action = Session.get("page_name");
	console.log("Page name:"+action);
	if(action && Template[action]) {
		return Template[action]();
	} else {
		// sets default page
		return Template['list_page']();
	} 
};

Template.main.viewing_ticket = function () {
    return ! Session.equals('ticket_id', null);
};


// Utils 
// TODO - separate file
var name_getter = function (collection, field) {
    return function () {
        if (this[field]) {
            var obj = collection.findOne({_id: this[field]});
            return obj ? obj.name : '';
        }
        return '';
    };
};




