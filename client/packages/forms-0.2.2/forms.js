/*******************************
 * Meteor
 * main.js will be loaded last 
 */
Template.form.content = function() {
	return generateForm(this.name, this.object);
};

/* 
 * Validation is imeplemted using
 * http://docs.jquery.com/Plugins/Validation/rules
 *  
 */ 
Template.form.rendered = function() {
	var form = forms.getForm(this.data.name);

	// add validation
	var rules = {};
	for (var propName in form) {
		if(form[propName].validation) {
			rules[propName] = form[propName].validation;
		}
	}
	if(rules.length > 0) {
		$("#"+this.data.name).validate({
			highlight: function(element, errorClass) {
		        $(element.parentNode.parentNode).addClass("error");
		    },
		    unhighlight: function(element, errorClass) {
		        $(element.parentNode.parentNode).removeClass("error");
		    },
		    rules: rules
		});
	}
	
	/*
	$('.datepicker').datepicker({
		format: 'yyyy-mm-dd'
	});		
	$('.htmledit').each(function(index) {
		CKEDITOR.replace($(this).attr('id'));
	});
	*/
};

Template.form.events({
	'click .save': function (event, template) {
		var crud = forms.getCrud(template.data.name).create(template);
	}
});


function generateForm(formName, obj) {
	var form = forms.getForm(formName);
	var result = '<form id="'+formName+'" class="form-horizontal" >';
	for (var propName in form) {
		result +=
		  	'<div class="control-group">'
		  	+'<label class="control-label" for="inputEmail">'+ (form[propName].label || "Label") +'</label>'
		  	+'<div class="controls">';
		if(form[propName].type == String) {
			result +=	
				'<input type="text" id="'+propName+'"'
			  			+' name="'+propName+'"'
			  			+' value="'+(obj[propName] || "")+'"'
		  				//+' class="'+"required"+' '+"digits"+'"'
			  			+' placeholder="'+(form[propName].placeholder || "Input text...")+'">';
		} else if(form[propName].type == "select") {
			result += '<select id="'+propName+'">';
			var options = form[propName].options();
			for(o in options){
				var selected = options[o].value == obj[propName] ? "selected" : "";
				result += '<option value="'+options[o].value+'" '+selected+' >'+options[o].title+'</option>';
			};
			result += '</select>';			
		} else if(form[propName].type == "multiselect" ) {
			result += '<select multiple="multiple" id="'+propName+'">';
			var options = form[propName].options();
			for(o in options) {				
				var selected = inArray(options[o].value, obj[propName]) ? "selected" : "";
				result += '<option value="'+options[o].value+'" '+selected+' >'+options[o].title+'</option>';
			};
			result += '</select>';			
		} else if(form[propName].type == "selectYear" ) {
			result += '<select id="'+propName+'">';
			var options = form[propName].options();
			var year = "";
			if(obj[propName]) {
				year = new Date(obj[propName].split(" ")[0]).getFullYear();
			} else {
				result += '<option value="" selected ></option>';
			}
			for(o in options){
				var selected = options[o].value == year ? "selected" : "";
				result += '<option value="'+options[o].value+'" '+selected+' >'+options[o].title+'</option>';
			};
			result += '</select>';			
		} else if(form[propName].type == "datepicker" ) {
			result += '<input type="text" class="datepicker" value="'+(obj[propName] || "")
				+'" id="'+propName+'" >';
		} else if(form[propName].type == "htmledit" ) {
			result += '<textarea class="htmledit" id="'+propName+'">'
				+(obj[propName] || "")
				+'</textarea>';
		}
		
	  	result += '</div>'
		  +'</div>';
	}	
	result += 
		'<div class="control-group">'
			+'<div class="controls">'
				+'<button type="button" class="save btn">Save</button>'
				+'<button type="button" class="cancel btn">Cancel</button>'
			+'</div>'
		+'</div>';
	result += '</form>';
	return result;
}

function inArray(obj, array) {
	for(i in array) {
		if(obj == array[i]) {
			return true;
		}
	}
	return false;
}
/*******************************
 * Helpers 
 */
Handlebars.registerHelper('formParams',function(formName, obj){
    var obj = Session.get(obj) || {};
	return {name:formName,object: obj};
});


