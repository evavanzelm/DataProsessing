// //set margins
// var margin = {top: 20, right: 30, bottom: 30, left: 40},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;


var width = 960,
    height = 500;

//set ordinal scale
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// set linear y scale
var y = d3.scale.log()
    .range([height, 0]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

// // create axis variables
// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");


// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
//     .ticks(10, "%");

// var chart = d3.select(".chart")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// reading in data
d3.json("data.json", function(error, data) {

	for (var i = 0; i < data.length; i++){
		data[i].Data = +data[i].Data;
	}

	console.log(data);
  x.domain(data.map(function(d) { return d.Country; }));
  y.domain([0, d3.max(data, function(d) { return d.Data; })]);

   
  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x(d.Country) + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return y(d.Data); })
      .attr("height", function(d) { return height - y(d.Data); })
      .attr("width", x.rangeBand());

  bar.append("text")
      .attr("x", x.rangeBand() / 2)
      .attr("y", function(d) { return y(d.Data) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d.Data; });
});