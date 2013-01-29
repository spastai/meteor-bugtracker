Template.navbar.nav_links = [
    {page_name: 'ProjectList', title: 'Projects'},
    {page_name: 'TicketListPage', title: 'Issues'},
];
Template.navbar.events = {
    'click .logout': function (event, template) {
    	Meteor.logout();
    } 	
};

Template.nav_link.is_active = function () {
    return Session.equals('page_name', this.page_name) ? 'active' : '';
}
Template.nav_link.events = {
    'click': function () { 
        Session.set('page_name', this.page_name);
        Session.set('ticket_id', null);
    }
}

Template.LoginForm.events = {
    'click .login': function (event, template) { 
    	console.log("Do login");
		var user = template.find('#username').value;
		var password = template.find('#password').value;
		
		Meteor.loginWithPassword(user, password, function(error) {
			if(error) {
				console.log('Log in '+user+'  error: '+error.reason);
			} else {
				console.log("Logged in");
			}
		});	
    },
    
}