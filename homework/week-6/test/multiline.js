/*
Simple line 
Eva van Zelm
*/
// margins
var margin = {top: 30, right: 20, bottom: 80, left: 65},
    width = 900 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// parse the date
var parseDate = d3.time.format("%Y%m%d").parse;
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return  formatValue(d) + "\xB0C"; }

// set ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, -5]);

// define the axis
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(12);
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10)

// Define the line
var line_av = d3.svg.line()
    .x(function(data) { return x(data.date); })
    .y(function(data) { return y(data.average); });

var line_min = d3.svg.line()
    .x(function(data) { return x(data.date); })
    .y(function(data) { return y(data.min); });

var line_max = d3.svg.line()
    .x(function(data) { return x(data.date); })
    .y(function(data) { return y(data.max); });

// ad svg and g
var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// get the data 
d3.json("data.json", function(data) {
  console.log("hallo")

	data.forEach(function(d){
		// making numbers of strings
		d.date = parseDate(d.date)
		d.average = +d.average / 10
    d.min = +d.min / 10
    d.max = +d.max / 10
	});


	x.domain(d3.extent(data, function(data) { return data.date; }));
  y.domain([-10, d3.max(data, function(data) { return data.max; })]);

    // add the line
    svg.append("path")
        .attr("class", "line")
        .attr("id", "av")
        .attr("d", line_av(data));

    // add the line
    svg.append("path")
        .attr("class", "line")
        .attr("id", "min")
        .attr("d", line_min(data));

        // add the line
    svg.append("path")
        .attr("id", "max")
        .attr("d", line_max(data));


    // add the axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
  		    .attr("y", 0)
  		    .attr("x", 9)
  		    .attr("dy", ".35em")
  		    .attr("transform", "rotate(45)")
  		    .style("text-anchor", "start");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -50)
      .attr("x", -200)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Temperatur (\xB0C)");


    // crosshair1
    var focus1 = svg.append("g")
      .attr("class", "focus")
      .attr("id", "one")
      .style("display", "none");

    	focus1.append("circle")
        	.attr("r", 4.5);

    	focus1.append("text")
      	.attr("x", 9)
      	.attr("dy", ".35em");

    	svg.append("rect")
        	.attr("class", "overlay")
        	.attr("width", width)
        	.attr("height", height)
        	.on("mouseover", function() { focus1.style("display", null); })
        	.on("mouseout", function() { focus1.style("display", "none"); })
        	.on("mousemove", mousemove);



    // crosshair1
    var focus2 = svg.append("g")
      .attr("class", "focus")
      .attr("id", "two")
      .style("display", "none");

      focus2.append("circle")
          .attr("r", 4.5);

      focus2.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

      svg.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() { focus2.style("display", null); })
          .on("mouseout", function() { focus2.style("display", "none"); })
          .on("mousemove", mousemove);


      function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      focus1.attr("transform", "translate(" + x(d.date) + "," + y(d.average) + ")");
      focus1.select("text").text(formatCurrency(d.average));

      focus2.attr("transform", "translate(" + x(d.date) + "," + y(d.min) + ")");
      focus2.select("text").text(formatCurrency(d.min));
    }


});