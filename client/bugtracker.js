var pomodoroLength = 20;

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
