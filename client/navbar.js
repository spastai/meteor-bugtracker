Template.navbar.nav_links = [
    {pageView: 'TicketListPage', title: 'Issues'},
    {pageView: 'ProjectList', title: 'Projects'},
];
Template.navbar.events = {
    'click .logout': function (event, template) {
    	Meteor.logout();
    },
 	'click .loginWithGoogle': function(event, template) {
		v("Log in with google");
		Meteor.loginWithGoogle({requestPermissions:["https://www.googleapis.com/auth/userinfo.email"]}, function(error) {
			if(error) {
				d('Log in with google  error: ',error);
			} else {
				v("Logged in");
			}
		});	
	}       
};
Template.navbar.username = function() {
	var user = Meteor.user();
	if(user.profile) {
		return user.profile.name;
	} else if(user.emails) {
		return user.emails[0].address;
	}
};
Template.nav_link.is_active = function () {
    return Session.equals('pageView', this.pageView) ? 'active' : '';
}
Template.nav_link.events = {
    'click': function () { 
        Session.set('pageView', this.pageView);
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
    'click .registration': function (event, template) {
        Session.set('pageView', "Registration");
    	//v("Registration form:"+Session.get('pageView'));
    },
    
}