function MapWorld() {
}

/*
	tag: the id of the div in which you want to insert the graphic
*/
MapWorld.prototype.setup = function(tag, districtColors, deselectedColor, areaSelectedColor) {
	this.myTag = tag;
	this.svg = d3.select(this.myTag).append("svg");

	this.districtColors = districtColors;
	this.deselectedColor = deselectedColor;
	this.areaSelectedColor = areaSelectedColor;

	// World data
	this.world = null;

	// Capitals coordinates
	this.capitals = null;

	// Other data
	this.data = null;

	// File that contains that data
	this.file = null;

	// Selected region ids
	this.selected = []

	// Prepare the SVG
	this.svg.attr("width", "100%");
	this.svg.attr("height", "100%");

	this.margin = {top: 6, right: 1, bottom: 3, left: 1};

	this.divWidth = d3.select(this.myTag).style("width").replace("px", "");
	this.divHeight = d3.select(this.myTag).style("height").replace("px", "");

	this.canvasHeight = 100;	// Change that value in order to zoom in or zoom out
	this.canvasWidth = 200;// this.canvasHeight / this.divHeight * this.divWidth;

	// Add viewBox to the svg
	this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);


	this.chart = this.svg
		.attr("class","map")
		.append("g")
		.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	
	this.svg.append("text")
			.attr("class","map_title")
			.style("text-anchor", "middle")
			.attr("x",(this.canvasWidth+this.margin.left+this.margin.right)/2)
			.attr("y",this.margin.top/2)
			.text(this.title);

}

MapWorld.prototype.dataFile = function(file) {
	this.file = file;
}

MapWorld.prototype.setSelected = function(selected) {
	this.selected = selected;
}

MapWorld.prototype.updateWindow = function() {
	this.width = this.canvasWidth - this.margin.left - this.margin.right;
	this.height = this.canvasHeight - this.margin.top - this.margin.bottom;

	if(this.world == null)
		d3.json("data/world-50m.json", this.worldDataCallback.bind(this));
	else
		this.worldDataCallback(false, this.world);
}

MapWorld.prototype.worldDataCallback = function(error, data) {
	if(error) {
			alert("Can't load the world map file");
			return;
	}

	this.world = data;

	if(this.capitals == null)
		d3.json("data/country-capitals.json", this.worldCapitalsCallback.bind(this));
	else
		this.worldCapitalsCallback(false, this.capitals);
}

MapWorld.prototype.worldCapitalsCallback = function(error, data) {
	if(error) {
			alert("Can't load the country capitals file");
			return;
	}

	this.capitals = data;

	if(this.data == null)
		d3.csv(this.file, this.dataCallback.bind(this));
	else
		this.dataCallback(false, this.data);
}

MapWorld.prototype.dataCallback = function(error, data) {

	if(error) {
			alert("Can't load the file "+this.file);
			return;
	}

	this.data = data;	

	var world = this.world;
	var capitals = this.capitals;

	var selected = this.selected.slice();

	if(selected.length == 0)
		selected.push(0);

	/* Prepare the data */
	var max = Number.MIN_VALUE;
	var dd = [];	// One row for each country
	for(var s in selected) {
		var keys = d3.keys( data[selected[s]] );

		for(var k in keys) {		
			for(var c in capitals) {
				if(capitals[c]["CountryName"] == keys[k]) {
					var country = {};
					var present = false;

					country["number"] = 0;
				
					// Search for the country
					for(var r in dd) {
						if(dd[r]["CountryName"] == keys[k]) {
							country = dd[r];
							present = true;
							break;
						}
					}

					country["CountryName"] = capitals[c]["CountryName"];
					country["number"] += +data[selected[s]][keys[k]];
					country["lat"] = capitals[c]["CapitalLatitude"];
					country["lon"] = capitals[c]["CapitalLongitude"];

					if(present == false)
						dd.push(country);

					if(+country["number"] > max)
						max = +country["number"];
				}
			}	
		}
	}

	var circleScaleFactor = max/60;
	console.log(circleScaleFactor);

	var width = this.canvasWidth,
    	height = this.canvasHeight,
    	maxlat = 90;        // clip northern and southern poles (infinite in mercator)
    
	var projection = d3.geo.mercator()
	    .rotate([0, 0])
	    .center([10,-35])
	    .scale(1)           // we'll scale up to match viewport shortly.
	    .translate([width/2, height/2]);

	// find the top left and bottom right of current projection
	function mercatorBounds(projection, maxlat) {
	    var yaw = projection.rotate()[0],
	        xymax = projection([-yaw+180-1e-6,-maxlat]),
	        xymin = projection([-yaw-180+1e-6, maxlat]);
	    
	    return [xymin,xymax];
	}

	// set up the scale extent and initial scale for the projection
	var b = mercatorBounds(projection, maxlat),
	    s = width/(b[1][0]-b[0][0]),
	    scaleExtent = [s, 10*s];

	projection
	    .scale(scaleExtent[0]);

	var zoom = d3.behavior.zoom()
	    .scaleExtent(scaleExtent)
	    .scale(projection.scale())
	    .translate([0,0]);               // not linked directly to projection
	    //.on("zoom", redraw);
	    
	var path = d3.geo.path()
	    .projection(projection);

	this.chart
	        .call(zoom);

	this.chart.selectAll('path')
        .data(topojson.feature(world, world.objects.countries).features)
      .enter().append('path')

	this.chart.selectAll('path')       // re-project path data
		.attr("class","world")
        .attr('d', path);

    var circles = this.chart.selectAll(".indicator")
    						.data(dd);
    circles.enter().append("circle")
    			   .attr("class","indicator");

    circles
    	.transition()
    		.duration(500)
    	.attr("cx", function(d) {
    		return projection([d["lon"], d["lat"]])[0];
    		//return projection([0, 0])[0];
    	})
    	.attr("cy", function(d) {
    		return projection([d["lon"], d["lat"]])[1];
    		//return projection([0, 0])[1];
    	})
    	.attr("r", function(d) {
    		return Math.sqrt(d["number"] / (3.14 * circleScaleFactor));
    	})
    	.style("fill","white")
    	.style("opacity","0.6");

    circles.exit().remove();


    // Calculate the legend
    var l = [];
    for(var i=1; i<=5; i++) {
    	l.push(max/5*i);
    }

    /*
    // Don't display the legend if there are no area selected
    if(this.selected.length == 0)
    	l = []; */

    // Legend

    var legend = this.svg.selectAll(".worldmap.legend")
    				 .data(l);


    var g = legend.enter()
    	  .append("g")
    	  .attr("class","worldmap")
		  .attr("transform", function(d, i){
		  	return "translate(" + this.margin.left + "," + (this.canvasHeight - 5 - i*9) + ")"
		  }.bind(this))
		  .attr("fill","white");

	g.append("circle");

	g.append("text")
	 	.attr("class", "legend");

	 /* Title */
	var title = this.svg.selectAll(".title")
					.data(["LEGEND"]);
	title.enter()
		.append("text")
		.attr("x", 20)
	    .attr("y", (this.canvasHeight - 6 - l.length * 9))
	    .attr("class", "title worldmap")
		.style("text-anchor", "middle")
		.text("Total number of people");
		
	title
		.attr("y", (this.canvasHeight - 6 - l.length * 9))
		.attr("opacity", function(d, i) {
			if(l.length > 0)
				return "1";
			else
				return "0";
		});
	    

	this.svg.selectAll(".worldmap circle")
			.data(l)
			.attr("cx", 0)
	    	.attr("cy", 0)
	    	.attr("r", function(d) {
	    		return Math.sqrt(d / (3.14 * circleScaleFactor));
	    	})
	    	.style("fill","white")
	    	.style("opacity","0.6")
	    	.exit()
	    	.transition()
	    		.duration(500)
	    	.style("opacity","0")
	    	.remove();

	this.svg.selectAll(".worldmap .legend")
		.data(l)
		.attr("x", function(d) {
			return 14;
		})
		.attr("y", function(d) {
			return 2;
		})
		.style("text-anchor", "middle")
		.text(function(d) { return parseFloat(d.toPrecision(2)); })
		.exit()
		.transition()
	    		.duration(500)
	    .style("opacity","0")
		.remove();

	legend.exit().remove();

	// Update the title of the graph
	if(this.selected.length == 0)
		this.svg.selectAll(".map_title")
				.text("PLACE DISTRIBUTION IN CHICAGO");
	else
		this.svg.selectAll(".map_title")
		.text("PLACE DISTRIBUTION IN SELECTED AREAS");
}


MapWorld.prototype.plotLegend = function(values, colors) {


}