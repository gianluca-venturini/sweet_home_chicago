function Table() {
}

/*
	tag: the id of the div in which you want to insert the graphic
	title: the title of the table
	columns: the comlumns in data that must be displayed
	rows: the rows in data that must be taken from the file and displayed
*/
Table.prototype.setup = function(tag, title, rows, cols) {
	this.myTag = tag;
	this.title = title;
	this.rows = rows;
	this.cols = cols;

	this.table = d3.select(this.myTag)
					.append("table")
					.attr("style","width:100%")
					.attr("class","container");

	

}

Table.prototype.dataFile = function(file) {
	this.file = file;
}

Table.prototype.updateWindow = function() {

    d3.csv(this.file, this.dataCallback.bind(this));
}

Table.prototype.setRows = function(rows) {

    this.rows = rows;
}

Table.prototype.dataCallback = function(error, data) {
	if(error)
		alert("Can't open the file "+this.file)

	this.table.selectAll("thead").remove();
	this.table.selectAll("tbody").remove();

	this.thead = this.table.append("thead");
    this.tbody = this.table.append("tbody");

	// Select the data we need
	var dd = [];
	for(var row in this.rows) {
		dd.push(data[this.rows[row]]);
	}

	// Append a special element that will be the names
	var keys = d3.keys(dd[0]);
	var element = {};
	for(k in keys) {
		element[keys[k]] = keys[k];
	}
	element[""+keys[0]] = this.title;
	dd.unshift(element);

    this.thead.append("tr")
        .selectAll("th")
        .data(dd)
        .enter()
        .append("th")
        .text(function(d) { return d["NAME"]; });	// TODO: add HUMAN READABLE NAME

    // create a row for each object in the data
    var rows = this.tbody.selectAll("tr")
        .data(this.cols)
        .enter()
        .append("tr");



    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return dd.map(function(column) {
                return {column: column, value: column[row]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
            .html(function(d) { return d.value; });

}

Table.prototype.remove = function() {
	d3.select(this.myTag).selectAll("table").remove();
}