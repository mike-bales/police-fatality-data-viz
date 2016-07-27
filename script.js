var data,
    margin = { top: 15, right: 15, bottom: 40, left: 15 },
    width = 1460 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom,
    cellSize = 3;

//DATE PARSER

var dateParser = d3.timeParse("%Y-%m-%d"),
    yearFormat = d3.timeFormat("%Y");


// Declaring our constants


// d3.queue() enables us to load multiple data files. Following the example below, we make
// additional .defer() calls with additional data files, and they are returned as results[1],
// results[2], etc., once they have all finished downloading.
d3.queue()
  .defer(d3.json, 'data/polviol.json')
  .awaitAll(function (error, results) {
    if (error) { throw error; }
    data = results[0];

    var chart1 = new Chart(2013),
        chart2 = new Chart(2014);
  });


function Chart(year) {
    var chart = this;

    txData = data.slice();

    txData = txData.filter(function (d) {
        return yearFormat(dateParser(d.deathDate)) === year.toString();
      }); 



    // SVG

    chart.svg = d3.select('#chart')
      .append('svg')
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      //.style("background", "lightgrey")
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // SCALES

    chart.x = d3.scaleTime()
          .domain([new Date(year, 0, 1), new Date(year + 1, 0, 1)])
          .range([0, width])
          .nice();
    
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
                       .entries(txData);

    var dateGroup = chart.svg.selectAll("g")
                             .data(vicsByDate)
                             .enter().append("g")
                             .attr("transform", "translate(0," + (height - 5) + ")");

    var victims = dateGroup.selectAll("rect")
                           .data(function(d) {return d.values; })
                           .enter().append("rect")
                           .attr("x", function(d) { return chart.x(dateParser(d.deathDate))} )
                           .attr("y", function(d,i) { return -(i*cellSize)-(i+1)})
                           .attr("rx", .5)
                           .attr("ry", .5)
                           .attr("height", cellSize)
                           .attr("width", cellSize)
                           .attr("class", function(d) { return d.status});
    
  }
