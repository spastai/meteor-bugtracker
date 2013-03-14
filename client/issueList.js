Template.TicketListPage.viewing_all_projects = function () {
    return Session.equals('project_id', null);
};
// This could be moved to Helper
Template.TicketListPage.sortTitle = function(title,id) {
	var sortIcon = "";
	if(id == Session.get("sortBy")) {
		if(1 == Session.get("sortOrder")) {
			sortIcon = '<i class="icon-arrow-up">';
		} else if(-1 == Session.get("sortOrder")) {
			sortIcon = '<i class="icon-arrow-down">';
		} 
	}
	return '<a href="#" class="sort" id="sort-'+id+'">'+title+sortIcon+'</i></a>';
};
Template.TicketListPage.tickets = function () {
	// select all parent issues
    var query = {
    	parentIssue: { $exists: false }
    };
    var add_filter = function (field) {
        var value = Session.get(field);
        if (value) {
            query[field] = value;
        }
    };
    add_filter('project_id');
    add_filter('owner_id');
    
    if(Session.get("filterHideCompleted")) {
    	query["$or"] = [
    		{complete: {$exists: false}},
    		{complete: false}]; 
    }
//    consoledir("Filtering tickets:",query);
	var sort = {};
	sort[(Session.get("sortBy") || "propertyName")] = Session.get("sortOrder") || 0;     
    sort.priority = -1;
    return Tickets.find(query, {sort: sort});
};
Template.TicketListPage.viewing_all_projects = Template.TicketListPage.viewing_all_projects;
//Template.ticket_in_list.project = name_getter(Projects, 'project_id');
Template.TicketListPage.project = function () {
	var obj = Projects.findOne({_id: this['project_id']});
	return obj ? obj.name : '';
};
var priorityMapping = {
	  5:"label-important",
	  4:"label-warning",
	  3:"label-success",
	  2:"label-info",
	  1:""
};
Template.TicketListPage.priorityLabel = function () {
	return priorityMapping[this.priority];
}
Template.TicketListPage.hasChildren = function() {
	// This returns unndefined if no child found
	return sumIfFound(Tickets, {parentIssue: this._id}, "spent");
}

Template.TicketListPage.completedPomodoro = function() {
	var estimated = sumIfFound(Tickets, {parentIssue: this._id}, "estimated");
	estimated = estimated != undefined ? estimated : this.estimated;
	var spent = sumIfFound(Tickets, {parentIssue: this._id}, "spent");
	spent = spent != undefined  ? spent : this.spent;
	
	var e = (estimated) / pomodoroLength;
	var s = spent / pomodoroLength;
	return  s < e ? s : e;
}
Template.TicketListPage.plannedPomodoro = function() {
	var estimated = sumIfFound(Tickets, {parentIssue: this._id}, "estimated");
	estimated = estimated != undefined ? estimated : this.estimated;
	var spent = sumIfFound(Tickets, {parentIssue: this._id}, "spent");
	spent = spent != undefined  ? spent : this.spent;

	var e = estimated / pomodoroLength;
	var s = spent / pomodoroLength;
	return s < e ? e-s : 0;
}
Template.TicketListPage.overduePomodoro = function() {
	var estimated = sumIfFound(Tickets, {parentIssue: this._id}, "estimated");
	estimated = estimated != undefined ? estimated : this.estimated;
	var spent = sumIfFound(Tickets, {parentIssue: this._id}, "spent");
	spent = spent != undefined ? spent : this.spent;

	//sum(Tickets, {parentIssue:this._id}, 
	var e = estimated / pomodoroLength;
	var s = spent / pomodoroLength;
	return s > e ? s-e : 0;
}
function sumIfFound(collection,query ,field) {
	var sum = 0;
	var found = false;
	collection.find(query).forEach(function(item) {
		sum += item[field];
		found = true;
	});
	if(found) {
		//d("Query sum:"+sum,query);
		return sum;
	} else {
		//d("Query has no children:",query);
		return undefined;
	}
}
Template.TicketListPage.owner = function () {
	if(this.owner_id) {
		var user = Meteor.users.findOne(this.owner_id);
		return user ? user.emails[0].address: "";
	} else { 
		return "";
	}
};

Template.TicketListPage.subtask = function() {
	//v("Returning subtasks for issue:"+this._id);
	return Tickets.find({parentIssue:this._id});
}

Template.TicketListPage.rendered = function() {
}

Template.TicketListPage.events({
	'click .new-issue': function (event, template) {
        Session.set('issueObj', {
        	project_id: Session.get("project_id") || "",
        	priority: 3,
        	importance: 2,
        	estimated: 60,
        	spent: 0
        });
        Session.set('page_name', 'NewIssue');
	}, 
	'click .edit-issue': function () {
    	//console.log("Edit issue");
        Session.set('issueObj', this);
        Session.set('page_name', 'NewIssue');
     },
    'click .delete': function () {
    	forms.getCrud("issueForm").remove(this._id);
     },
     
	'click .add-subtask': function () {
    	//v("Edit subtask");
		//v("Copy spent and estimated from parent issue to first new subtask");
		var issueObj = {
			estimated: 20,
			spent: 0        	
		};
		if(!sumIfFound(Tickets, {parentIssue: this._id}, "spent")) {
			issueObj = {
				estimated: this.estimated,
				spent: this.spent        	
        	}
		} 
		
        Session.set('issueObj', issueObj);
        Session.set('parentIssue', this);
        Session.set('page_name', 'NewIssue');
     },
	'click .edit-subtask': function (event, template) {
    	//d("Edit subtask",this);
        Session.set('issueObj', this);
        Session.set('parentIssue',{_id: this.parentIssue});
        Session.set('page_name', 'NewIssue');
     },
     
    'click .complete': function (event, template) {
    	//console.log("Crud:"+forms.getCrud("issueForm"));
    	forms.getCrud("issueForm").markComplete(this._id, event.target.checked);
     }
    , 'click .hide-done': function (event, template) {
    	//console.log("Template:",$(event.target).hasClass('active'));
    	Session.set("filterHideCompleted",!$(event.target).hasClass('active'));
    	//consoledir("Event:",event);
    }
	, 'click .sort': function (event, template) {
		Session.set("sortBy", $(event.currentTarget).attr("id").substring("sort-".length));
		Session.set("sortOrder", Session.get("sortOrder") == -1 ? 1 : -1);
	}     
});

// Is required as editing subtask has only parentIssue id 
Template.NewIssue.parentIssue = function() {
	//v("Parent issue id:"+Session.get('parentIssue')._id);
	return Tickets.findOne({_id:Session.get('parentIssue')._id});
}
Template.NewIssue.events({
	'click .save': function (event, template) {
        Session.set('page_name', 'TicketListPage');
        Session.set('parentIssue',undefined);
	},
	'click .cancel': function (event, template) {
        Session.set('page_name', 'TicketListPage');
        Session.set('parentIssue',undefined);
	}
});

Template.PomodoroTimer.events({
	'click .start': function (event, template) {
		Session.set("pomodoro_taks",this._id);
		start(template);
	},
});

var period = 20 * 60 * 1000;
//var period = 5 * 1000;
var timeLeft = period;
var endTime = null;
var timer = null; 

function start(template) {
//	Session.set("playSound", false);
	if(null == timer) {
		endTime = new Date().getTime()+timeLeft;
		checkTime(template);
	} else {
		pause();
	}
}

function checkTime(template) {
	timeLeft = endTime - new Date().getTime();
	if(timeLeft > 0) {
		$(template.find(".bar")).width((100-timeLeft/period*100)+'%');
		timer = setTimeout(function(){ checkTime(template) },1000);
	} else {
		$(template.find(".bar")).width('100%');
		completed();
	}
}

function pause() {
    clearInterval(timer);
    timer = null;		
}

function completed() {
	timeLeft = period;
    clearInterval(timer);
    timer = null;		
    
    var id = Session.get("pomodoro_taks");
    Tickets.update({_id:id}, {$inc: {spent: 20}}, function(err) {
    	err ? consoleloge("Updating task "+id+" failed: "+err) : consolelog("Updating task "+id+" for 20m"); 
    });
    // Trick to play sound only once
    console.log("Starting play sound:"+new Date());
	Session.set("playSound", new Date());
	setTimeout(function(){Session.set("playSound", false);console.log("Stop play sound:"+new Date());},3000);
}
