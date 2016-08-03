var data,
    margin = { top: 30, right: 15, bottom: 30, left: 15 },
    cellSize = 3,
    width = (cellSize*365+365) - margin.left - margin.right,
    height = 85 - margin.top - margin.bottom
    years = [2013, 2014, 2015];

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

    var chart1 = new Chart();
        //chart2 = new Chart(2014),
        //chart3 = new Chart(2015);
  });


function Chart() {
    var chart = this;

    // VICTIM DETAILS DIV

    var div = d3.select(".details")
                .selectAll("p");


    // SVG

    chart.svg = d3.select('#chart')
                  .append('svg')
                  .attr("width", width + margin.right + margin.left)
                  .attr("height", (height + margin.top + margin.bottom)*4)
                  .style("background", "lightgrey")
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  for (var i = 0; i < 3; i++) {

    txData = data.slice();

    txData = txData.filter(function (d) {
        return yearFormat(dateParser(d.deathDate)) === years[i].toString();
      }); 

    // SCALES

    x = d3.scaleTime()
                .domain([new Date(years[i], 0, 1), new Date(years[i] + 1, 0, 1)])
                .range([0, width])
                .nice();
    

    // AXES

    var xAxis = d3.axisBottom()
                  .scale(x);

    chart.svg.append("g")
             .attr("class", "axis") 
             .attr("transform", "translate(0," + ((height+margin.top) * (i+2)) + ")")
             .call(xAxis);

    // NEST DATA 

    var vicsByDate = d3.nest()
                       .key(function(d) { return d.deathDate;})
                       .entries(txData);


    var dateGroup = chart.svg.selectAll(".day")
                             .data(vicsByDate, function (d) { return d.deathDate;});

                             dateG = dateGroup.enter().append("g")
                             .attr("transform", "translate(0," + (((height+margin.top) * (i+2)) - cellSize) + ")")
                             .attr("class", "day");
console.log(dateGroup);



    var victims = dateG.selectAll(".victim")
                           .data(function(d) {return d.values; }, function(d) { return d.name });

                           victims.enter().append("rect")
                           .attr("class", "victim")
                           .attr("x", function(d) { return x(dateParser(d.deathDate))} )
                           .attr("y", function(d,i) { return -(i*cellSize)-(i+1)})
                           .attr("rx", .5)
                           .attr("ry", .5)
                           .attr("height", cellSize)
                           .attr("width", cellSize)
                           .attr("class", function(d) { return d.status})
                           .on("mouseover", function(d) {    
                                       d3.select("#vic-name")
                                         .html(d.name);

                                       d3.select("#vic-age")
                                         .html(d.age);

                                       d3.select("#vic-cause")
                                         .html(d.cause);

                                       d3.select("#vic-date")
                                         .html(d.deathDate);  
                                      })          
                           .on("mouseout", function(d) {   
                               
                                     })
                           
  };                            
}
