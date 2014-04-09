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

	this.gridLines = [];


	var colors = d3.scale.category20();

	var marginChart = 20;
	var maxValue;

	//private functions
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
				return (self.height) - self.yScale(d.y); 
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
	function roundUp(x){

		var y = Math.pow(10, Math.ceil(x).toString().length-1);

		x = (x/y);
		x = Math.ceil(x);
		x = x*y;
		return x;
	}



	//public functions
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
					.rangeRoundBands([0, this.width - marginChart*2], 0.05);

		this.xScaleGrouped = d3.scale.ordinal()
					.domain(d3.range(this.dataSet.length * this.dataSet[0].length))
					.rangeRoundBands([0, this.width - marginChart*2], 0.05);


		maxValue = d3.max(this.dataSet, function(d){
					return d3.max(d, function(d){
						return d.y0 + d.y;
					});
		});


		var lines = 5;
		var completeRound = (roundUp(maxValue/lines) * lines);

		this.yScale = d3.scale.linear()
							.domain([0, completeRound])
							.range([0, this.height-(marginChart * 2)]);	
		

		console.log("Maximum value of all stacked bars");
		console.log(maxValue);

		console.log((roundUp(maxValue/lines) * lines) / lines);

		

		for (var i = 0; i <= completeRound; i += completeRound / lines) {
			var gridLine = {};
			gridLine.y = this.yScale((roundUp(maxValue/lines) * lines) - i);
			gridLine.value = i;
			this.gridLines.push(gridLine);
		}


		console.log("Rounded value of all stacked bars");
		console.log((roundUp(maxValue/lines) * lines) );


		// var lines = 10;
		// for (var i = 1; i < lines; i++) {
		// 	var gridLine = {};
		// 	gridLine.y = ((this.height) / lines) * i;

		// 	gridLine.value = Math.round((roundUp(maxValue)/lines)*(lines - i));
		// 	this.gridLines.push(gridLine);
		// }
	};


	this.draw = function(isStacked){
			var self = this;

			if(self.firstTime){
				svg.append("rect")
					.attr("class", "container")
					.attr("height", (this.height - marginChart*2) + 2)
					.attr("width",	(this.width-marginChart * 2))
					.attr("x", marginChart)
					.attr("y", marginChart -1 );
			}

			svg.selectAll(".gridLine")
				.data(function() {

					return self.gridLines.slice(1, self.gridLines.length - 1);
				})
				.enter()
					.append("line")
					.attr("class", "gridLine")
					.attr("x1", marginChart)
					.attr("x2", self.width - marginChart)
					.attr("y1", function(d) {
						return d.y + marginChart;
					})
					.attr("y2", function(d) {
						return d.y + marginChart;
					});

			svg.selectAll(".gridText")
				.data(this.gridLines)
				.enter()
					.append("text")
						.attr("class", "gridText")
						.attr("x", 0)
						.attr("y", function(d) {
							return d.y + marginChart + 4;
						})
						.text(function(d) {
							return d.value;
						});

			
			// console.log(maxValue/6);

			//Here are the groups per dataset;
			var groups = svg.selectAll("g")
							.data(this.dataSet)
							.enter()
								.append("g")
									.style("fill", function(d, i) {
									return colors(i);
							});
				

		

			var rects = groups.selectAll(".bar")
					.data(function(d) { console.log(d); return d; })
					.enter()
						.append("rect")
						.attr("class", "bar")
						.attr("height", 0)
						.attr("y", height)
						.transition()
						.duration(1000);

		


			
			attribute.setX(self, rects);
			attribute.setHeight(self,rects);
			
	
		svg.selectAll(".bar").
			attr("transform", function(d, i) {
				return "translate("+marginChart+", "+ -marginChart +")";});


		

		
		if(self.firstTime){

	

			attribute.setTransform(self, groups, isStacked);
			attribute.setY(self, rects, isStacked);
			attribute.setWidth(self, rects, isStacked);
			
			self.firstTime = false;


			
		
		} else {
			var duration = 500;

			var rectsAnim = svg.selectAll(".bar").transition().duration(duration).delay(function(d, i) { return 0});
			attribute.setWidth(self, rectsAnim, isStacked);
			 
			var groupsAnim = svg.selectAll("g").transition().duration(duration).delay(function(d, i) { return i * 40});		
			attribute.setTransform(self, groupsAnim, isStacked);
			
			rectsAnim = svg.selectAll(".bar").transition().duration(duration).delay(function(d, i) { return duration + (i * 10)});
			attribute.setY(self, rectsAnim, isStacked);
			
			
		}

	};

}
		







