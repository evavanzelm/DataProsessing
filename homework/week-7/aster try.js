/*
Renders a map with 5 categories of child birth rate
Eva van Zelm
*/

// data arrays
var countryColor = {},
    asterData = [],
    lengthAsterData = 0;

// variables for pie chart
var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(function (d) { 
    return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
  });

var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

var svg = d3.select("aster")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// import data
d3.json("data.json", function(data) {
    for (var i = 0; i < data.length; i++){

        // make array for filling in countries
        if (data[i].ISC11_LEVEL_CAT == "L5T8" && data[i].Field == "total") {

            data[i].Value = +data[i].Value;

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
    }

    // make a array for an aster plot
    for (var i = 0; i < data.length; i++){

        if (data[i].ISC11_LEVEL_CAT == "L5T8") {

             data[i].Value = +data[i].Value;

            if (data[i].Field == "Education") {
                asterData.push({country: data[i].COUNTRY, field: data[i].Field, order : 1, value: data[i].Value, weight: 1, color: "#f7f4f9"})
            }
            else if (data[i].Field == "Humanities and arts") {
                asterData.push({country: data[i].COUNTRY, field: data[i].Field, order : 2, value: data[i].Value, weight: 1, color: "#e7e1ef"})
                i++;
            }
            else if (data[i].Field == "Social sciences, business and law") {
                asterData.push({country: data[i].COUNTRY, field: data[i].Field, order : 3, value: data[i].Value, weight: 1, color: "#d4b9da"})
                i++;
            }
            else if (data[i].Field == "Science, mathematics and computing") {
                asterData.push({country: data[i].COUNTRY, field: data[i].Field, order : 4, value: data[i].Value, weight: 1, color: "#c994c7"})
                i++;
            }
            else if (data[i].Field == "Engineering, manufacturing and construction") {
                asterData.push({country: data[i].COUNTRY, field: data[i].Field, order : 5, value: data[i].Value, weight: 1, color: "#df65b0"})
                i++;
            }
            else if (data[i].Field == "Agriculture and veterinary") {
                asterData.push({country: data[i].COUNTRY, field: data[i].Field, order : 6, value: data[i].Value, weight: 1, color: "#e7298a"})
                i++;
            }
            else if (data[i].Field == "Health and Welfare") {
                asterData.push({country: data[i].COUNTRY, field: data[i].Field, order : 7, value: data[i].Value, weight: 1, color: "#ce1256"})
                i++;
            }
            else if (data[i].Field == "Services") {
                asterData.push({country: data[i].COUNTRY, field: data[i].Field, order : 8, value: data[i].Value, weight: 1, color: "#91003f"})
                i++;
            }
        }
    }

    // determine colors for categories
    var fillkey = {
        defaultFill: "#bdd7e7",
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
            'Birth Rate:' + data.data + ' </strong></div>';
        },
            highlightBorderColor: '#08519c',
            highlightFillColor: '#3182bd'
        },

        // fill the map
        fills: fillkey,
        data: countryColor,

        done: function(map) {
            // array for current aster
            
            curAster = [];

            map.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
  
                for (var i = 0; i < asterData.length; i++){


                    if (asterData[i].country == geo.id){
                        curAster.push(asterData[i])
                    }
                }
                drawAster(curAster)



            })
        }

    });

    // make the legend
    map.legend();


});

function drawPlot(data) {
    
}