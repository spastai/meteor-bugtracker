/**
 * New node file
 */
var issueForm = {
		title: {type: String, label: "Issue title", placeholder: "Issue title..."},
		project: {type: "select", label: "Issue title", options: projects},
};

forms.model("issueForm", issueForm, {
	create: function(template) {
		var values = forms.getValues("issueForm",template);
		values.owner = Meteor.userId();
		logdir("Issue values:",values);
		Tickets.insert(values);
	},
	remove: function(id) {
		Tickets.remove({_id:id});
	}
});
 
function projects() {
	return Projects.find().map(function (item) { 
    	return {value: item._id, title: item.name};
	});
}
 
