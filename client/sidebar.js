// Filtering
Template.sidebar.sidebar_filters = [
    {session_field: 'project_id', title: 'Project', collection: Projects, filterProperties: ["version"]},
    {session_field: 'owner_id', title: 'Owner', collection: People}
];

Template.sidebar_filter.items = function () {
    var session_field = this.session_field;
    return this.collection.find({},{sort:{order:1}}).map(function(item) { 
    	return {item: item, session_field: session_field};
	});
};
Template.sidebar_filter.all_chosen_class = function () {
    return Session.equals(this.session_field, null) ? 'active' : '';
};

Template.sidebar_item.chosen_class = function () {
    return Session.equals(this.session_field, this.item._id) ? 'active' : '';
};
Template.sidebar_item.events = {
    'click': function (evt) {
        Session.set(this.session_field, this.item._id);
        Session.set('ticket_id', null);
    }
};

Template.sidebar_filter.filterPropertyValues = function(options) {
	var result = {};
	var query = {};
	//v("Session field from parent:"+options.session_field);
	var filterPropertyValue = Session.get(options.session_field);
	if(filterPropertyValue) {
		// _id should be configurable
		query["_id"] = filterPropertyValue;  
		// versions is a property of projects but version is a property of ticket 
		result = options.collection.findOne(query,{}).versions;
		//d("Versions found",result);
	}
	return result;
}
Template.sidebar_filter.events = {
    'click .choose_all': function () {
        Session.set(this.session_field, null);
        Session.set('ticket_id', null);
    }, 
    'click #filter-by-property': function (event, template) {
    	var selected = $(event.currentTarget).val();
    	//v("Filter by property:"+this+"="+selected);
    	var filter = Session.get("propertyFilter") || {};
    	if(selected == "") {
	    	delete filter[this];
	    } else {
	    	filter[this] = selected;
	    } 
    	Session.set("propertyFilter", filter);
    }
};
