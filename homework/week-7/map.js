/*
Renders a map, bargraph and piecharts 
Eva van Zelm
*/

// data arrays
var countryColor = {},
    pieData = [];
    barData = [];

var fieldsEducation = ["Education", "Humanities and arts", "Economic and social", "Science and informatics", "Engineering", "Agriculture", "Health and Welfare", "Services"];

// import data
d3.json("data.json", function(data) {
    for (var i = 0; i < data.length; i++){
        // change all values to nubmer
        data[i].Value = +data[i].Value;

        // make array for filling in countries
        if (data[i].ISC11_LEVEL_CAT == "L5T8" && data[i].Field == "total") {     
            if (data[i].Value < 50){
                countryColor[data[i].COUNTRY] = { fillKey : "a", data : data[i].Value}
            }
            else if (data[i].Value < 60){
                countryColor[data[i].COUNTRY] = { fillKey : "b", data : data[i].Value}
            }
            else if (data[i].Value < 100){
                countryColor[data[i].COUNTRY] = { fillKey : "c", data : data[i].Value}
            }
        }
    
        if (data[i].ISC11_LEVEL_CAT == "L5T8" && data[i].Field != "total") {
            pieData.push({country: data[i].COUNTRY, field: data[i].Field, women: data[i].Value, men: 100 - data[i].Value})
        }

        if (data[i].Field != "total" && data[i].ISC11_LEVEL_CAT != "L5T8" ) {
            barData.push({country: data[i].COUNTRY, field: data[i].Field, women: data[i].Value, level: data[i].ISC11_LEVEL_CAT})
        }
    }

    // determine colors for categories
    var fillkey = {
        defaultFill: "#969696",
        a: "#e7e1ef",
        b: "#c994c7",
        c: "#dd1c77",
    }
    // make a map
    var map = new Datamap({
        element: document.getElementById("map"),
        projection: 'mercator',

        // show the data in the pop up 
        geographyConfig: {
        popupTemplate:  function(geography, data){
            return '<div class = hoverinfo><strong>' + geography.properties.name + '</strong></div><div class = hoverinfo><strong>' + 
            'percentage women: ' + data.data + ' </strong></div>';
        },
            highlightBorderColor: '#08519c',
            highlightFillColor: '#3182bd'
        },

        // fill the map
        fills: fillkey,
        data: countryColor,

        done: function(map) {
            // array for current aster
            map.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
                
                curPie = [];
                curBar = {};

                for (var i = 0; i < fieldsEducation.length; i++){
                    curBar[fieldsEducation[i]] = [];
                }


                for (var i = 0; i < pieData.length; i++){
                    if (pieData[i].country == geo.id){
                        curPie.push(pieData[i])
                    }
                }

                for (var i = 0; i < barData.length; i++){
                    if (barData[i].country == geo.id){
                        for (var j = 0; j < fieldsEducation.length; j++){
                            if (barData[i].field == fieldsEducation[j]){
                                curBar[fieldsEducation[j]].push({"level" :barData[i].level, "percentage" :barData[i].women})
                            }
                        }
                    }
                }

                for (d in curBar){
                    if (curBar[d].length == 0){
                        delete curBar[d];
                    }
                }
    
                drawPlot(curPie)
                drawBar(curBar)
            })
        }

    });

    // make the legend
    map.legend();


});

function drawPlot(array) {
    var vis = d3.select('#pie')
    vis.selectAll("*").remove()

    // variables pie
    var w =150;
    var h =150;
    var r = h/2;
    var aColor = [
        "#d4b9da",
        "#a6bddb",
    ]

    for (var i = 0; i < array.length; i++){
        var data = [
            {"label":"women", "value": Math.round(array[i].women)}, 
            {"label": "men", "value": Math.round(array[i].men)},
        ];

        var vis = d3.select('#pie').append("svg:svg").attr("class", "piechart").data([data]).attr("width", w ).attr("height", h + 50 ).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");

        var pie = d3.layout.pie().value(function(d){return d.value;});

        // Declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // Select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");

        arcs.append("svg:path")
            .attr("fill", function(d, i){return aColor[i];})
            .attr("d", function (d) {return arc(d);})
        ;

        // Add the text
        arcs.append("svg:text")
            .attr("transform", function(d){
                d.innerRadius = 30; /* Distance of label to the center*/
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";}
            )
            .attr("text-anchor", "middle")
            .text( function(d, i) {return data[i].value + '%';})

        vis.append("text")
            .attr("y",  100)
            .style("text-anchor", "middle")
            .text(array[i].field);


    }
}

function drawBar(data) {



var svg = d3.select('#bar')
svg.selectAll("*").remove()

var margin = {top: (parseInt(d3.select('#bar').style('width'), 10)/10), right: (parseInt(d3.select('body').style('width'), 10)/20), bottom: (parseInt(d3.select('body').style('width'), 10)/5), left: (parseInt(d3.select('body').style('width'), 10)/20)},
width = parseInt(d3.select('#bar').style('width'), 10) - margin.left - margin.right,
height = parseInt(d3.select('#bar').style('height'), 10) - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var colorRange = d3.scale.category20();
var color = d3.scale.ordinal()
    .range(colorRange.range());

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("#bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

dataset = [];
levels = [];

for (d in data){
    if (data[d].length < 3) {
        levels.push(data[d][0].level)
    }
}

for (d in data){
    if (levels.includes("L6") == false){
        data[d].push({"level" :"L6", "percentage" :"0"})
    }
    if (levels.includes("L7") == false){
        data[d].push({"level" :"L7", "percentage" :"0"})
    } 
    if (levels.includes("L7") == false){
        data[d].push({"level" :"L7", "percentage" :"0"})
    } 
}

for (d in data){
    dataset.push({label: d, "Bachelor": data[d][0].percentage, "Master": data[d][1].percentage, "Doctoral": data[d][2].percentage})  
}

if (dataset.length == 0){
    console.log(dataset.length)
}
else{
    var options = d3.keys(dataset[0]).filter(function(key) { return key !== "label"; });

    dataset.forEach(function(d) {
        d.valores = options.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(dataset.map(function(d) { return d.label; }));
    x1.domain(options).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(dataset, function(d) { return d3.max(d.valores, function(d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", -20)
            .attr("dy", ".35em")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -30)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Amount of femal graduates (%)");

    var bar = svg.selectAll(".bar")
        .data(dataset)
        .enter().append("g")
        .attr("class", "rect")
        .attr("transform", function(d) { return "translate(" + x0(d.label) + ",0)"; });

    bar.selectAll("rect")
        .data(function(d) { return d.valores; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("value", function(d){return d.name;})
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(options.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
        .attr("y", 200)
        .attr("x", 100);

    legend.append("rect")
        .attr("x", width + -10)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width + 12)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });
    }
}

    
