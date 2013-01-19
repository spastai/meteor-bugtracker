/**
 * New node file
 */
var issueForm = {
		title: {type: String, label: "Issue title", placeholder: "Issue title..."},
		project_id: {type: "select", label: "Issue title", options: projects},
		estimated: {type: String, label: "Estimated time", placeholder: "Enter..."},
		spent: {type: String, label: "Spent time", placeholder: "Enter..."},
};

forms.model("issueForm", issueForm, {
	create: function(template) {
		var values = forms.getValues("issueForm",template);
		// this indicates it is new object
		values["_id"] = Session.get("issueObj")._id;
		values.owner_id = Meteor.userId();
		logdir("Issue values:",values);
		if(values._id) {
			Tickets.update({_id:values._id}, values);
		} else {
			Tickets.insert(values);
		}
		
	},
	remove: function(id) {
		Tickets.remove({_id:id});
	},
	markComplete: function(id,status) {
		Tickets.update({_id:id},{$set:{complete:status}});
	}
});
 
function projects() {
	return Projects.find().map(function (item) { 
    	return {value: item._id, title: item.name};
	});
}
 
