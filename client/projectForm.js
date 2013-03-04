/**
 * New node file
 */
var projectForm = {
		name: {type: String, label: "Project title", placeholder: "Project title..."},
		public: {type: "checkbox", label: "Public", placeholder: "Enter..."},
		versions: {type: "listedit", label: "Version", placeholder: "Enter..."},
		order: {type: String, label: "Order", placeholder: "Enter..."},
};

forms.model("projectForm", projectForm, {
	create: function(template) {
		var values = forms.getValues("projectForm",template);
		logdir("Project values:",values);
		// TODO move to server
		values.owner = Meteor.userId();
		// TODO create field type number
		values.order = Number(values.order);
	
		var id = Session.get("projectObj")._id; 	
		if(id) {
			Projects.update({_id:id}, values);
		} else {
			Projects.insert(values);
		}
	},
	
	up: function(id) {
		var order = Projects.findOne({_id:id}).order || 0;
		if(order > 0) {
			order--;
			Projects.update({order:order}, {$set: {order:order+1}});
			Projects.update({_id:id}, {$set: {order:order}});
		}
	},

	down: function(id) {
		var order = Projects.findOne({_id:id}).order || 0;
		if(order < Projects.find().count()-1) {
			order++;
			Projects.update({order:order}, {$set: {order:order-1}});
			Projects.update({_id:id}, {$set: {order:order}});
		}
	},
	
	remove: function(id) {
		Projects.remove({_id:id});
	},
	
});
  