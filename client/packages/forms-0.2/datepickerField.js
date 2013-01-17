/*******************************
 * Class For Datepicker
 * based on https://github.com/eternicode/bootstrap-datepicker
 */
 forms.addGenerator({
 
	generateField: function(result, form, obj, propName) {
		if(form[propName].type == "datepicker" ) {
			result += 
				'<input type="text"' 
					+'class="datepicker"'
					+'value="'+(obj[propName] || "")
					+'" id="'+propName+'" >';	
		}
	}
	
	
});

