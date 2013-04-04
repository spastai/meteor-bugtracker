/**
 * Project list
 */
Template.ProjectList.projects = function() {
	return Projects.find({},{sort:{order:1}});
}

Template.ProjectList.events({
	'click .new-project': function (event, template) {
        Session.set('projectObj', {});
        Session.set('pageView', 'EditProject');
	},
	'click .edit-project': function (event, template) {
        Session.set('projectObj', this);
        Session.set('pageView', 'EditProject');
	},
	'click .up': function (event, template) {
		forms.getCrud("projectForm").up(this._id);
	},
	'click .down': function (event, template) {
		forms.getCrud("projectForm").down(this._id);
	},	
	'click .delete': function (event, template) {
		forms.getCrud("projectForm").remove(this._id);
	}	
});


Template.EditProject.events({
	'click .save': function (event, template) {
		var members = Session.get("newMembers");
		if(members && members.length > 0) {
			for(m in members) {
				Invitations.insert({email: members[m]}); 
				v("Adding new member:"+members[m]);
			}
        	Session.set('pageView', 'InformMembers');
		} else {
        	Session.set('pageView', 'ProjectList');
        }
	},
	'click .cancel': function (event, template) {
        Session.set('pageView', 'ProjectList');
	}
});

Template.InformMembers.members = function() {
	var users = [];
	var members = Session.get("newMembers");	
	for(m in members) {
		var user = Meteor.users.findOne({"emails.address": members[m]});
		if(user) {
			v("User found:"+user);
			users.push({username: members[m]});
		} else {
			v("New user:"+members[m]);
			var invitation = Invitations.findOne({email: members[m]});
			var url = invitation ? Meteor.absoluteUrl("/register/"+invitation._id) : "";
			users.push({email: members[m], url: url});
		}
	}
	return users;
};

Template.InformMembers.events({
	'click .done': function (event, template) {
       	Session.set('pageView', 'ProjectList');
	}
});