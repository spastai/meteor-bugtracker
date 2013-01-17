function logdir(text,obj) {
	console.log(text, JSON.stringify(obj));
}

function find(array, elem, compare) {
	for(i in array) {
		if(compare(array[i],elem)) {
			return parseInt(i);
		}
	}
	return -1;
}

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