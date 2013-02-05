/**
 * New node file
 */
Template.ProjectList.projects = function() {
	return Projects.find();
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
	'click .delete': function (event, template) {
		forms.getCrud("projectForm").remove(this._id);
	}	
});


Template.EditProject.events({
	'click .save': function (event, template) {
        Session.set('page_name', 'ProjectList');
	},
	'click .cancel': function (event, template) {
        Session.set('page_name', 'ProjectList');
	},
	'click .saveVersion': function (event, template) {
		var version = $(template.find('#version')).val();
		console.log("Save version:"+version);
		var project = Session.get('projectObj');
		if(!project.versions) {
			project.versions = [];
		}
		project.versions.push(version);
		Session.set('projectObj', project);
	}
});