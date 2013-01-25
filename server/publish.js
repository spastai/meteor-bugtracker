Meteor.publish("projects", function(begin, end, pageSize, currentPage, sort) {
  return Projects.find({});
});