var sbd3 = {};


function BarChartMultiple(element, width, height){
	this.width = width;
	this.height = height;
	this.element = element;

	this.xScaleStacked = null;
	this.xScaleGrouped = null;
	this.yScale = null;

	this.dataSet = [];

	this.stacked = null;


	var colors = d3.scale.category20();

	this.init = function(){
		svg = d3.select(element).append('svg')
		.attr('width', this.width)
		.attr('height', this.height);
	};

	this.update = function(theDataSet){
		this.dataSet = theDataSet;
		var stack = d3.layout.stack();
		stack(this.dataSet);

		this.xScaleStacked = d3.scale.ordinal()
					.domain(d3.range(this.dataSet[0].length))
					.rangeRoundBands([0, this.width], 0.05);

		this.xScaleGrouped = d3.scale.ordinal()
					.domain(d3.range(this.dataSet.length * this.dataSet[0].length))
					.rangeRoundBands([0, this.width], 0.05);

		this.yScale = d3.scale.linear()
							.domain([0,				
								d3.max(this.dataSet, function(d) {
									return d3.max(d, function(d) {
										return d.y0 + d.y;
									});
								})
							])
							.range([0, this.height]);

		
	};

	this.draw = function(isStacked){
		var self = this;
			//Here are the groups per dataset;
			var groups = svg.selectAll("g")
							.data(this.dataSet)
							.enter()
								.append("g")
									.style("fill", function(d, i) {
									return colors(i);
							});
			var rects = groups.selectAll("rect")
					.data(function(d) { console.log(d); return d; })
					.enter()
						.append("rect")
						.attr("height", 0)
						.attr("y", height)
						.transition()
						.duration(1000);
			
			rects.attr("x", function(d, i) {
								return self.xScaleStacked(i);
							}).attr("height", function(d) {
								return self.yScale(d.y);
							});
		
		var groupElements;
		var rectElements;
		
		if(this.stacked === null){
			groupElements = groups;
			rectElements = rects;
		} else {
			groupElements = groups.transition().duration(500);
			rectElements = groups.transition().duration(500);
		}
		
		if(isStacked === true){
			theElement.attr("y", function(d) {
					return (self.height - self.yScale(d.y0)) - self.yScale(d.y); // F yeah
			})
			.attr("width", self.xScaleStacked.rangeBand());			
		}

		if(isStacked === false){
			groups.attr("transform", function(d, i) {
				return "translate(" + (i * self.xScaleGrouped.rangeBand()) + ")";
			});

			theElement.attr("y", function(d) {
				return self.height - self.yScale(d.y); // F yeah
			})
			.attr("width", self.xScaleGrouped.rangeBand());
		}

	};

	this.toggle = function(){
		var self = this;

		var groups = svg.selectAll("g");
							// .data(this.dataSet)
							// .enter()
							// 	.append("g")
							// 	.style("fill", function(d, i) {
							// 		return colors(i);
							// });

					groups.selectAll("rect")
						.transition()
						.duration(500)
							.attr("x", function(d, i) {
								return self.xScaleStacked(i);
							})
							.attr("width", self.xScaleGrouped.rangeBand())
							.attr("height", function(d) {
								return self.yScale(d.y);
							})
							.transition()
							.duration(500)
								.attr("y", function(d, i) {
									return self.height - self.yScale(d.y);
								});

					svg.selectAll("g")
						.transition()
						.duration(500)
							.attr("transform", function(d, i) {
								return "translate(" + (i * self.xScaleGrouped.rangeBand()) + ")";
							});
	};
		}
		}







