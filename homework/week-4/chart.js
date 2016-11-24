var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 100, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// //set margins
// var margin = {top: 20, right: 30, bottom: 30, left: 40},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

// //set ordinal scale
// var x = d3.scale.ordinal()
//     .rangeRoundBands([0, width], .1);

// // set linear y scale
// var y = d3.scale.log()
//     .range([height, 0]);

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

   g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
      


  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Emmission");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Country); })
      .attr("y", function(d) { return y(d.Data); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.Data); });
});


  

// var bar = chart.selectAll("g")
//       .data(data)
//       .attr("class", "bar")
//     .enter().append("g")
//       .attr("transform", function(d) { return "translate(" + x(d.Country) + ",0)"; });

// 	bar.append("rect")
//       .attr("y", function(d) { return y((d.Data)); })
//       .attr("height", function(d) { return height - y((d.Data)); })
//       .attr("width", x.rangeBand());

//   	bar.append("text")
//       .attr("x", x.rangeBand() / 2)
//       .attr("y", function(d) { return y(d.Data) + 3; })
//       .attr("dy", ".75em")
//       .text(function(d) { return d.Data; });

//     chart.selectAll(".bar")
//       .data(data)
//     .enter().append("rect")
//       .attr("class", "bar")
//       .attr("x", function(d) { return x(d.Country); })
//       .attr("y", function(d) { return y((d.Data)); })
//       .attr("height", function(d) { return height - y((d.Data)); })
//       .attr("width", x.rangeBand());


// 	chart.append("g")
// 	  .attr("class", "x axis")
// 	  .attr("transform", "translate(0," + height + ")")
// 	  .call(xAxis);

//   	chart.append("g")
//       .attr("class", "y axis")
//       .call(yAxis);

// 	chart.append("g")
// 	    .attr("class", "y axis")
// 	    .call(yAxis)
// 	  .append("text")
// 	    .attr("transform", "rotate(-90)")
// 	    .attr("y", 6)
// 	    .attr("dy", ".71em")
// 	    .style("text-anchor", "end")
// 	    .text("Frequency");

// });

// function type(d) {
//   d.Data = +d.Data; // coerce to number
//   return d;
// }
