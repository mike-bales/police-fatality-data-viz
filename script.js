var data,
    margin = { top: 10, right: 15, bottom: 30, left: 15 },
    cellSize = 3,
    width = (cellSize*365+365) - margin.left - margin.right,
    height = 85 - margin.top - margin.bottom
    years = [2013, 2014, 2015];

var options = {
  cause: false
}

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
    if (error) { throw error; };
    data = results[0];

    var chart1 = new Chart();
    chart1.update();
  });


function Chart() {


    var chart = this;

    // SVG

    chart.svg = d3.select('#chart')
                  .append('svg')
                  .attr("width", width + margin.right + margin.left)
                  .attr("height", (height + margin.top + margin.bottom)*4)
                  //.style("background", "lightgrey")
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  for (var i = 0; i < years.length; i++) {

    // SCALES

    chart.x = d3.scaleTime()
                .domain([new Date(years[i], 0, 1), new Date(years[i] + 1, 0, 1)])
                .range([0, width])
                .nice();

    // CREATE YEAR GROUP FOR EACH CHART AND SET POSITION

    yearGroup = chart.svg.append("g")
     .attr("id", "_"+years[i])
     .attr("transform", "translate(0," + ((height+(margin.top*2)) * (i+1)) + ")")

    // AXES

    var xAxis = d3.axisBottom()
                  .scale(chart.x);

    yearGroup.append("g")
             .attr("class", "axis") 
             .call(xAxis);

    
                                              
  };                            
}

  Chart.prototype.update = function() {

          var chart = this;

  for (var i = 0; i < years.length; i++) {

    // FILTER DATA BY YEAR

    txData = data.slice();

    txData = txData.filter(function (d) {
        return yearFormat(dateParser(d.deathDate)) === years[i].toString();
      }); 

    if (options.cause) {
      txData = txData.filter(function (d) {
        return d.cause == options.cause
      })
    }
  
// NEST DATA 

    var vicsByDate = d3.nest()
                       .key(function(d) { return d.deathDate;})
                       .entries(txData);

    // CREATE GROUP FOR EACH DAY

    var dateGroup = d3.select("#_"+ years[i])
                     .selectAll(".day")
                     .data(vicsByDate, function (d) { return d.deathDate;})
                     .enter().append("g")
                     .attr("class", "day")
                     .attr("transform","translate(0," + (-cellSize) + ")");
console.log(dateGroup); 

    // CREATE RECTS FOR VICTIM WITHIN EACH DAY

    var victims = dateGroup.selectAll(".victim")
                           .data(function(d) {return d.values; }, function(d) { return d.name });

                           victims.enter().append("rect")
                           .attr("class", "victim")
                           .attr("class", function(d) { return d.status})
                           .attr("x", function(d) { return chart.x(dateParser(d.deathDate))} )
                           .attr("y", function(d,i) { return -(i*cellSize)-(i+1)})
                           .attr("height", 0)
                           .attr("width", 0)
                           .attr("rx", .5)
                           .attr("ry", .5)
                           .on("mouseover", function(d) {    
                                       d3.select("#vic-name")
                                         .html(d.name);

                                       d3.select("#vic-age")
                                         .html(d.age);

                                       d3.select("#vic-cause")
                                         .html(d.cause);

                                       d3.select("#vic-date")
                                         .html(d.deathDate);  

                                       d3.select("#vic-summary")
                                         .html(d.summary);

                                       vicRect = d3.select(this);
                                         
                                         vicRect
                                         .attr("height", cellSize+4)
                                         .attr("width", cellSize+4)
                                         .attr("x", vicRect.attr("x")*1 - 2)
                                         .attr("y", vicRect.attr("y")*1 - 2); 
                                      })          
                           .on("mouseout", function(d) {   
                                  
                                     d3.select(this)
                                       
                                       .attr("height", cellSize)
                                       .attr("width", cellSize)
                                       .attr("x", vicRect.attr("x")*1 + 2)
                                       .attr("y", vicRect.attr("y")*1 + 2);
                                     })
                           .transition().duration(1500)
                                        .delay( function (d, i) { return i*500 })
                                        .each( function(){
                                          d3.select(this)
                                                .attr("height", cellSize)
                                                .attr("width", cellSize)
                                        });

                             victims.exit().remove();           

  };

  };        


