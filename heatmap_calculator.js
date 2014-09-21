/*
	This is a set of routines that produces heatmaps given data

	HEATMAP STRUCTURE:
	 {name: "Heat Map",
	  colors: ["#FF00FF","#FF0000","#00FF00","#0000FF"],
	  legend: ["MALE","FEMALE"],
	  max: 1234,
	  min: 1234,
	  areas: [{
	  			id: "01",
	  			value: "0.2"
	  		  },
	  		  {
	  			id: "02",
	  			values: ["0.1","0.1","0.4","0.4"]
	  		  }
	  ]}; 
*/


function computePeopleUnder(data, name, columns, totalColumns, colors, legend) {
	var areas =	[];
	var min = Number.MAX_VALUE;
	var max = Number.MIN_VALUE;

	for(d in data) {
		if(d < 10)		// Doesn't take into account city and districts
			continue;

		var id = data[d]["DISTRICT_AREA"];

		// calculate the value
		var sum = 0;
		var totalSum = 0;
		for(c in columns) {
			sum += +data[d][columns[c]];
		}
		for(c in totalColumns) {
			totalSum += +data[d][totalColumns[c]];
		}

		// Normalize the sum
		sum /= totalSum;

		if(sum > max)
			max = sum;
		if(sum < min)
			min = sum;
		areas.push({id: id, sum: sum});
	}

	for(a in areas) {
		areas[a].value = (areas[a].sum - min) / (max-min);
	}

	return { name: name,
	  		 colors: colors,
	  		 legend: legend,
	  		 max: max,
	  		 min: min,
	  		 areas: areas
	  		};
}

function computeDensityPopulation(data, name, totalColumns, colors, legend) {
	var areas =	[];
	var min = Number.MAX_VALUE;
	var max = Number.MIN_VALUE;

	for(d in data) {
		if(d < 10)		// Doesn't take into account city and districts
			continue;

		var id = data[d]["DISTRICT_AREA"];
		var surfaceArea = data[d]["SURFACE"];

		// sum the population of each area
		var sum = 0;
		var totalSum = 0;
		for(c in totalColumns) {
			sum += +data[d][totalColumns[c]];
		}

		// Normalize the sum
		sum /= surfaceArea;

		if(sum > max)
			max = sum;
		if(sum < min)
			min = sum;
		areas.push({id: id, sum: sum});
	}

	for(a in areas) {
		areas[a].value = (areas[a].sum - min) / (max-min);
	}

	return { name: name,
	  		 colors: colors,
	  		 legend: legend,
	  		 max: max,
	  		 min: min,
	  		 areas: areas
	  		};

}

function computeAgeAverage(data, name, totalColumns, colors, legend) {
	var areas =	[];
	var min = Number.MAX_VALUE;
	var max = Number.MIN_VALUE;

	for(d in data) {
		if(d < 10)		// Doesn't take into account city and districts
			continue;

		var id = data[d]["DISTRICT_AREA"];

		// sum the population of each area
		var sum = 0;		// Age sum
		var totalSum = 0;	// Population sum
		for(c in totalColumns) {
			totalSum += +data[d][totalColumns[c]];
			if(totalColumns[c] == "70+")
				sum += +data[d][totalColumns[c]] * 80;	// Hypothesis: people 70+ have average of 80
			else if(totalColumns[c] == "0-9")
				sum += +data[d][totalColumns[c]] * 4.5;
			else
				sum += +data[d][totalColumns[c]] * (+totalColumns[c].substring(0,2) + +totalColumns[c].substring(3,6)) / 2;
		}

		// Normalize the sum
		sum /= totalSum;

		if(sum > max)
			max = sum;
		if(sum < min)
			min = sum;
		areas.push({id: id, sum: sum});
	}

	for(a in areas) {
		areas[a].value = (areas[a].sum - min) / (max-min);
	}

	return { name: name,
	  		 colors: colors,
	  		 legend: legend,
	  		 max: max,
	  		 min: min,
	  		 areas: areas
	  		};

}

function computeRace(data, name, columns, raceColum, colors, legend) {
	var areas =	[];
	var min = Number.MAX_VALUE;
	var max = Number.MIN_VALUE;

	for(d in data) {
		if(d < 10)		// Doesn't take into account city and districts
			continue;

		var id = ""+data[d]["DISTRICT_AREA"];

		// sum the population of each area
		var sum = 0;
		var totalSum = 0;
		for(c in columns) {
			totalSum += +data[d][columns[c]];
		}
		sum = +data[d][raceColum];

		// Normalize the sum
		sum /= totalSum;

		if(sum > max)
			max = sum;
		if(sum < min)
			min = sum;
		areas.push({id: id, sum: sum});
	}

	for(a in areas) {
		areas[a].value = (areas[a].sum - min) / (max-min);
	}

	return { name: name,
	  		 colors: colors,
	  		 legend: legend,
	  		 max: max,
	  		 min: min,
	  		 areas: areas
	  		};
}

function computeOrigin(data, name, columns, originColum, colors, legend) {
	var areas =	[];
	var min = Number.MAX_VALUE;
	var max = Number.MIN_VALUE;

	for(d in data) {
		if(d < 10)		// Doesn't take into account city and districts
			continue;

		var id = ""+data[d]["DISTRICT_AREA"];

		// sum the population of each area
		var sum = 0;
		var totalSum = 0;
		for(c in columns) {
			totalSum += +data[d][columns[c]];
		}
		sum = +data[d][originColum];

		// Normalize the sum
		sum /= totalSum;

		if(sum > max)
			max = sum;
		if(sum < min)
			min = sum;
		areas.push({id: id, sum: sum});
	}

	for(a in areas) {
		areas[a].value = (areas[a].sum - min) / (max-min);
	}

	return { name: name,
	  		 colors: colors,
	  		 legend: legend,
	  		 max: max,
	  		 min: min,
	  		 areas: areas
	  		};
}

