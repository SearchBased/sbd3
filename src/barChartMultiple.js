var sbd3 = {};


function BarChartMultiple(element, width, height){
	this.width = width;
	this.height = height;
	this.element = element;

	this.xScaleStacked = null;
	this.xScaleGrouped = null;
	this.yScale = null;

	this.init = function(element){
		svg = d3.select(element).append('svg')
		.attr('width', this.width)
		.attr('height', this.height);
	};

	this.update = function(dataSet){
		this.dataSet = dataSet;

		this.xScaleStacked = d3.scale.ordinal()
					.domain(d3.range(authorIDs.length))
					.rangeRoundBands([0, this.width], 0.05);

		this.xScaleGrouped = d3.scale.ordinal()
					.domain(d3.range(authorIDs.length * gData.length))
					.rangeRoundBands([0, this.width], 0.05);

		this.yScale = d3.scale.linear()
							.domain([0,				
								d3.max(barArray, function(d) {
									return d3.max(d, function(d) {
										return d.y0 + d.y;
									});
								})
							])
							.range([0, h]);


	};

	this.draw = function(){
		console.log(dataSet);

		
	};
}






