/**
 * New node file
 */
var registrationForm = {
		email: {type: String, label: "Username", placeholder: "Email...", validation: {required: true, email: true}},
		password: {type: "password", label: "Password", placeholder: "Enter...", validation: {required: true, minlength: 2}},
};

forms.model("registrationForm", registrationForm, {
	create: function(template) {
		//v("Saving new user");
		var values = forms.getValues("registrationForm",template);
		Accounts.createUser(values, function(error) {
			if(error) {
				consoledir("Registration error:",error);
				Session.set("registrationError", error.reason);
			} else {
				Session.set('pageView', "TicketListPage");				
				Session.set("registrationError", undefined);
			}
		});
	},
});
  