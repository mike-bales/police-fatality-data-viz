var data,
    margin = { top: 20, right: 15, bottom: 20, left: 15 },
    cellSize = 3,
    width = (cellSize*365+365) - margin.left - margin.right,
    height = 70 - margin.bottom
    years = [2013, 2014, 2015],
    pieWidth = 200,
    pieHeight = 200
    radius = Math.min(pieWidth, pieHeight) / 2
    donutWidth = 45,
    legendRectSize = 10,
    legendSpacing = 4;

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

    var causePieChart = new PieChart("cause", "#cause-pie-chart");
    causePieChart.update();

    var statusPieChart = new PieChart("status", "#status-pie-chart");
    statusPieChart.update();

    var agePieChart = new PieChart("age", "#age-pie-chart");
    agePieChart.update();    

    d3.select('#filter-all-label')
      .classed('active', true);

    d3.select('#filter-all')
      .on('click', function() {

        if (options.cause != false) {
          
          options.cause = false;

          d3.select('#filter-all-label')
            .classed('active', true);

          d3.select('#filter-gun-label')
            .classed('active', false);

          d3.select('#filter-other-label')
            .classed('active', false);  

          chart1.update(); 
          causePieChart.update();   
          statusPieChart.update();  
          agePieChart.update();        
        }
    });    

    d3.select('#filter-gun')
      .on('click', function() {

        if (options.cause != "Gun") {
          
          options.cause = "Gun";

          d3.select('#filter-all-label')
            .classed('active', false);

          d3.select('#filter-gun-label')
            .classed('active', true);

          d3.select('#filter-other-label')
            .classed('active', false);   

          chart1.update();   
          causePieChart.update();   
          statusPieChart.update();  
          agePieChart.update();      
        }
     });   

    d3.select('#filter-other')
      .on('click', function() {

        if (options.cause != "Other") {
          
          options.cause = "Other";

          d3.select('#filter-all-label')
            .classed('active', false);

          d3.select('#filter-gun-label')
            .classed('active', false);

          d3.select('#filter-other-label')
            .classed('active', true);   

          chart1.update();     
          causePieChart.update();  
          statusPieChart.update(); 
          agePieChart.update();      
        }                
      })
    });


function PieChart(pieVar, selection) {

  var chart = this;

  chart.pieVar = pieVar;

  //SVG

  chart.svg = d3.select(selection)
                .append('svg')
                  .attr('width', pieWidth)
                  .attr('height', pieHeight)
                .append("g")
                  .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");
  
  // ARC

  chart.arc = d3.arc()
              .outerRadius(radius - 10)
              .innerRadius(radius - donutWidth);
  

  // CALCULATE ANGLES

  if(chart.pieVar === 'age') {
          chart.pie = d3.pie()
                .value(function(d) {return d.length;})
                .sort(null);
                } else {
          chart.pie = d3.pie()
                .value(function(d) {return d.value;})
                .sort(null);
                }; 

  //SET COLOR SCALE

  chart.color = d3.scaleOrdinal(d3.schemeCategory10);

};


function Chart() {


    var chart = this;

    // SVG

    chart.svg = d3.select('#chart')
                  .append('svg')
                  .attr("width", width + margin.right + margin.left)
                  .attr("height", (height + margin.top + margin.bottom)*3)
                  //.style("background", "lightgrey")
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ', 0)');

    chart.svg
         .append('rect')
         .attr('class', 'leo')
         .attr("height", 7)
         .attr("width", 7)
         .attr("y",3);

    chart.svg 
         .append('text')
         .attr('x','10')
         .attr('y','12')
         .text('Law Enforcement Officer (LEO)')     

    chart.svg
         .append('rect')
         .attr('class', 'civilian')
         .attr("height", 7)
         .attr("width", 7)
         .attr("x",230)
         .attr("y",3);    

    chart.svg 
         .append('text')
         .attr('x',241)
         .attr('y','12')
         .text('Civilian')            

    chart.x = [];

  for (var i = 0; i < years.length; i++) {

    // SCALES

    chart.x[i] = d3.scaleTime()
                .domain([new Date(years[i], 0, 1), new Date(years[i] + 1, 0, 1)])
                .range([0, width])
                .nice();

    // CREATE YEAR GROUP FOR EACH CHART AND SET POSITION

    yearGroup = chart.svg.append("g")
     .attr("id", "_"+years[i])
     .attr("transform", "translate(0," + ((height+(margin.top)) * (i+1)) + ")")

    // AXES

    var xAxis = d3.axisBottom()
                  .scale(chart.x[i]);

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
        return d.cause === options.cause;
      });           
    };
 
  
   // NEST DATA 

    var vicsByDate = d3.nest()
                       .key(function(d) { return d.deathDate;})
                       .entries(txData);
                       

    // CLEAR DAY GROUPS SO THERE IS BLANK SLATE FOR UPDATED DATA. .exit().remove() DOES NOT WORK. 
    // POSSIBLE IMPROVEMENT BY GETTING .exit().remove() TO WORK

    d3.select("#_"+ years[i])
      .selectAll('.day')
      .remove();

    // CREATE GROUP FOR EACH DAY

    var dateGroup = d3.select("#_"+ years[i])
                     .selectAll(".day")
                     .data(vicsByDate, function (d) { return d.deathDate;})
                     .enter().append("g")
                     .attr("class", "day")
                     .attr("transform","translate(0," + (-cellSize) + ")");

    
    // CREATE RECTS FOR VICTIM WITHIN EACH DAY

    var victims = dateGroup.selectAll(".victim"+years[i])
                           .data(function(d) {return d.values; }, function(d) { return d.name });

                           victims.enter().append("rect")
                           .attr("class", function(d) { return "victim"+years[i]+" "+d.status})
                           .attr("x", function(d) { return chart.x[i](dateParser(d.deathDate))} )
                           .attr("y", function(d,i) { return -(i*cellSize)-(i+1)})
                           .attr("height", cellSize)
                           .attr("width", cellSize)
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
                           // .transition().duration(1500)
                           //              .delay( function (d, i) { return i*500 })
                           //              .each( function(){
                           //                d3.select(this)
                           //                      .attr("height", cellSize)
                           //                      .attr("width", cellSize)
                           //             });           
  };

 
  };        

PieChart.prototype.update = function() {

  var chart = this;

  
  // NEST AND ROLLUP DATA

    txData = data.slice();

    if (options.cause) {
      txData = txData.filter(function (d) {
        return d.cause === options.cause;
      });
    };

    if (chart.pieVar === "age") { 
        var ageBins = [20,30,40,50,60,110];

        var histogram = d3.histogram()
                          .value(function(d) { return d.age })
                          .thresholds(ageBins);

        var pieData = histogram(txData);

    } else {

        var pieData = d3.nest()
                    .key(function(d) {return d[chart.pieVar];})
                    .rollup(function(d) {return d.length;})
                    .entries(txData); 
    }
  
    chart.svg
         .selectAll(".arc")
         .remove();

    var g = chart.svg.selectAll(".arc")
               .data(chart.pie(pieData))
               .enter().append("g")
                 .attr("class", "arc");

  if (chart.pieVar === "age") { 
        g.append("path")
          .attr("d", chart.arc)
          .style("fill", function(d) { return chart.color(d.data.x1); });         
  } else {
        g.append("path")
          .attr("d", chart.arc)
          .style("fill", function(d) { return chart.color(d.data.key); });  
  };

         var legend = chart.svg.selectAll('.legend')                     // NEW
          .data(chart.color.domain())                                   // NEW
          .enter()                                                // NEW
          .append('g')                                            // NEW
          .attr('class', 'legend')                                // NEW
          .attr('transform', function(d, i) {                     // NEW
            var height = legendRectSize + legendSpacing;          // NEW
            var offset =  height * chart.color.domain().length / 2;     // NEW
            var horz = -2 * legendRectSize;                       // NEW
            var vert = i * height - offset;                       // NEW
            return 'translate(' + horz + ',' + vert + ')';        // NEW
          });                                                     // NEW

        legend.append('rect')                                     // NEW
          .attr('width', legendRectSize)                          // NEW
          .attr('height', legendRectSize)                         // NEW
          .style('fill', chart.color)                                   // NEW
          .style('stroke', chart.color);                                // NEW
          
        legend.append('text')                                     // NEW
          .attr('x', legendRectSize + legendSpacing)              // NEW
          .attr('y', legendRectSize - legendSpacing)              // NEW
          .text(function(d) { return d; });                       // NEW

}


