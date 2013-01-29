Meteor.publish("projects", function(begin, end, pageSize, currentPage, sort) {
	return Projects.find({
		$or: [
			{"public": true},
            {owner: this.userId}
        ]});
});


Meteor.publish("issues", function(begin, end, pageSize, currentPage, sort) {
	return Tickets.find({
		$or: [
			{"public": true},
            {owner_id: this.userId}
        ]});
});