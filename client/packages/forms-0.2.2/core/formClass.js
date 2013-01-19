/*******************************
 * Class 
 * placed in subdirectory to be loaded first
 */
function Forms() {
	var models = {};
	var cruds = {};
	var fieldGenerators = []; 

	this.addGenerator = function(generator) {
		fieldGenerators.push(generator);
	}
	
	this.model = function(name, model, crud) {
		models[name] = model;
		if(crud) {
			cruds[name] = crud;
		}
	};
	
	this.getForm = function(name) {
		return models[name];
	};

	this.getCrud = function(name) {
		return cruds[name];
	};

	// deprecated: use getCrud(..).remove();
	this.remove = function(name, id) {
		cruds[name].remove(id);
	};

	this.getValues = function(name,template) {
		var result = {};
		var form = this.getForm(name);
		for (var propName in form) {
			// jquery is required for multi select
			result[propName] = $(template.find("#"+propName)).val();
		}
		return result;
	};
	
};

forms = new Forms();
