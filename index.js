function getAllNames(data){
	return data.reduce(function(accumulator, currentDatum){
		accumulator[currentDatum.name] = null;
		return accumulator;
	},{});
}