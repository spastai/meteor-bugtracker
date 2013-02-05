Template.TicketListPage.viewing_all_projects = function () {
    return Session.equals('project_id', null);
};
Template.TicketListPage.tickets = function () {
    var query = {};
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
    
    return Tickets.find(query);
};
Template.TicketListPage.viewing_all_projects = Template.TicketListPage.viewing_all_projects;
//Template.ticket_in_list.project = name_getter(Projects, 'project_id');
Template.TicketListPage.project = function () {
	var obj = Projects.findOne({_id: this['project_id']});
	return obj ? obj.name : '';
};
Template.TicketListPage.owner = function () {
	if(this.owner_id) {
		var user = Meteor.users.findOne(this.owner_id);
		return user ? user.emails[0].address: "";
	} else { 
		return "";
	}
};

Template.TicketListPage.events({
	'click .new-issue': function (event, template) {
        Session.set('issueObj', {project_id: Session.get("project_id") || ""});
        Session.set('page_name', 'NewIssue');
	}
    , 'click .edit-issue': function () {
    	//console.log("Edit issue");
        Session.set('issueObj', this);
        Session.set('page_name', 'NewIssue');
     },
    'click .delete': function () {
    	forms.getCrud("issueForm").remove(this._id);
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
     
});

Template.NewIssue.events({
	'click .save': function (event, template) {
        Session.set('page_name', 'TicketListPage');
	},
	'click .cancel': function (event, template) {
        Session.set('page_name', 'TicketListPage');
	}
});

Template.PomodoroTimer.events({
	'click .start': function (event, template) {
		Session.set("pomodoro_taks",this._id);
		start(template);
	},
});

//var period = 20 * 60 * 1000;
var period = 5 * 1000;
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
//	Session.set("playSound", true);
}