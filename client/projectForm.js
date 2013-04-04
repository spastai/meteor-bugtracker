/**
 * Project form
 */
forms.model("projectForm", {
		name: {type: String, label: "Project title", placeholder: "Project title..."},
		public: {type: "checkbox", label: "Public", placeholder: "Enter..."},
		versions: {type: "listedit", label: "Version", placeholder: "Enter..."},
		members: {type: "listedit", label: "Members", placeholder: "Email..."},
		order: {type: String, label: "Order", placeholder: "Enter..."},
	},  {
	create: function(template) {
		var values = forms.getValues("projectForm",template);
		logdir("Project values:",values);
		// TODO move to server
		values.owner = Meteor.userId();
		// TODO create field type number
		values.order = Number(values.order);
	
		var id = Session.get("projectObj")._id;
		if(id) {
			//v("Calculate delta");
			var project = Projects.findOne({_id:id});		 	
			//d("Existing members",project.members);
			Session.set("newMembers",_.difference(values.members,project.members));
			//d("Inform new members",_.difference(values.members,project.members));  
			Projects.update({_id:id}, values);
		} else {
			Projects.insert(values);
			Session.set("New members:"+values.members);
			d("Inform new members",values.members);  
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
  