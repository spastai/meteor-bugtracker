// Collections
//
// {name}
Meteor.subscribe("projects");
// {project_id, owner_id, title, body, comments: [{author_id, text, timestamp}]}
Meteor.subscribe("issues");

Meteor.subscribe("invitations");
