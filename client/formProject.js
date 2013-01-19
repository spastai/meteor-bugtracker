/**
 * New node file
 */
var projectForm = {
		name: {type: String, label: "Project title", placeholder: "Project title..."},
};

forms.model("projectForm", projectForm, {
	create: function(template) {
		var values = forms.getValues("projectForm",template);
		logdir("Project values:",values);
		// TODO move to server
		values.owner = Meteor.userId();
		Projects.insert(values);
	
	}
});
 