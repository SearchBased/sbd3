var sbd3 = {};


function BarChartMultiple(element, width, height){
	this.width = width;
	this.height = height;
	this.element = element;

	this.xScaleStacked = null;
	this.xScaleGrouped = null;
	this.yScale = null;

	this.dataSet = [];

	this.firstTime = true;


	var colors = d3.scale.category20();


	//private function
	attribute = {};
	attribute.setX = function(self, element){
		return element.attr("x", function(d, i) {
								return self.xScaleStacked(i);
							});
	};
	attribute.setY = function(self, element, isStacked){
		return element.attr("y", function(d) {
			if(isStacked){	
				return (self.height - self.yScale(d.y0)) - self.yScale(d.y);
			} else {		
				return self.height - self.yScale(d.y); 
			}
		});
	};
	attribute.setWidth = function(self, element, isStacked){
		if(isStacked){
			return element.attr("width", self.xScaleStacked.rangeBand());
		} else {
			return element.attr("width", self.xScaleGrouped.rangeBand());
		}	
	};
	attribute.setHeight = function(self, element){
		return element.attr("height", function(d) {
								return self.yScale(d.y);
							});
	};
	attribute.setTransform = function(self, element, isStacked){
	return element.attr("transform", function(d, i) {
			if(isStacked){
				return "translate(0, 0)";
			} else {
				return "translate(" + (i * self.xScaleGrouped.rangeBand()) + ", 0)";
			}
		});
	};

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
			
			attribute.setX(self, rects);
			attribute.setHeight(self,rects);
			
		
	
		
		if(self.firstTime){
			attribute.setTransform(self, groups, isStacked);
			attribute.setY(self, rects, isStacked);
			attribute.setWidth(self, rects, isStacked);
			
			self.firstTime = false;
			
		} else {
			var rectsAnim = svg.selectAll("rect").transition().duration(500);
			attribute.setWidth(self, rectsAnim, isStacked);
			 
			var groupsAnim = svg.selectAll("g").transition().duration(500);		
			attribute.setTransform(self, groupsAnim, isStacked);
			
			rectsAnim = svg.selectAll("rect").transition().duration(500).delay(500);
			attribute.setY(self, rectsAnim, isStacked);
			
			
		}

	};

}
		







