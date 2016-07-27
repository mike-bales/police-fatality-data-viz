var data;
var margin = { top: 15, right: 15, bottom: 40, left: 60 };
var width = 840 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

//DATE FORMATTER

var dateParser = d3.timeParse("%Y-%m-%d");

// Declaring our constants


// d3.queue() enables us to load multiple data files. Following the example below, we make
// additional .defer() calls with additional data files, and they are returned as results[1],
// results[2], etc., once they have all finished downloading.
d3.queue()
  .defer(d3.json, 'data/polviol.json')
  .awaitAll(function (error, results) {
    if (error) { throw error; }
    data = results[0];

    var chart = new Chart();
  });


function Chart() {
    var chart = this;

    // SVG

    chart.svg = d3.select('#chart')
      .append('svg')
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "lightgrey")
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // SCALES

    chart.x = d3.scaleTime()
          .domain([new Date(2013, 0, 1), new Date(2016, 0, 1)])
          .range([0, width])
          .nice();
    

    console.log(dateParser("2017-07-26"))
    // AXES

    var xAxis = d3.axisBottom()
                  .scale(chart.x);


    chart.svg.append("g")
       .attr("class", "axis") 
       .attr("transform", "translate(0," + (height) + ")")
       .call(xAxis);

    // NEST DATA 

    var vicsByDate = d3.nest()
                       .key(function(d) { return d.deathDate})
                       .entries(data);

    var dateGroup = chart.svg.selectAll("g")
                             .data(vicsByDate)
                             .enter().append("g");

    var victims = dateGroup.selectAll("rect")
                           .data(function(d) {return d.values; })
                           .enter().append("rect")
                           .attr("x", function(d) { return chart.x(dateParser(d.deathDate))} )
                           .attr("y", function(d, i) { return (i*5)+1})
                           .attr("height", 10)
                           .attr("width", 10);
    


  }
