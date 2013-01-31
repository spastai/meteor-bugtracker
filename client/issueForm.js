/**
 * New node file
 */
var issueForm = {
		title: {type: String, label: "Issue title", placeholder: "Issue title..."},
		project_id: {type: "select", label: "Issue title", options: projects},
		description: {type: "textarea", label: "Description", placeholder: "Describe..."},
		estimated: {type: String, label: "Estimated time", placeholder: "Enter..."},
		type: {type: "select", label: "Type", options: types},
		spent: {type: String, label: "Spent time", placeholder: "Enter..."},
		priority: {type: "select", label: "Priority", options: priorities},
		importance: {type: "select", label: "Importance", options: importancies},
};

forms.model("issueForm", issueForm, {
	create: function(template) {
		var values = forms.getValues("issueForm",template);
		// this indicates it is new object
		values.owner_id = Meteor.userId();
		// logdir("Issue values:",values);
		if(Session.get("issueObj")._id) {
			values["_id"] = Session.get("issueObj")._id;
			Tickets.update({_id:values._id}, values);
		} else {
			Tickets.insert(values);
		}
		
	},
	remove: function(id) {
		Tickets.remove({_id:id});
	},
	markComplete: function(id,status) {
		console.log("Mark completed:"+id+" status:"+status);
		Tickets.update({_id:id},{$set:{complete:status}});
	}
});
 
function projects() {
	return Projects.find().map(function (item) { 
    	return {value: item._id, title: item.name};
	});
}

function types() {
	return [
	  {value:"task", title:"Task"},
	  {value:"story", title:"Story"},
	  {value:"bug", title:"Bug"},
	];
} 


function priorities() {
	return [
	  {value:"blocker", title:"Blocker"},
	  {value:"critical", title:"Critical"},
	  {value:"major", title:"Major"},
	  {value:"minor", title:"Minor"},
	  {value:"trivial", title:"Trivial"},
	];
} 

function importancies() {
	return [
	  {value:"high", title:"High"},
	  {value:"normal", title:"Normal"},
	  {value:"low", title:"Low"},
	];

} 
