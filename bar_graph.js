function BarGraph() {
}

/*
	tag: the id of the div in which you want to insert the graphic
	xAxisName: the name of the x axis, may differ from the csv name
	yAxisName: the name of the y axis, must be the same of the csv 
	title: the title of the graphic
	rows: the rows that must be taken from the file and displayed
*/
BarGraph.prototype.setup = function(tag, xAxisName, yAxisName, title, rows, cols) {
	this.myTag = tag;
	this.svg = d3.select(this.myTag).append("svg");
	this.xAxisName = xAxisName;
	this.yAxisName = yAxisName;
	this.title = title;
	this.rows = rows;
	this.cols = cols;
	this.color = d3.scale.category10();
	this.stacked = false;

	// Data cache
	this.data = null;

	// Space between bars, value [0,1]
	this.interSpace = 0.6;

	this.margin = {top: 30, right: 30, bottom: 30, left: 80};

	this.divWidth = d3.select(this.myTag).style("width").replace("px", "");
	this.divHeight = d3.select(this.myTag).style("height").replace("px", "");

	this.canvasHeight = 400;	// Change that value in order to zoom in or zoom out
	this.canvasWidth = this.canvasHeight / this.divHeight * this.divWidth;
	

	this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);

	this.chart = this.svg
		//.attr("width", this.divWidth)
    	//.attr("height", this.divHeight)
  		.append("g")
    	.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Append the title
    this.svg.append("text")
			.attr("class","title")
			.style("text-anchor", "middle")
			.attr("x",(this.canvasWidth)/2)
			.attr("y",this.margin.top/2)
			.text(this.title);

	// Append the empty selection alert
    this.svg.append("text")
			.attr("class","warning")
			.style("text-anchor", "middle")
			.attr("x", this.canvasWidth/2 )
			.attr("y", this.canvasHeight/2 )
			.text("NO AREA SELECTED");

}

BarGraph.prototype.setRows = function(rows) {
	this.rows = rows;
}

BarGraph.prototype.dataFile = function(file) {
	this.file = file;
}

BarGraph.prototype.updateWindow = function() {

	this.divWidth = d3.select(this.myTag).style("width").replace("px", "");
	this.divHeight = d3.select(this.myTag).style("height").replace("px", "");

	this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);

	// Calculate the dimension of the bars
	switch(this.rows.length) {
		case 1: this.interSpace = 0.8; break;
		case 2: this.interSpace = 0.7; break;
		case 3: this.interSpace = 0.6; break;
		case 4: this.interSpace = 0.5; break;
		default: this.interSpace = 0.4;
	}

	/* Call the function that will update graphics */
    if(this.cols.length == 1) {	// Sinple bar chart 
    	if(this.data == null)
			d3.csv(this.file, type, this.dataCallbackSingle.bind(this));
		else
			this.dataCallbackSingle(false, this.data)
	}
	else if(this.cols.length > 1) {	// Sinple bar chart
		if(this.stacked == true) {
			if(this.data == null)
				d3.csv(this.file, type, this.dataCallbackStacked.bind(this));
			else
				this.dataCallbackStacked(false, this.data);
		}
		else {
			if(this.data == null)
				d3.csv(this.file, type, this.dataCallbackGrouped.bind(this));
			else
				this.dataCallbackGrouped(false, this.data);

		}
	}

	function type(d) {
			d.value = +d.value; // coerce to number
			return d;
	}

	// Update the title of the graphic
	this.svg.selectAll(".title")
			.text(this.title)
			.attr("x",(this.canvasWidth)/2)
			.attr("y",this.margin.top/2);		

}

/*
	This function creates or update a simple bar chart
*/
BarGraph.prototype.dataCallbackSingle = function(error, data) {
	if(error) {
			alert("Can't load the file");
			return;
	}

	this.data = data;

	// Elaborate the data, extract data from a single row (multiple columns)
	var d = [];
	for(var row in this.rows) {
		d.push(data[this.rows[row]]);
	}

	// Display please select an area 
	if(d.length == 0) {
		this.chart.attr("opacity","0");
		this.svg.selectAll(".legend").attr("opacity","0");
		this.svg.selectAll("text").attr("opacity","0");
		this.svg.selectAll("text.warning").attr("opacity","1");
		return;
	}
	else {
		this.chart.attr("opacity","1");
		this.svg.selectAll(".legend").attr("opacity","1");
		this.svg.selectAll("text").attr("opacity","1");
		this.svg.selectAll("text.warning").attr("opacity","0");
	}

	var margin = this.margin,
		height = this.canvasHeight - this.margin.bottom - this.margin.top,
		width = this.canvasWidth - this.margin.left - this.margin.right;

	var xAxisName = this.xAxisName;
	var yAxisName = this.yAxisName;

	var cols = this.cols;
	var color = this.color;

	var chart = this.chart;
	var scaleX = d3.scale.ordinal()
			   	.rangeRoundBands([0, width], this.interSpace)
			   	.domain(d.map(function(d) { return d[xAxisName]; }));

	var scaleY = d3.scale.linear()
			   	.range([0, height])
			   	.domain([d3.max(d, function(d) { return +d[cols[0]]; }), 0]);



	// Create x axis
	var xAxis = d3.svg.axis()
				.scale(scaleX)
				.orient("bottom");

	// Create y axis
	var yAxis = d3.svg.axis()
				.scale(scaleY)
				.orient("left")
				.tickFormat(d3.format(".2s"));
				//.ticks(5);

	// Update old elements with transition
	var bars = chart.selectAll(".bar")
				.data(d)
				.attr("class", "bar")
				

  	// Insert new elements
	bars.enter().append("rect")
				.attr("class", "bar")
				.style("fill", function(d) { return color(0); });

	// Update all elements (new + old)
  	bars.transition().duration(500)
  				.attr("height", function(d) { return height - scaleY(d[cols[0]]); })
  				.attr("width", scaleX.rangeBand())
  				.attr("x", function(d) { return scaleX(d[xAxisName]); })
  				.attr("y", function(d) { return scaleY(d[cols[0]]); })

	

  	// Delete old elements non binded to data
  	bars.exit().remove();



  	/* Insert numbers inside the bars */

  	// Update old elements with transition
	var numbers = chart.selectAll(".bar_text")
				.data(d);
				

  	// Insert new elements
	numbers.enter().append("text")
				.attr("class", "bar_text")
				.style("fill", function(d) { return color(0); });

	// Update all elements (new + old)
  	numbers.attr("x", function(d) { 
  					return scaleX(d[xAxisName]) + scaleX.rangeBand()/2;
  				})
  				.attr("y", function(d) { 
  					if(scaleY(d[cols[0]]) + 80 < this.canvasHeight)
  						return scaleY(d[cols[0]]) + 20; 
  					else
  						return this.canvasHeight - 80;
  				}.bind(this))
  				.attr("text-anchor","middle")
  				.attr("opacity","0")
  				.transition()
  					.duration(1000)
  				.attr("opacity","1")
  				.text(function(d) { return d[cols[0]]; });

  	numbers.exit().remove();



  	chart.selectAll(".axis").remove();

  	// Append x and y axis
  	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", 6)
    	.attr("dy", ".71em")
    	.style("text-anchor", "end")
    	.text(yAxisName);
}

/*
	This function creates or update a grouped data bar chart
*/
BarGraph.prototype.dataCallbackGrouped = function(error, data) {
	if(error) {
			alert("Can't load the file");
			return;
	}

	// Elaborate the data, extract data from a single row (multiple columns)
	var d = [];
	for(var row in this.rows) {
		d.push(data[this.rows[row]]);
	}

	// Display please select an area 
	if(d.length == 0) {
		this.chart.attr("opacity","0");
		this.svg.selectAll(".legend").attr("opacity","0");
		this.svg.selectAll("text").attr("opacity","0");
		this.svg.selectAll("text.warning").attr("opacity","1");
		return;
	}
	else {
		this.chart.attr("opacity","1");
		this.svg.selectAll(".legend").attr("opacity","1");
		this.svg.selectAll("text").attr("opacity","1");
		this.svg.selectAll("text.warning").attr("opacity","0");
	}

	var color = this.color;

	var margin = this.margin,
		height = this.canvasHeight - this.margin.bottom - this.margin.top,
		width = this.canvasWidth - this.margin.left - this.margin.right;

	var xAxisName = this.xAxisName;
	var yAxisName = this.yAxisName;

	var cols = this.cols;

	// Create groups (for every row in the data attach an array containing the groups)
	data.forEach(function(d) { 
			  	d.groups = cols.map(function(name){
			  		return {name: name, value: +d[name]};
			  	}); 
			  });

	var chart = this.chart;
	var scaleX = d3.scale.ordinal()
			   	.rangeRoundBands([0, width], this.interSpace)
			   	.domain(d.map(function(d) { 
			   		var x = d[xAxisName];
			   		/*if(x.length > 15)
			   			x = x.substring(0,15) + "...";*/
			   		return x; 
			   	}));
	

	var scaleY = d3.scale.linear()
			   	.range([0, height])
			   	.domain([d3.max(d, function(da) {
			   			// Calculate the maximum
			   			var max = Number.MIN_VALUE;
			   			for(c in cols) {
			   				if(+da[cols[c]] > max)
			   					max = +da[cols[c]];
			   			}
			   			return max;
			   		}), 0]);

	var x1 = d3.scale.ordinal()
			   .domain(cols).rangeRoundBands([0, scaleX.rangeBand()]);

	// Create x axis
	var xAxis = d3.svg.axis()
				.scale(scaleX)
				.orient("bottom");

	// Create y axis
	var yAxis = d3.svg.axis()
				.scale(scaleY)
				.orient("left")
				.tickFormat(d3.format(".2s"));

	// creates groups
	var group = chart.selectAll(".group")
				.data(d);

	group.transition().duration(500)
		 .attr("transform", function(d) { return "translate(" + scaleX(d[xAxisName]) + ",0)"; });

	var newGroup = group
					.enter().append("g")
					.attr("class", "group")
					.attr("transform", function(d) { return "translate(" + scaleX(d[xAxisName]) + ",0)"; });

	// Create all bars for every new group
  	newGroup.selectAll("rect")
			.data(function(d) { return d.groups; })
		.enter().append("rect")
			.transition().duration(500)
			.attr("height", function(d) { return height - scaleY(d.value); })
			.attr("width", x1.rangeBand())
			.attr("x", function(d) { return x1(d.name); })
			.attr("y", function(d) { return scaleY(d.value); })
			.style("fill", function(d) { return color(d.name); });

	// Update already existing groups
	group.selectAll("rect")
			.data(function(d) { return d.groups; })	// Update the data for old groups
			.transition().duration(500)
			.attr("height", function(d) { return height - scaleY(d.value); })
			.attr("width", x1.rangeBand())
			.attr("x", function(d) { return x1(d.name); })
			.attr("y", function(d) { return scaleY(d.value); })
			.style("fill", function(d) { return color(d.name); });

  	// Delete old groups that no longer exists
  	group.exit().remove();

  	chart.selectAll(".axis").remove();

  	// Append x and y axis
  	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", 6)
    	.attr("dy", ".71em")
    	.style("text-anchor", "end")
    	.text(yAxisName);

    // Append the legend
    var legend = this.svg.selectAll(".legend")
    	.data(cols.slice())
    	.enter().append("g")
    	.attr("class", "legend")
    	.attr("transform", function(d, i) { return "translate(0," + (this.margin.top + i * 20) + ")"; }.bind(this));

	legend.append("rect")
		.attr("x", width+this.margin.left)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", width+this.margin.left - 6)
		.attr("y", 9)
		.attr("dy", ".35em")
		.attr("class","legend")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
}

/*
	This function creates or update a simple bar chart
*/
BarGraph.prototype.dataCallbackStacked = function(error, data) {

	if(error) {
			alert("Can't load the file");
			return;
	}

	var xAxisName = this.xAxisName;
	var yAxisName = this.yAxisName;

	// Elaborate the data, extract data from a single row (multiple columns)
	var d = [];
	for(var row in this.rows) {
		var r = [];
		var n = 0;
		var y0 = 0;
		for(var c in data[this.rows[row]]) {
			if(this.cols.indexOf(c) != -1) {
				var y = +data[this.rows[row]][c];
				r.push({x: n, y: y, y0: y0, name: data[this.rows[row]][xAxisName]});
				y0 += y;
				n++;
			}
		}
		d.push(r);
	}

	// Display please select an area 
	if(d.length == 0) {
		this.chart.attr("opacity","0");
		this.svg.selectAll(".legend").attr("opacity","0");
		this.svg.selectAll("text").attr("opacity","0");
		this.svg.selectAll("text.warning").attr("opacity","1");
		return;
	}
	else {
		this.chart.attr("opacity","1");
		this.svg.selectAll(".legend").attr("opacity","1");
		this.svg.selectAll("text").attr("opacity","1");
		this.svg.selectAll("text.warning").attr("opacity","0");
	}

	var color = this.color;

	var margin = this.margin,
		height = this.canvasHeight - this.margin.bottom - this.margin.top,
		width = this.canvasWidth - this.margin.left - this.margin.right;

	var cols = this.cols;

	var chart = this.chart;
	var scaleX = d3.scale.ordinal()
			   	.rangeRoundBands([0, width], this.interSpace)
			   	.domain(d.map(function(d) { return d[0]["name"]; }));
	

	var scaleY = d3.scale.linear()
			   	.range([0, height])
			   	.domain([d3.max(d, function(da) {
			   			// Calculate the maximum
			   			var sum = 0;
			   			for(i in da) {
			   				sum += +da[i]["y"];
			   			}
			   			return sum;
			   		}), 0]);

	// Create x axis
	var xAxis = d3.svg.axis()
				.scale(scaleX)
				.orient("bottom");

	// Create y axis
	var yAxis = d3.svg.axis()
				.scale(scaleY)
				.orient("left")
				.tickFormat(d3.format(".2s"));

	// Prepare data
	var dd = [];
	for(r in d) {
		for(l in d[r])
			dd.push(d[r][l]);
	}

	var groups = chart.selectAll(".group")
					  .data(dd);
	groups.enter()
		  .append("rect")
		  .attr("class","group")
		  .attr("x", function(d, i) {
		  	return scaleX(d["name"]);
		  })
		  .attr("y", function(d) {
		  	return scaleY(d.y+d.y0);
		  })
		  .attr("height", function(d) {
		  	return height-scaleY(d.y);
		  })
		  .attr("width", scaleX.rangeBand())
		  .attr("fill",function(d,i) { return color(i%this.cols.length); }.bind(this));
	
	groups.transition()
		  	.duration(500)
		  .attr("x", function(d, i) {
		  	return scaleX(d["name"]);
		  })
		  .attr("y", function(d) {
		  	return scaleY(d.y+d.y0);
		  })
		  .attr("height", function(d) {
		  	return height-scaleY(d.y);
		  })
		  .attr("width", scaleX.rangeBand())
		  .attr("fill",function(d,i) { return color(i%this.cols.length); }.bind(this));

	groups.exit().remove();

  	chart.selectAll(".axis").remove();

  	// Append x and y axis
  	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", 6)
    	.attr("dy", ".71em")
    	.style("text-anchor", "end")
    	.text(yAxisName);

    // Append the legend
    var legend = this.svg.selectAll(".legend")
    	.data(cols.slice())
    	.enter().append("g")
    	.attr("class", "legend")
    	.attr("transform", function(d, i) { return "translate(0," + (this.margin.top + i * 20) + ")"; }.bind(this));

	legend.append("rect")
		.attr("x", width+this.margin.left)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", function(d, i) { 
			return color(i);
		});

	legend.append("text")
		.attr("x", width+this.margin.left - 6)
		.attr("y", 9)
		.attr("dy", ".35em")
		.attr("class","legend")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
}

BarGraph.prototype.remove = function() {
	d3.select(this.myTag).selectAll("svg").remove();
}
