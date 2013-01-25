Template.TicketListPage.title = function () {
    var project_id = Session.get('project_id'), owner_id = Session.get('owner_id');
    var title;
    if (project_id) {
        title = Projects.findOne({_id: project_id}).name;
        if (owner_id) {
            title += ', owned by ' + People.findOne({_id: owner_id}).name;
        }
    } else {
        if (owner_id) {
            title = 'Owned by ' + People.findOne({_id: owner_id}).name;
        } else {
            title = 'All';
        }
    }
    return title;
};
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
    return Tickets.find(query);
};
Template.TicketListPage.events({
	'click .new-issue': function (event, template) {
        Session.set('issueObj', {});
        Session.set('page_name', 'NewIssue');
	}
});

Template.ticket_in_list.viewing_all_projects = Template.TicketListPage.viewing_all_projects;
//Template.ticket_in_list.project = name_getter(Projects, 'project_id');
Template.ticket_in_list.project = function () {
	var obj = Projects.findOne({_id: this['project_id']});
	return obj ? obj.name : '';
};
Template.ticket_in_list.owner = function () {
	if(this.owner_id) {
		var user = Meteor.users.findOne(this.owner_id);
		return user ? user.emails[0].address: "";
	} else { 
		return "";
	}
};
Template.ticket_in_list.events = {
    'click .edit': function () {
    	//console.log("Edit issue");
        Session.set('issueObj', this);
        Session.set('page_name', 'NewIssue');
     },
    'click .delete': function () {
    	forms.getCrud("issueForm").remove(this._id);
     },
    'click .complete': function (event, template) {
    	//console.log("Crud:"+forms.getCrud("issueForm"));
    	forms.getCrud("issueForm").markComplete(this._id, template.find(".complete").checked);
     }
};
 
// not clear what it is
// name_getter(People, 'owner_id');


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
		start(template);
	},
});

var period = 25 * 60 * 1000;
var timeLeft = period;
var endTime = null;
var timer = null; 

function start(template) {
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
	} 
}

function pause() {
    clearInterval(timer);
    timer = null;		
}
