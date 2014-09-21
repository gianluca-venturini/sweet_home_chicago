function Map() {
}

/*
	tag: the id of the div in which you want to insert the graphic
	xAxisName: the name of the x axis in the csv
	yAxisName: the name of the y axis in the csv 
	title: the title of the graphic
	rows: the rows that must be taken from the file and displayed
*/
Map.prototype.setup = function(tag, districtColors, deselectedColor, areaSelectedColor) {
	this.myTag = tag;
	this.svg = d3.select(this.myTag).append("svg");

	this.districtColors = districtColors;
	this.deselectedColor = deselectedColor;
	this.areaSelectedColor = areaSelectedColor;

	// Selected region ids
	this.selected = []

	// Prepare the SVG
	this.svg.attr("width", "100%");
	this.svg.attr("height", "100%");

	this.margin = {top: 30, right: 10, bottom: 30, left: 10};

	this.divWidth = d3.select(this.myTag).style("width").replace("px", "");
	this.divHeight = d3.select(this.myTag).style("height").replace("px", "");

	this.canvasHeight = 800;	// Change that value in order to zoom in or zoom out
	this.canvasWidth = 600;// this.canvasHeight / this.divHeight * this.divWidth;

	// Add viewBox to the svg
	this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);


	this.chart = this.svg
    	.attr("class","map")
  		.append("g")
    	.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    /*	NO TITLE FOR THE MOMENT
    this.svg.append("text")
			.attr("class","title")
			.style("text-anchor", "middle")
			.attr("x",(this.width+this.margin.left+this.margin.right)/2)
			.attr("y",this.margin.top/2)
			.text(this.title);*/

}

Map.prototype.dataFile = function(file) {
	this.file = file;
}

Map.prototype.setScale = function(scale) {
	this.scale = scale;
}

Map.prototype.updateWindow = function() {
	this.width = this.canvasWidth - this.margin.left - this.margin.right;
	this.height = this.canvasHeight - this.margin.top - this.margin.bottom;

    d3.json(this.file, this.dataCallback.bind(this));
}

Map.prototype.dataCallback = function(error, data) {

	if(error) {
			alert("Can't load the file");
			return;
	}

	// Calculate the scale
	this.scale = 141.3304*this.width - 2126;

	var width = this.width;
	var height = this.height;

	// Calculate the projection
	var projection = d3.geo.mercator()
					   .scale(this.scale)
                       .center([-87.730, 41.827])
                       .translate([width/2,height/2]);

	//Define path generator
	var path = d3.geo.path()
				 .projection(projection);


	// Draw the community polygons
	var p = this.chart.selectAll("path")
	   			.data(data.features);

	p.enter()
	   .append("path")
	   .attr("d", path)
	   .attr("class", "area")
	   .on("click", function(d) {
	   			
	   			if(this.onClickFunction != null && this.heatMap == null)
	   				this.onClickFunction(d.id);
	   		}.bind(this));

	p.attr("d", path)
	 .attr("class","area")
	 .attr("fill", function(d) {
			if(this.selected.indexOf(d.id) != -1) {
				return this.areaSelectedColor;
			}
			else if(this.selected.indexOf(""+d.district_number) != -1) {
				return this.districtColors[+d.district_number - 1];
			}
			else
				return this.deselectedColor;
	   	}.bind(this));

	// Set the color of each area
	if(this.heatMap != null) {

		p.attr("fill", function(d) {
			var area = null;
			for(a in this.heatMap.areas) {
				if(this.heatMap.areas[a]["id"] == d.id)
					area = this.heatMap.areas[a];
			}
			if(area != null) {
				var value = area.value;
				var color = interpolate(value, this.heatMap.colors);

				return "rgb("+color.r+","+color.g+","+color.b+")";
			}
			else {
				return "rgb(150,150,150)";	
			}
		}.bind(this));

		// Append the legend
		//this.plotLegend(this.heatMap.legend, this.heatMap.colors);

		/* return RGB from HEX */
		function hexToRgb(hex) {
		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    return result ? {
		        r: parseInt(result[1], 16),
		        g: parseInt(result[2], 16),
		        b: parseInt(result[3], 16)
		    } : null;
		}

		function interpolate(v, colors) {
			var r = 0;
			var g = 0;
			var b = 0;

			var color = hexToRgb(colors[0]);
			var value =  v;
			r += color.r * value;
			g += color.g * value;
			b += color.b * value;

			color = hexToRgb(colors[1]);
			value =  1 - value;
			r += color.r * value;
			g += color.g * value;
			b += color.b * value;

			return {
		        r: parseInt(r),
		        g: parseInt(g),
		        b: parseInt(b)
		    }
		}

	}

	p.exit()
	 .transition()
	 .duration(500)
	 .remove();

	// Draw the community numbers
	var numbers = this.chart
				.selectAll("text")
	   			.data(data.features);
	   			/*
	   			.attr("class","unselectable")
	   			.text(function(d) { return d.id; })
	   			.on("click", function(d) {
		   			if(this.onClickFunction != null)
		   				this.onClickFunction(d.id);
	   				}.bind(this));
	   			*/

	numbers.enter()
	   .append("text")
	   .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
	   .attr("class","unselectable")
	   .text(function(d) { return d.id; })
	   .on("click", function(d) {
   			if(this.onClickFunction != null && this.heatMap == null)
   				this.onClickFunction(d.id);
		}.bind(this));

	   /*
	numbers
		.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
	   .attr("class","unselectable")
	   //.style("opacity","0")
	   //.transition()
	   //		.delay(500)
	   //.style("opacity","1")
	   .text(function(d) { return d.id; }); */

	numbers.exit()
		.remove();

}

Map.prototype.plotLegend = function(values, colors) {

	this.svg.selectAll(".legend").remove();
	
	// Append the legend
    var legend = this.svg.selectAll(".legend")
    	.data(values)
    	.enter().append("g")
    	.attr("class", "legend")
    	.attr("transform", function(d, i) { return "translate(40," + (this.canvasHeight - i * 20 - 40) + ")"; }.bind(this));

	

	legend.append("rect")
		.attr("x", 0)
		.attr("width", 18)
		.attr("height", 18)
		.attr("fill", function(d, i) {
			if(colors != null)
	    		return colors[i];
	    	else
	    		return "rgba(0,0,0,0);"
	    });

	legend.append("text")
		.attr("x", 22)
		.attr("y", 12)
		.attr("class", "legend")
		.style("text-anchor", "start")
		.text(function(d) { return d; });

	if(values.length > 0 && this.heatMap != null) {
		// Append the title of the  legend
		this.svg.append("text")
			  .attr("class","legend title")
			  .style("text-anchor", "start")
			  .attr("transform", function(d, i) { return "translate(50," + (this.canvasHeight - values.length * 20 - 30) + ")"; }.bind(this))
			  .text(this.heatMap.legend);
	}

}

Map.prototype.plotLegendInterpolatePercentage = function(values, colors) {

	minValue = 5;
	var newValues = [];
	var newColors = [];
	newValues.push(values[0].toFixed(2)*100 + "%");
	newColors.push(colors[0]);
	if(values.length == 2) {
		// Add values
		for(var i=1; i < minValue; i++) {
			var val = (values[1] - values[0]) / minValue * i + values[0];
			var col = interpolate(val, values[1], values[0], colors);
			newValues.push(val.toFixed(2)*100 + "%");
			newColors.push("rgb("+col.r+","+col.g+","+col.b+")");
		}
	}
	newValues.push(values[1].toFixed(2)*100 + "%");
	newColors.push(colors[1]);

	this.plotLegend(newValues, newColors);

	/* return RGB from HEX */
	function hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

	function interpolate(v, min, max, colors) {
		var r = 0;
		var g = 0;
		var b = 0;

		var color = hexToRgb(colors[0]);
		var value = ( v - min ) / ( max - min );
		r += color.r * value;
		g += color.g * value;
		b += color.b * value;

		color = hexToRgb(colors[1]);
		value =  1 - value;
		r += color.r * value;
		g += color.g * value;
		b += color.b * value;

		return {
	        r: parseInt(r),
	        g: parseInt(g),
	        b: parseInt(b)
	    }
	}

}

Map.prototype.plotLegendInterpolate = function(values, colors) {

	minValue = 5;
	var newValues = [];
	var newColors = [];
	newValues.push(values[0].toFixed(2));
	newColors.push(colors[0]);
	if(values.length == 2) {
		// Add values
		for(var i=1; i < minValue; i++) {
			var val = (values[1] - values[0]) / minValue * i + values[0];
			var col = interpolate(val, values[1], values[0], colors);
			newValues.push(val.toFixed(2));
			newColors.push("rgb("+col.r+","+col.g+","+col.b+")");
		}
	}
	newValues.push(values[1].toFixed(2));
	newColors.push(colors[1]);

	this.plotLegend(newValues, newColors);

	/* return RGB from HEX */
	function hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

	function interpolate(v, min, max, colors) {
		var r = 0;
		var g = 0;
		var b = 0;

		var color = hexToRgb(colors[0]);
		var value = ( v - min ) / ( max - min );
		r += color.r * value;
		g += color.g * value;
		b += color.b * value;

		color = hexToRgb(colors[1]);
		value =  1 - value;
		r += color.r * value;
		g += color.g * value;
		b += color.b * value;

		return {
	        r: parseInt(r),
	        g: parseInt(g),
	        b: parseInt(b)
	    }
	}

}


Map.prototype.setColor = function(color) {
	this.color = color;
}

/*
	This function will create an heatmap based on the number in the range [0,1]
	example: {1: "0.1", 2: "0.5", 3:"0.6", 4:"1"}
*/
Map.prototype.setHeatMap = function(heatMap) {

	this.heatMap = heatMap;
}

Map.prototype.resetHeatMap = function() {
	this.heatMap = null;
}

/*
	When an area on the map is clicked it will execute onClickFunction
	passing parameter the id of the area
*/
Map.prototype.setOnClick = function(onClickFunction) {
	this.onClickFunction = onClickFunction;
}

Map.prototype.setSelected = function(selected) {
	this.selected = selected;
	//console.log(selected);
}
