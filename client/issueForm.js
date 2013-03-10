/**
 * New node file
 */
var issueForm = {
		title: {type: String, label: "Issue title", placeholder: "Issue title..."},
		project_id: {type: "select", label: "Issue title", options: projects},
		description: {type: "textarea", label: "Description", placeholder: "As a ... I want ... in order ..."},
		estimated: {type: String, label: "Estimated time", placeholder: "Enter..."},
		acceptance: {type: "textarea", label: "Done criteria", placeholder: "List the actions you will perform to check task is completed"},
		importance: {type: "select", label: "Importance", options: importancies},
		version: {type: "select", label: "Fix Version", options: versions},
		type: {type: "select", label: "Type", options: types},
		spent: {type: String, label: "Spent time", placeholder: "Enter..."},
		priority: {type: "select", label: "Urgency", options: priorities},
};

forms.model("issueForm", issueForm, {
	create: function(template) {
		var values = forms.getValues("issueForm",template);
		// this indicates it is new object
		values.owner_id = Meteor.userId();
		// do spent conversation
		values.spent = Number(values.spent);

		//v("If this is subtask, take parent issue from session");
		var parentIssue = Session.get("parentIssue");		
		if(parentIssue) {
			values.parentIssue = parentIssue._id; 
		} 
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

function versions() {
	if(Session.get("issueObj").project_id) {
//		console.log("Show versions of project:"+Session.get("issueObj").project_id);
//		console.dir(Projects.findOne(Session.get("issueObj").project_id));
		var versions = Projects.findOne(Session.get("issueObj").project_id).versions
		var result = [{value: "", title: ""}];
		for(i in versions) {
			result.push({value: versions[i], title: versions[i]});  
		}
		return result;
	} else {
		return [];
	}
}

function types() {
	return [
	  {value:"task", title:"Task"},
	  {value:"story", title:"Story"},
	  {value:"bug", title:"Bug"},
	];
} 

function importancies() {
	return [
	  {value:"3", title:"High"},
	  {value:"2", title:"Normal"},
	  {value:"1", title:"Low"},
	];
} 

function priorities() {
	return [
	  {value:"5", title:"Blocker"},
	  {value:"4", title:"Critical"},
	  {value:"3", title:"Major"},
	  {value:"2", title:"Minor"},
	  {value:"1", title:"Trivial"},
	];
} 
