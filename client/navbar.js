Template.navbar.nav_links = [
    {page_name: 'Today', title: 'Today'},
    {page_name: 'list_page', title: 'Issues'},
    {page_name: 'new_project', title: 'Projects'},
    ];

Template.nav_link.is_active = function () {
    return Session.equals('page_name', this.page_name) ? 'active' : '';
}
Template.nav_link.events = {
    'click': function () { 
        Session.set('page_name', this.page_name);
        Session.set('ticket_id', null);
    }
}

