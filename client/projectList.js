/**
 * New node file
 */
Template.ProjectList.projects = function() {
	return Projects.find({},{sort:{order:1}});
}

Template.ProjectList.events({
	'click .new-project': function (event, template) {
        Session.set('projectObj', {});
        Session.set('page_name', 'EditProject');
	},
	'click .edit-project': function (event, template) {
        Session.set('projectObj', this);
        Session.set('page_name', 'EditProject');
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
		v("New members:"+members);
		if(members && members.length > 0) {
			for(m in members) {
				Invitations.insert({email: members[m]}); 
			}
        	Session.set('page_name', 'InformMembers');
		} else {
        	Session.set('page_name', 'ProjectList');
        }
	},
	'click .cancel': function (event, template) {
        Session.set('page_name', 'ProjectList');
	}
});

Template.InformMembers.members = function() {
	var users = [];
	var members = Session.get("newMembers");	
	for(m in members) {
		var user = Meteor.users.findOne({"emails.address": members[m]});
		if(user) {
			//v("User found:"+user);
			users.push({username: members[m]});
		} else {
			var invitation = Invitations.findOne({email: members[m]});
			users.push({email: members[m], id: invitation._id});
		}
	}
	return users;
};

Template.InformMembers.events({
	'click .done': function (event, template) {
       	Session.set('page_name', 'ProjectList');
	}
});