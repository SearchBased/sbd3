function invertMatrix(matrix) {
	invertedMatrix = {};
	
	_.each(matrix,function(value1, key1) {
		_.each(value1, function(value2, key2) {
			if(!invertedMatrix[key2]) {
				invertedMatrix[key2] = {};
			}

			invertedMatrix[key2][key1] = value2;
		});
	});

	return invertedMatrix;
}

function toArray(data){
	var theArray = [];
	_.each(data, function(value, key){
		var chartValues = [];
		_.each(value, function(value2, key2){
			var chartValue = [];
			chartValue.push(key2);
			chartValue.push(value2);
			chartValues.push(chartValue);
			console.log(key2);
		});
	theArray.push(chartValues);
	});
	return theArray;
}