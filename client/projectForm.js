/**
 * New node file
 */
var projectForm = {
		name: {type: String, label: "Project title", placeholder: "Project title..."},
		public: {type: "checkbox", label: "Public", placeholder: "Enter..."},
		versions: {type: "listedit", label: "Version", placeholder: "Enter..."},
};

forms.model("projectForm", projectForm, {
	create: function(template) {
		var values = forms.getValues("projectForm",template);
		logdir("Project values:",values);
		// TODO move to server
		values.owner = Meteor.userId();
	
		var id = Session.get("projectObj")._id; 	
		if(id) {
			Projects.update({_id:id}, values);
		} else {
			Projects.insert(values);
		}
	
	},
	remove: function(id) {
		Projects.remove({_id:id});
	},
	
});
 