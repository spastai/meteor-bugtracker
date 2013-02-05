// deprecated: use consoledir as it is easier to change
function logdir(text,obj) {
	console.log(text, JSON.stringify(obj));
}
function consoledir(text,obj) {
	console.log(text, JSON.stringify(obj));
}
function consolelog(text) {
    var t = new Date();
	console.log(t.toISOString()+' INFO '+text);
}
function consoleloge(text) {
    var t = new Date();
	console.log(t.toISOString()+' ERROR '+text);
}
function consolelogd(text) {
    var t = new Date();
	console.log(t.toISOString()+' DEBUG '+text);
}



function find(array, elem, compare) {
	for(i in array) {
		if(compare(array[i],elem)) {
			return parseInt(i);
		}
	}
	return -1;
}

// should be deprecated
var name_getter = function (collection, field) {
    return function () {
        if (this[field]) {
            var obj = collection.findOne({_id: this[field]});
            return obj ? obj.name : '';
        }
        return '';
    };
};

//http://stackoverflow.com/questions/872310/javascript-swap-array-elements
function swap(array, x, y) {
	/*
	console.log("Swapping:"+(x+1-1)+" "+(y+1-1));
	var temp = array[x];
	array[x] = array[y];
	array[y] = temp;
	*/
	array[x] = array.splice(y, 1, array[x])[0];
}