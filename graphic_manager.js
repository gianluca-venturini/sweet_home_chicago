/*
	This class will manage all the graphics in the application.

	In order to use this graphic need n steps:
	1 - setContainerIds: will set all the container id used in the application
	2 - addMenu: connects a drop down menu
	3 - setModality: set the type of data that it will visualize
*/
function GraphicManager() {
	/* COLORS PALETTE */

	// MAP COLORS
	this.districtColors = [ "#27ae60",
							"#e67e22",
							"#3498db",
							"#1abc9c",
							"#F7CA18",
							"#d35400",
							"#f39c12",
							"#D2527F",
							"#9b59b6"  ];

	this.areaSelectedColor = "#EF4836";

	this.deselectedColor = "#333E45";

	this.genderColors = ["#52B5CC",
						 "#FFC3C0"];

	this.ageColors = [  "#DEDC4A",
						"#F4B23E",
						"#E58830",
						"#E35F27",
						"#E7311D",
						"#C22E19",
						"#A12613"  ];

	this.raceColors = [  "#F15A5A",
						 "#F0C419",
						 "#4EBA6F",
						 "#2D95BF",
						 "#955BA5"  ];

	this.originColors = [  "#F15A5A",
						   "#F0C419",
						   "#4EBA6F",
						   "#2D95BF",
						   "#955BA5"  ];

	this.mapColor = "#6C6C78";

	this.heatMapUnderColor = ["#FE0702","#21B1DE"];
	this.heatMapPopulationColor = ["#0072EB","#EFF9FF"];
	this.heatMapAge = ["#FE0702","#21B1DE"];
	this.heatMapRaceColor = ["#FE0702","#C1D753"];
	this.heatOriginColor = ["#FE0702","#C1D753"];
}


GraphicManager.prototype.setContainerIds = function(c1, c2, c3, c4, c5, m1, m2) {
	// HTML elements identifiers
	this.c1 = c1;
	this.c2 = c2;
	this.c21 = c2+"1";
	this.c22 = c2+"2";
	this.c3 = c3;
	this.c4 = c4;
	this.c5 = c5;
	this.m1 = m1;
	this.m2 = m2;

	this.dataType = null;

	this.maps = [];	// Contains the maps
	this.worldMaps = [];	// Contains the world map
	this.bgs = [];	// Contains the bar chart
	this.citypg = [];	// Contains the city pie chart
	this.pgs = [];	// Contains the pie chart
	this.menus = [];	// Contains the menus
	this.tables = [];	// Contains the tables

	this.selectedAreas = [];	// Areas or districts selected (0: city, 1-9: district, 9-86: comminuty area)
	this.setupMaps();
	this.updateGraphics();
}

/*
	Add a drop down menu
*/
GraphicManager.prototype.addMenu = function(menu) {
	this.menus.push(d3.select(menu));
	this.setupMenu(menu);
}

/*
	Add drop down menus 
*/
GraphicManager.prototype.setMenus = function(menus) {
	for(m in menus) {
		this.menus.push(d3.select(menus[m]));
		this.setupMenu(menus[m]);
	}
}

/*
	Add interactivity to menu buttons
*/
GraphicManager.prototype.setupMenuButtons = function(gender, 
													 age, 
													 race, 
													 origin, 
													 heat, 
													 heat_under, 
													 heat_population, 
													 heat_average_age, 
													 heatmapSelection, 
													 areaSelection, 
													 heat_race_black, 
													 heat_race_white, 
													 heat_race_asian, 
													 heat_race_latino, 
													 heat_origin_asia,
													 heat_origin_camerica,
													 heat_origin_samerica,
													 heat_origin_europe) {
	
	// Attach a callback when they are pressed
	d3.selectAll(gender)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(gender).attr("class", d3.select(gender).attr("class")+" selected");
	  	this.setupGender();
	  }.bind(this));

	d3.selectAll(age)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(age).attr("class", d3.select(age).attr("class")+" selected");
	  	this.setupAge();
	  }.bind(this));

	d3.selectAll(race)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(race).attr("class", d3.select(race).attr("class")+" selected");
	  	this.setupRace();
	  }.bind(this));

	d3.selectAll(origin)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(origin).attr("class", d3.select(origin).attr("class")+" selected");
	  	this.setupOrigin();
	  }.bind(this));

	d3.selectAll(heat)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeat()
	  }.bind(this));

	d3.selectAll(heat_under)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_under).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatUnder();
	  }.bind(this));

	d3.selectAll(heat_population)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_population).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatPopulation();
	  }.bind(this));

	d3.selectAll(heat_average_age)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_average_age).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatAgeAverage();
	  }.bind(this));

	d3.selectAll(heat_race_black)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_race_black).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatRace("BLACK");
	  }.bind(this));

	d3.selectAll(heat_race_white)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_race_white).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatRace("WHITE");
	  }.bind(this));

	d3.selectAll(heat_race_asian)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_race_asian).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatRace("ASIAN");
	  }.bind(this));

	d3.selectAll(heat_race_latino)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_race_latino).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatRace("LATINO");
	  }.bind(this));

	d3.selectAll(heat_origin_asia)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_origin_asia).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatOrigin("ASIA");
	  }.bind(this));

	d3.selectAll(heat_origin_camerica)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_origin_camerica).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatOrigin("CENTRAL AMERICA");
	  }.bind(this));

	d3.selectAll(heat_origin_samerica)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_origin_samerica).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatOrigin("SOUTH AMERICA");
	  }.bind(this));

	d3.selectAll(heat_origin_europe)
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(heat_origin_europe).attr("class", d3.select(heat).attr("class")+" selected");
	  	this.setupHeatOrigin("EUROPE");
	  }.bind(this));

	this.heatmapSelection = heatmapSelection;
	this.areaSelection = areaSelection;
	  
}

GraphicManager.prototype.setModality = function(modality) {
	switch(modality) {
		case "GENDER":
			this.setupGender();
			break;
		default:
			alert("Error modality not supported");
	}
}

GraphicManager.prototype.setupMaps = function() {
	// Setup maps
	var map1 = new Map();
	map1.setup(this.m1, this.districtColors, this.deselectedColor, this.areaSelectedColor);
	map1.dataFile("data/chicago_community_district_map.json");
	map1.setColor(this.mapColor);

	map1.setOnClick(this.mapSelectArea.bind(this));

	this.maps.push(map1);
}

GraphicManager.prototype.setupGender = function() {
	this.dataType = "GENDER";
	this.setLegend();

	// Remove all containers in c2 that are eventually there
	d3.select(this.c21).remove();
	d3.select(this.c22).remove();	

	// Remove all containers in c5 that are eventually there
	d3.select(this.c5).selectAll(".container").remove();

	// Show area controls and hide heatmap controls
	d3.select(this.heatmapSelection).style("display","none");
	d3.select(this.areaSelection).style("display","inline");

	this.removeAllGraphs();

	// Add containers c21 and c22
	this.c21 = "#container3";
	this.c22 = "#container4";
	d3.select(this.c2).append("div")
	  		     .attr("style","width:50%; height:100%;")
	  		     .attr("class", "container")
	  		     .attr("id", this.c21.substring(1));

	d3.select(this.c2).append("div")
	  		     .attr("style","width:50%; height:100%;")
	  		     .attr("class", "container")
	  		     .attr("id", this.c22.substring(1));

	// Setup grouped bar chart
	var bgg1 = new BarGraph();
	bgg1.dataFile("data/demographic.csv");
	bgg1.setup(this.c1,"NAME","PEOPLE","GENDER",[],["MALE","FEMALE"]);
	bgg1.color = d3.scale.ordinal().range(this.genderColors);
	this.bgs.push(bgg1);

	// Setup bar graphs
	var bg1 = new BarGraph();
	bg1.dataFile("data/demographic.csv");
	bg1.setup(this.c21,"NAME","PEOPLE","MALE",[],["MALE"]);
	bg1.color = d3.scale.ordinal().range([this.genderColors[0]]);

	var bg2 = new BarGraph();
	bg2.dataFile("data/demographic.csv");
	bg2.setup(this.c22,"NAME","PEOPLE","FEMALE",[],["FEMALE"]);
	bg2.color = d3.scale.ordinal().range([this.genderColors[1]]);

	this.bgs.push(bg1);
	this.bgs.push(bg2);

	// Setup city pie chart
	var pg = new PieGraph();
	pg.dataFile("data/demographic.csv");
	pg.setup(this.c4,"GENDER - CHICAGO",["MALE","FEMALE"], 0);
	pg.color = d3.scale.ordinal().range(this.genderColors);
	this.citypg.push(pg);

	// Setup table
	var tb = new Table();
	tb.setup(this.c3, "GENDER", [], ["MALE","FEMALE"]);
	tb.dataFile("data/demographic.csv");
	this.tables.push(tb);

	this.updateGraphics();
}

GraphicManager.prototype.setupAge = function() {
	this.dataType = "AGE";
	this.setLegend();

	// Remove all containers in c2
	d3.select(this.c21).remove();
	d3.select(this.c22).remove();

	// Remove all containers in c5 that are eventually there
	d3.select(this.c5).selectAll(".container").remove();

	// Add containers c21 and c22
	this.c21 = "#container3";
	this.c22 = "#container4";

	d3.select(this.c2).append("div")
	  		     .attr("style","width:50%; height:100%;")
	  		     .attr("class", "container")
	  		     .attr("id", this.c21.substring(1));

	d3.select(this.c2).append("div")
	  		     .attr("style","width:50%; height:100%;")
	  		     .attr("class", "container")
	  		     .attr("id", this.c22.substring(1));

	// Show area controls and hide heatmap controls
	d3.select(this.heatmapSelection).style("display","none");
	d3.select(this.areaSelection).style("display","inline");	

	//this.mapDeselectAll();
	this.removeAllGraphs();

	// Setup stacked bar chart
	var bgs1 = new BarGraph();
	bgs1.dataFile("data/demographic.csv");
	bgs1.setup(this.c1,"NAME","PEOPLE","AGE DISTRIBUTION",[],["0-9","10-18","19-21","22-30","31-50","51-70","71+"]);
	bgs1.stacked = true;
	bgs1.color = d3.scale.ordinal().range(this.ageColors);
	this.bgs.push(bgs1);

	// Setup grouped bar chart
	var bgg1 = new BarGraph();
	bgg1.dataFile("data/demographic.csv");
	bgg1.setup(this.c22,"NAME","PEOPLE","AGE DISTRIBUTION",[],["0-9","10-18","19-21","22-30","31-50","51-70","71+"]);
	bgg1.color = d3.scale.ordinal().range(this.ageColors);
	this.bgs.push(bgg1);

	// Setup city pie charts
	var pg = new PieGraph();
	pg.dataFile("data/demographic.csv");
	pg.setup(this.c4,"AGE DISTRIBUTION - CHICAGO",["0-9","10-18","19-21","22-30","31-50","51-70","71+"], 0);
	pg.color = d3.scale.ordinal().range(this.ageColors);
	this.citypg.push(pg);	

	// Setup table
	var tb = new Table();
	tb.setup(this.c3, "AGE", [], ["0-9","10-18","19-21","22-30","31-50","51-70","71+"]);
	tb.dataFile("data/demographic.csv");
	this.tables.push(tb);

	this.updateGraphics();
}

GraphicManager.prototype.setupRace = function() {
	this.dataType = "RACE";
	this.setLegend();

	// Remove all containers in c2 that are eventually there
	d3.select(this.c21).remove();
	d3.select(this.c22).remove();

	d3.select(this.c2).append("div")
	  		     .attr("style","width:50%; height:100%;")
	  		     .attr("class", "container")
	  		     .attr("id", this.c21.substring(1));

	d3.select(this.c2).append("div")
	  		     .attr("style","width:50%; height:100%;")
	  		     .attr("class", "container")
	  		     .attr("id", this.c22.substring(1));	

	// Remove all containers in c5 that are eventually there
	d3.select(this.c5).selectAll(".container").remove();

	// Show area controls and hide heatmap controls
	d3.select(this.heatmapSelection).style("display","none");
	d3.select(this.areaSelection).style("display","inline");

	this.removeAllGraphs();

	// Setup stacked bar chart
	var bgs1 = new BarGraph();
	bgs1.dataFile("data/race.csv");
	bgs1.setup(this.c1,"NAME","PEOPLE","RACE DISTRIBUTION",[],["LATINO","WHITE","BLACK","ASIAN","OTHER"]);
	bgs1.stacked = true;
	bgs1.color = d3.scale.ordinal().range(this.raceColors);
	this.bgs.push(bgs1);

	// Setup grouped bar chart
	var bgg1 = new BarGraph();
	bgg1.dataFile("data/race.csv");
	bgg1.setup(this.c22,"NAME","PEOPLE","RACE DISTRIBUTION",[],["LATINO","WHITE","BLACK","ASIAN","OTHER"]);
	bgg1.color = d3.scale.ordinal().range(this.raceColors);
	this.bgs.push(bgg1);

	// Setup city pie charts
	var pg = new PieGraph();
	pg.dataFile("data/race.csv");
	pg.setup(this.c4,"RACE DISTRIBUTION - CHICAGO",["LATINO","WHITE","BLACK","ASIAN","OTHER"], 0);
	pg.color = d3.scale.ordinal().range(this.raceColors);
	this.citypg.push(pg);	

	// Setup table
	var tb = new Table();
	tb.setup(this.c3, "RACE", [], ["LATINO","WHITE","BLACK","ASIAN","OTHER"]);
	tb.dataFile("data/race.csv");
	this.tables.push(tb);

	this.updateGraphics();

}

GraphicManager.prototype.setupOrigin = function() {
	this.dataType = "ORIGIN";
	this.setLegend();

	// Remove all containers in c2 that are eventually there
	d3.select(this.c21).remove();
	d3.select(this.c22).remove();	

	d3.select(this.c2).append("div")
	  		     .attr("style","width:50%; height:100%;")
	  		     .attr("class", "container")
	  		     .attr("id", this.c21.substring(1));

	d3.select(this.c2).append("div")
	  		     .attr("style","width:50%; height:100%;")
	  		     .attr("class", "container")
	  		     .attr("id", this.c22.substring(1));

	// Remove all containers in c5 that are eventually there
	d3.select(this.c5).selectAll(".container").remove();

	// Show area controls and hide heatmap controls
	d3.select(this.heatmapSelection).style("display","none");
	d3.select(this.areaSelection).style("display","inline");

	this.removeAllGraphs();

	// Setup stacked bar chart
	var bgs1 = new BarGraph();
	bgs1.dataFile("data/origin.csv");
	bgs1.setup(this.c1,"NAME","PEOPLE","PLACE OF ORIGIN DISTRIBUTION",[],["ASIA","CENTRAL AMERICA","SOUTH AMERICA","EUROPE","OTHERS"]);
	bgs1.stacked = true;
	bgs1.color = d3.scale.ordinal().range(this.originColors);
	this.bgs.push(bgs1);

	// Setup world map
	var mapWorld = new MapWorld();
	mapWorld.setup(this.c21);
	mapWorld.dataFile("data/origin_detailed.csv");
	mapWorld.updateWindow();
	this.worldMaps.push(mapWorld);

	// Setup grouped bar chart
	var bgg1 = new BarGraph();
	bgg1.dataFile("data/origin.csv");
	bgg1.setup(this.c22,"NAME","PEOPLE","PLACE OF ORIGIN DISTRIBUTION",[],["ASIA","CENTRAL AMERICA","SOUTH AMERICA","EUROPE","OTHERS"]);
	bgg1.color = d3.scale.ordinal().range(this.originColors);
	this.bgs.push(bgg1);

	// Setup city pie charts
	var pg = new PieGraph();
	pg.dataFile("data/origin.csv");
	pg.setup(this.c4,"PLACE OF ORIGIN DISTRIBUTION - CHICAGO",["ASIA","CENTRAL AMERICA","SOUTH AMERICA","EUROPE","OTHERS"], 0);
	pg.color = d3.scale.ordinal().range(this.originColors);
	this.citypg.push(pg);	

	// Setup table
	var tb = new Table();
	tb.setup(this.c3, "PLACE OF ORIGIN", [], ["ASIA","CENTRAL AMERICA","SOUTH AMERICA","EUROPE","OTHERS"]);
	tb.dataFile("data/origin.csv");
	this.tables.push(tb);

	this.updateGraphics();

}

GraphicManager.prototype.setupHeat = function() {
	this.dataType = "HEAT";

	// Remove all containers in c2 that are eventually there
	d3.select(this.c21).remove();
	d3.select(this.c22).remove();	

	// Remove all containers in c5 that are eventually there
	d3.select(this.c5).selectAll(".container").remove();

	this.removeAllGraphs();

	this.selectedAreas = [];	// Remove the selection on the maps

	// Show heatmap controls and hide area selection
	d3.select(this.heatmapSelection).style("display","inline");
	d3.select(this.areaSelection).style("display","none");

	this.updateGraphics();
}

GraphicManager.prototype.setupHeatUnder = function() {
	this.dataType = "HEAT_UNDER";

	// Remove all containers in c2 that are eventually there
	d3.select(this.c21).remove();
	d3.select(this.c22).remove();	

	// Remove all containers in c5 that are eventually there
	d3.select(this.c5).selectAll(".container").remove();

	this.removeAllGraphs();

	if(this.maps.length > 0) {
		var map = this.maps[0];
		d3.csv("data/demographic.csv", function(error, data) {
			var hm = computePeopleUnder(data, "PEOPLE UNDER 18", ["0-9","10-18"], ["0-9","10-18","19-21","22-30","31-50","51-70","71+"], this.heatMapUnderColor,"PERCENTAGE UNDER 18");
			map.setHeatMap(hm);
			map.plotLegendInterpolatePercentage([map.heatMap.max,
						    		   map.heatMap.min], this.heatMapUnderColor)
			map.updateWindow();
		}.bind(this));
	}

	this.updateGraphics();

}

GraphicManager.prototype.setupHeatPopulation = function() {
	this.dataType = "HEAT_POPULATION";

	// Remove all containers in c2 that are eventually there
	d3.select(this.c21).remove();
	d3.select(this.c22).remove();	

	// Remove all containers in c5 that are eventually there
	d3.select(this.c5).selectAll(".container").remove();

	this.removeAllGraphs();

	if(this.maps.length > 0) {
		var map = this.maps[0];
		d3.csv("data/demographic.csv", function(error, data) {
			var hm = computeDensityPopulation(data, "DENSITY OF POPULATION", ["0-9","10-18","19-21","22-30","31-50","51-70","71+"], this.heatMapPopulationColor,"DENSITY OF POPULATION");
			map.setHeatMap(hm);
			map.plotLegendInterpolate([map.heatMap.max,
						    		   map.heatMap.min],this.heatMapPopulationColor);
			map.updateWindow();
		}.bind(this));
	}

	this.updateGraphics();

}

GraphicManager.prototype.setupHeatAgeAverage = function() {
	this.dataType = "HEAT_AGE_AVERAGE";

	// Remove all containers in c2 that are eventually there
	d3.select(this.c21).remove();
	d3.select(this.c22).remove();	

	// Remove all containers in c5 that are eventually there
	d3.select(this.c5).selectAll(".container").remove();

	this.removeAllGraphs();

	if(this.maps.length > 0) {
		var map = this.maps[0];
		d3.csv("data/demographic.csv", function(error, data) {
			var hm = computeAgeAverage(data, "AGE AVERAGE", ["0-9","10-18","19-21","22-30","31-50","51-70","71+"], this.heatMapAge,"AGE AVERAGE");
			map.setHeatMap(hm);
			map.plotLegendInterpolate([map.heatMap.max,
						   			   map.heatMap.min], this.heatMapAge);
			map.updateWindow();
		}.bind(this));
	}

	this.updateGraphics();
}

GraphicManager.prototype.setupHeatRace = function(race) {
	this.dataType = "HEAT_RACE";

	// Remove all containers in c2 that are eventually there
	d3.select(this.c21).remove();
	d3.select(this.c22).remove();	

	// Remove all containers in c5 that are eventually there
	d3.select(this.c5).selectAll(".container").remove();

	this.removeAllGraphs();

	if(this.maps.length > 0) {
		var map = this.maps[0];
		d3.csv("data/race.csv", function(error, data) {
			var hm = computeRace(data, race + " PEOPLE PERCENTAGE", ["LATINO","WHITE","BLACK","ASIAN","OTHER"], race, this.heatMapRaceColor,race + " PEOPLE PERCENTAGE");
			map.setHeatMap(hm);
			map.plotLegendInterpolatePercentage([map.heatMap.max,
						    					 map.heatMap.min], this.heatMapRaceColor);
			map.updateWindow();
		}.bind(this));
	}

	this.updateGraphics();

}

GraphicManager.prototype.setupHeatOrigin = function(origin) {
	this.dataType = "HEAT_ORIGIN";

	// Remove all containers in c2 that are eventually there
	d3.select(this.c21).remove();
	d3.select(this.c22).remove();	

	// Remove all containers in c5 that are eventually there
	d3.select(this.c5).selectAll(".container").remove();

	this.removeAllGraphs();

	if(this.maps.length > 0) {
		var map = this.maps[0];
		d3.csv("data/origin.csv", function(error, data) {
			var hm = computeOrigin(data, origin + " PEOPLE PERCENTAGE", ["ASIA","CENTRAL AMERICA","SOUTH AMERICA","EUROPE","OTHERS"], origin, this.heatOriginColor, origin + " PEOPLE PERCENTAGE");
			map.setHeatMap(hm);
			map.plotLegendInterpolatePercentage([map.heatMap.max,
						    					 map.heatMap.min], this.heatOriginColor);
			map.updateWindow();
		}.bind(this));
	}

	this.updateGraphics();
}

GraphicManager.prototype.updateGraphics = function() {
	// Updates drop down menus
	for(i in this.menus) {
		if(this.selectedAreas.length > i) {
			this.menus[i].property("selectedIndex", this.selectedAreas[i]);
		}
		else {
			this.menus[i].property("selectedIndex",0);
		}
	}

	// Update selected areas in maps
	var index = this.selectedAreas.slice();
	for(i in index) {
		if(+index[i] < 10) {
			index[i] = String(index[i]);
		}
		else if(+index[i] < 19) {
			index[i] -= 9;
			index[i] = "0"+String(index[i]);
		}
		else {
			index[i] -= 9;
			index[i] = String(index[i]);
		}
	}

	// Update maps
	for(i in this.maps) {
		this.maps[i].setSelected(index);

		this.maps[i].updateWindow();
	}
	for(i in this.worldMaps) {
		this.worldMaps[i].setSelected(this.selectedAreas);

		this.worldMaps[i].updateWindow();
	}
	// Update bar graphs
	for(i in this.bgs) {
		this.bgs[i].setRows(this.selectedAreas);
		this.bgs[i].updateWindow();
	}
	// Update city pie graph
	for(i in this.citypg) {
		this.citypg[i].updateWindow();
	}

	// Update the other pie graphs
	this.updatePieGraphs();	// Updates the number of pie graphs
	for(i in this.pgs) {
		this.pgs[i].updateWindow();
	}
	// Update tables
	for(t in this.tables) {
		var sa = this.selectedAreas.slice();
		sa.unshift(0);
		this.tables[t].setRows(sa);
		this.tables[t].updateWindow();
	}
}

GraphicManager.prototype.setLegend = function() {
	for(i in this.maps) {
		var map = this.maps[i];

		// Set the legend
		d3.csv("data/demographic.csv", function(error, data) {
			selectedNames = [];
			selectedColor = [];
			for(a in this.selectedAreas) {
				if(this.selectedAreas[a] < 10) {
					selectedNames.push(data[this.selectedAreas[a]]["NAME"]);
					selectedColor.push(this.districtColors[this.selectedAreas[a]-1]);
				}

			}
			selectedNames.push("Area selected");
			selectedColor.push(this.areaSelectedColor);
			map.plotLegend(selectedNames, selectedColor)
			map.updateWindow();
		}.bind(this));
	}
}

/*
	Called when an area on the map is selected
*/
GraphicManager.prototype.mapSelectArea = function(id) {
	var area;
	if(id.length == 2) {	// Comminity area
		area = (+id)+9;
	}
	else if(id.length == 1) {	// District
		area = (+id);
	}

	if(this.selectedAreas.indexOf(area) != -1)	// Unselect the area
		this.selectedAreas.splice(this.selectedAreas.indexOf(area), 1);
	else if(this.selectedAreas.length < 3)				// Select area
		this.selectedAreas.push(area);

	this.updateGraphics();
}

GraphicManager.prototype.removeAllGraphs = function() {
	// Remove the graphs from the divs
	for(i in this.bgs) {
		this.bgs[i].remove();
	}
	for(i in this.citypg) {
		this.citypg[i].remove();
	}
	for(i in this.pgs) {
		this.pgs[i].remove();
	}
	for(i in this.tables) {
		this.tables[i].remove();
	}

	// remove heatmaps
	for(m in this.maps) {
		this.maps[m].setHeatMap(null);
		this.maps[m].plotLegend([], []);
	}

	// Delete the graphs
	this.bgs = [];
	this.pgs = [];
}

GraphicManager.prototype.mapDeselectAll = function() {
	this.selectedAreas = [];
}


/*
	Called when the drop down menu change
*/
GraphicManager.prototype.menuChange = function(menu) {
	var index = [];
	var selectedIndex = [];
	for(m in this.menus) {
		index.push(this.menus[m].property("selectedIndex"));
	}
	// Removes all 0s
    for(var i=0; i<index.length; i++) {
    	if(index[i] != 0) {
    		selectedIndex.push(index[i]);
    	}
    }

    if(this.selectedAreas.indexOf(0) == -1)
    	this.selectedAreas = selectedIndex;
    else {
    	this.selectedAreas = selectedIndex;
    	this.selectedAreas.unshift(0);
    }


    this.setLegend();

    this.updateGraphics();
}

GraphicManager.prototype.setupMenu = function(menu) {
	// --------- Menu interaction ----------

	// Add callback to head menu buttons
	d3.selectAll("div.menu_button")
	  .on("click", function() {
	  	d3.selectAll("div.menu_button").attr("class", "container menu_button");
	  	d3.select(this).attr("class", d3.select(this).attr("class")+" selected");
	  });

	// Add dropdown menu options
	d3.csv("data/menu.csv", function(error, data) {
		if(error) {
			alert("Can't load demographic.csv");
		}

		// Prepare the data
		var dd = [];
		for(var d in data) {
			dd.push(data[d]);
		}
		dd[0] = "";

		d3.selectAll(".drop_down_menu")
		  .selectAll("option")
		  .data(dd)
		  .enter()
		  .append("option")
		  .attr("value",function(d){ return d["DISTRICT_AREA"];})
		  .text(function(d){ return d["NAME"];});

		d3.selectAll(".drop_down_menu")
		  .on("change", this.menuChange.bind(this));
	}.bind(this));
};

/*
	This function will insert one pie graph for every selected region (district/area)
*/
GraphicManager.prototype.updatePieGraphs = function(menu) {

	if(this.dataType == null)	// Do not need graphs
		return;

	// Select pie graph containers
	var container = d3.select(this.c5)
					  .selectAll(".container")
					  .data(this.selectedAreas);
	
	var pgs = this.pgs;

	// Create new containers
	container.enter()
			 .append("div")
			 .attr("class","container")
			 .style("height","100%")
			 .style("width", ""+(100.0/this.selectedAreas.length)+"%")
			 .each(function(d,i) {
			 	// Instanciate a new pie graph
			 	var pie = new PieGraph();
			 	d3.select(this).attr("id","container"+(100+i));
			 	pie.setup("#container"+(100+i),"PIE GRAPH",[], d)

			 	pgs.push(pie);			
			 });

	// Update all containers
	container.style("width", ""+(100.0/this.selectedAreas.length)+"%");

	// Delete unused containers
	container.exit()
			 .remove();

	// Remove unused pie graphs
	this.pgs = this.pgs.filter(function(d, i){
		if(i < this.selectedAreas.length + 1)
			return true;
		else {
			d.remove();
			return false;
		}
	}.bind(this));

	switch(this.dataType) {
		case "GENDER":
			for(a in this.selectedAreas) {
				var p = a;	// The first pgs is for the whole city
				this.pgs[p].dataFile("data/demographic.csv");
				this.pgs[p].title = "GENDER - %s";
				this.pgs[p].setRow(this.selectedAreas[a]);
				this.pgs[p].setColumns(["MALE","FEMALE"]);
				this.pgs[p].color = d3.scale.ordinal().range(this.genderColors);
			}
			// Delete all pie charts that are not associated to a container
			this.pgs = this.pgs.filter(function(d, i){
				if(i<this.selectedAreas.length)
					return true;
				else
					return false;
			}.bind(this));
			break;
		case "AGE":
			for(a in this.selectedAreas) {
				var p = a;	// The first pgs is for the whole city
				this.pgs[p].dataFile("data/demographic.csv");
				this.pgs[p].title = "AGE - %s";
				this.pgs[p].setRow(this.selectedAreas[a]);
				this.pgs[p].setColumns(["0-9","10-18","19-21","22-30","31-50","51-70","71+"]);
				this.pgs[p].color = d3.scale.ordinal().range(this.ageColors);
			}
			// Delete all pie charts that are not associated to a container
			this.pgs = this.pgs.filter(function(d, i){
				if(i<this.selectedAreas.length)
					return true;
				else
					return false;
			}.bind(this));
			break;
		case "RACE":
			for(a in this.selectedAreas) {
				var p = a;	// The first pgs is for the whole city
				this.pgs[p].dataFile("data/race.csv");
				this.pgs[p].title = "RACE - %s";
				this.pgs[p].setRow(this.selectedAreas[a]);
				this.pgs[p].setColumns(["LATINO","WHITE","BLACK","ASIAN","OTHER"]);
				this.pgs[p].color = d3.scale.ordinal().range(this.raceColors);
			}
			// Delete all pie charts that are not associated to a container
			this.pgs = this.pgs.filter(function(d, i){
				if(i<this.selectedAreas.length)
					return true;
				else
					return false;
			}.bind(this));
			break;
		case "ORIGIN":
			for(a in this.selectedAreas) {
				var p = a;	// The first pgs is for the whole city
				this.pgs[p].dataFile("data/origin.csv");
				this.pgs[p].title = "ORIGIN - %s";
				this.pgs[p].setRow(this.selectedAreas[a]);
				this.pgs[p].setColumns(["ASIA","CENTRAL AMERICA","SOUTH AMERICA","EUROPE","OTHERS"]);
				this.pgs[p].color = d3.scale.ordinal().range(this.originColors);
			}
			// Delete all pie charts that are not associated to a container
			this.pgs = this.pgs.filter(function(d, i){
				if(i<this.selectedAreas.length)
					return true;
				else
					return false;
			}.bind(this));
			break;
		default:
	}
}