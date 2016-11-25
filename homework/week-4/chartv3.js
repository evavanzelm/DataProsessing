//set margins
var margin = {top: 20, right: 50, bottom: 140, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//set ordinal scale
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// set linear y scale
var y = d3.scale.linear()
    .range([height, 0]);

// create axis variables
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Emission:</strong> <span style='color:#b10026'>" + d.Data + "</span>";
  })

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.call(tip);

// reading in data
d3.json("data.json", function(data) {

  for (var i = 0; i < data.length; i++){
    data[i].Data = +Math.round(data[i].Data);
  }

  console.log(data);
  x.domain(data.map(function(d) { return d.Country; }));
  y.domain([0, d3.max(data, function(d) { return d.Data; })]);

  chart.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis)
     .selectAll("text") 
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", - 60)

    .style("text-anchor", "end")
    .text("Average anual carbon emmission (million metric tons)");

  chart.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.Country); })
    .attr("y", function(d) { return y((d.Data)); })
    .attr("height", function(d) { return height - y((d.Data)); })
    .attr("width", x.rangeBand())
    // .on('mouseover', tip.show)
    // .on('mouseout', tip.hide)
    .on("mouseover",  function(d) {
      tip.show(d)
      d3.select(this).attr("r", 10).style("fill", "#b10026");
    })                  
    .on("mouseout", function(d) {
       tip.hide(d)
      d3.select(this).attr("r", 5.5).style("fill", "#1c9099");
    });


  });


