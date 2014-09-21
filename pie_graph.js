function PieGraph() {
}

/*
	This class display one or more value on a row
	tag: the id of the div in which you want to insert the graphic
	title: the title of the graphic
	columns: array of columns to visualize
	row: specify the row number inside data file to visualize
*/
PieGraph.prototype.setup = function(tag, title, columns, row) {
	this.myTag = tag;
	this.svg = d3.select(this.myTag).append("svg");
	this.title = title;
	this.columns = columns;
	this.row = row;
	this.color = d3.scale.category10();

	this.data = null;

	// Prepare the SVG
	//this.svg.attr("width", "100%");
	//this.svg.attr("height", "100%");

	this.margin = {top: 30, right: 30, bottom: 30, left: 40};
	this.divWidth = d3.select(this.myTag).style("width").replace("px", "");
	this.divHeight = d3.select(this.myTag).style("height").replace("px", "");

	this.canvasHeight = 400;
	this.canvasWidth = this.canvasHeight / this.divHeight * this.divWidth;

	this.outerRadius = Math.min(this.canvasHeight-this.margin.top-this.margin.bottom, this.canvasWidth-this.margin.left-this.margin.right)/2;
	this.innerRadius = this.outerRadius * 5 / 10;

	// Create the graphic (g element) inside SVG
	this.chart = this.svg
		.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight)
		//.attr("width", this.width + this.margin.left + this.margin.right)
    	//.attr("height", this.height + this.margin.top + this.margin.bottom)
  		.append("g")
    	.attr("transform", "translate(" + ((this.canvasWidth)/2 - this.outerRadius) + "," + 
    									  ((this.canvasHeight)/2 - this.outerRadius) + ")");

    this.svg.append("text")
			.attr("class","title")
			.style("text-anchor", "middle")
			.attr("x",(this.canvasWidth)/2)
			.attr("y",this.margin.top/2)
			.text(this.title);

}

PieGraph.prototype.dataFile = function(file) {
	this.file = file;
}

PieGraph.prototype.setRow = function(row) {
	this.row = row;
}

PieGraph.prototype.setColumns = function(columns) {
	this.columns = columns;
}

PieGraph.prototype.updateWindow = function() {
	// Update canvas dimensions and radius
	this.divWidth = d3.select(this.myTag).style("width").replace("px", "");
	this.divHeight = d3.select(this.myTag).style("height").replace("px", "");
	this.canvasWidth = this.canvasHeight / this.divHeight * this.divWidth;

	this.outerRadius = Math.min(this.canvasHeight-this.margin.top-this.margin.bottom, this.canvasWidth-this.margin.left-this.margin.right)/2;
	this.innerRadius = this.outerRadius * 5 / 10;

	//this.width = d3.select(this.myTag).style("width").replace("px", "") - this.margin.left - this.margin.right;
	//this.height = d3.select(this.myTag).style("height").replace("px", "") - this.margin.top - this.margin.bottom;

	//var outerRadius = Math.min(this.canvasHeight-this.margin.top-this.margin.bottom, this.canvasWidth-this.margin.left-this.margin.right)/2;

	var outerRadius = this.outerRadius;
	
	// Resize the SVG
	this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);

   	//console.log(((this.margin.left+this.margin.right+this.width)/2)-(outerRadius/2), this.width, this.margin.left, outerRadius);


   	// Resize chart area
   	this.chart
    	.attr("transform", "translate(" + ((this.canvasWidth)/2 - outerRadius) + "," + 
    									  ((this.canvasHeight)/2 - outerRadius) + ")");

    if(this.data == null)
		d3.csv(this.file, type, this.dataCallback.bind(this));
	else
		this.dataCallback(false, this.data);

	function type(d) {
			d.value = +d.value; // coerce to number
			return d;
	}

}

PieGraph.prototype.dataCallback = function(error, data) {
	if(error) {
			alert("Can't load the file");
			return;
	}

	this.data = data;

	// Elaborate the data, extract data from a single row (multiple columns)
	d = [];
	for(var column in this.columns) {
		var value = +data[this.row][this.columns[column]];
		d.push(value);
	}	

	var outerRadius = this.outerRadius;
	var innerRadius = this.innerRadius;

	var arc = d3.svg.arc()
				.innerRadius(innerRadius)
				.outerRadius(outerRadius);
			
	var pie = d3.layout.pie();
	pie.sort(null);

	var color = this.color;

	var width = this.canvasWidth;
	var height = this.canvasHeight;


	//Set up groups
	var arcs = this.chart
				   .selectAll("g.arc")
				   //.data(pie(d));
				   .data(pie(d));
				   
	arcs.enter()
		.append("g")
		.attr("class", "arc")
		.append("path")
		.attr("fill", function(d, i) {
	    	return color(i);
	    })
	    .attr("d", arc)
	    .each(function(d) { this._current = d; });
	   
	// Remove old labels
	arcs.selectAll("text")
		.remove();

	// Insert new labels
	arcs.append("text")
		.attr("opacity","0")
	    .attr("transform", function(d) {
	    	return "translate(" + arc.centroid(d) + ")";
	    })
	    .attr("text-anchor", "middle")
	    .text(function(d) {
	    	return d.value;
	    })
	    .transition()
			.duration(300)
		.attr("opacity", function(d, i) {
			if(Math.abs(d.startAngle - d.endAngle) < 0.4)
				return "0";
			else
				return "1";
		});

	arcs.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

	// Update already existing arc paths
	arcs.select("path")
		.attr("fill", function(d, i) {
	    	return color(i);
	    })
	    .transition()
	    	.duration(750)
	    .attrTween("d", arcTween);

	// Remove the legend
	this.svg.selectAll(".legend").remove();

	// Append the legend
    var legend = this.svg.selectAll(".legend")
    	.data(this.columns.slice())
    	.enter().append("g")
    	.attr("class", "legend")
    	.attr("transform", function(d, i) { return "translate(0," + (20 + i * 20) + ")"; });

	legend.append("rect")
		.attr("x", width/2 + outerRadius)
		.attr("width", 18)
		.attr("height", 18)
		.attr("fill", function(d, i) {
	    	return color(i);
	    });

	legend.append("text")
		.attr("x", width/2 + outerRadius - 6)
		.attr("y", 9)
		.attr("class", "legend")
		.style("text-anchor", "end")
		.text(function(d) { return d; });

	// Update the title of the graphic
	var title = this.title;
	if(title.substr(title.length - 2) == "%s") {
		title = title.substr(0, title.length - 2);
		title += data[this.row]["NAME"];
	}

	this.svg.selectAll(".title").remove();

	this.svg.append("text")
			.attr("class","title")
			.style("text-anchor", "middle")
			.attr("x",(this.canvasWidth)/2)
			.attr("y",this.margin.top/2)
			.text(title);
			

	// Calculate radial movement using interpolation
	function arcTween(a) {
	  var i = d3.interpolate(this._current, a);
	  this._current = i(0);
	  return function(t) {
	    return arc(i(t));
  	};
}

PieGraph.prototype.remove = function() {
	d3.select(this.myTag).selectAll("svg").remove();
}


}