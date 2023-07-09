function start(){
    var filePath="Data_related_jobs_glassdoor.csv";
    plot_1(filePath)

}

function plot_1(filePath){
    var rowConverter= function(d){
        if ((d['company_type'] != "") && (d['company_sector'] != "")){
            if ((d.location == "New Jersey") || (d.location == "Township of Lawrence")){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "NJ",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Manhattan"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "NY",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "North Carolina"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "NC",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Massachusetts"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "MA",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Texas"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "TX",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Long Island-Queens"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "NC",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Arizona"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "AZ",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "California"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "CA",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Connecticut"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "CT",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "New York State"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "NY",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Wisconsin"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "WI",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "South Carolina"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: "SC"
                }
            } else if((d.location != "United States") && (d.location != "Remote")){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['company_type'],
                    company: d['company_sector'],
                    state: d.location.slice(-2)
                }
            } 
        }
    };

    d3.csv(filePath, rowConverter).then(function(data){
        var margin = {top: 30, right: 30, bottom: 30, left: 60};
        let padding = 50;
        let width = 600;
        let height = 500 - margin.top - margin.bottom;
        var svg = d3.select('#plot_4th').append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom);

        const projection1  = d3.geoAlbersUsa().translate([width/2, height/2]).scale(800); 
        const pathgeo1 = d3.geoPath().projection(projection1);
        var path1 = d3.json('us-states.json');

        var count = d3.rollup(data, v=>[v.length, d3.mean(v, d=>d.salary)], d=>d.state);
        var blues = d3.scaleSequential(d3.interpolateBlues)
                      .domain([0, d3.max(Array.from(count.values()), d=>Math.log(d[0]))]);

        var max_company = d3.max(count.values(), d=>d[0]);
        var min_company = d3.min(count.values(), d=>d[0]);


        var Tooltip = d3.select("#plot_4th")
                            .append("div")
                            .style("opacity", 0)
                            .attr("class", "tooltip")
                            .style("background-color", "white")
                            .style("border", "solid")
                            .style("border-width", "2px")
                            .style("border-radius", "5px")
                            .style("padding", "5px");
        var mouseover = function(d) {
            Tooltip
              .style("opacity", 1)
            d3.select(this)
              .style("stroke", "red")
              .style("opacity", 1)
            }
        var mousemove = function(e, d) {
            Tooltip
              .html(function(){
                  if (count.get(d.properties.name) == undefined){
                      return "The " + d.properties.name + " do not have data show.";
                  } else {
                      return ("The data contains " + d.properties.name 
                      + " has " + count.get(d.properties.name)[0]
                      + " persons works for data science"
                      + " and the mean of salary is " 
                      + parseInt(count.get(d.properties.name)[1]));
                  }
              })
              .style("left", e.layerX + "px")
              .style("top", e.layerY + "px")
          }
        var mouseleave = function(d) {
            Tooltip
              .style("opacity", 0)
            d3.select(this)
            .style("stroke-width", 1)
            .style("stroke", "black")
              .style("opacity", 0.8)
          }

        path1.then(function (map){
            svg.selectAll('path')
            .data(map.features).enter()
            .append("path")
            .attr("d", pathgeo1)
            .attr('class', function(d){
                return d.properties.name;
            })
            .style("stroke-width", 1)
            .style("stroke", "black")
            .style("fill", function(d){
                if (count.get(d.properties.name) == undefined){
                    return blues(0);
                }
                return blues(Math.log(count.get(d.properties.name)[0]));
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

            var legend = d3.legendColor()
                           .shapeWidth(30)
                           .cells(5)
                           .labelFormat(function(d, i) {
                               var intervalSize = (max_company - min_company) / 5;
                               var start = parseInt(min_company + i * intervalSize);
                               var end = parseInt(start + intervalSize);
                               return start + " - " + end + " persons";
                            })
                            .scale(blues);
        
            svg.append("g")
               .attr("class", "legend")
               .attr("transform", "translate(520, 300)")
               .style('font-size', '10px')
               .call(legend);


            svg.append("text")
               .attr("x", (width / 2 + margin.right))             
               .attr("y", padding)
               .attr("text-anchor", "middle")  
               .style("font-size", "16px") 
               .style("text-decoration", "underline")  
               .text("Correlation population statistics map between states");


               var zoom = d3.zoom()
               .scaleExtent([1, 8])
               .on("zoom", zoomed);
               svg.call(zoom);
           
               function zoomed(event) {
                   svg.selectAll('path').attr("transform", event.transform);
               }
    });
});
}

start()