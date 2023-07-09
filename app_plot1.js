function start(){
    var filePath="Data_related_jobs_glassdoor.csv";
    plot_1(filePath)

}

function linearRegression(y,x){

    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    } 

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    return lr;

};



function plot_1(filePath){
    d3.csv(filePath).then(function(data){
        console.log(data[0])
    });
    var rowConverter= function(d){
        if (parseFloat(d['rating']) > 0){
            return {
                salary: parseFloat(d['salary estimate']),
                rating: parseFloat(d['rating'])
            };
        }
    };

    d3.csv(filePath, rowConverter).then(function(data){
        var margin = {top: 30, right: 30, bottom: 50, left: 60};
        let padding = 100;
        let width = 500;
        let height = 500 - margin.top - margin.bottom;
        var svg = d3.select('#plot_1st').append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom);
        
        var xScale = d3.scaleLinear()
                       .domain([0, d3.max(data, d=>d.salary)])
                       .range([padding, width]);
        var x_axis = svg.append("g").attr("transform", "translate(" + 0 + "," + height + ")")
                     .call(d3.axisBottom(xScale))
                     .selectAll('text')
                     .attr("transform", "rotate(-45)")
                     .style("text-anchor", "end");
        
        let t =d3.transition()
                 .duration(500)
                 .ease(d3.easeLinear)
        
        svg.append("clipPath") 
                 .attr("id", "clip")
                 .append("rect")
                 .attr("width", width)
                 .attr("height", height);
        
        var distance  = 0.5;
        var yScale = d3.scaleLinear()
                       .domain([d3.max(data, d=>d.rating) + distance, 
                                d3.min(data, d=>d.rating) - distance])
                       .range([0, height]);

        var Tooltip = d3.select("#plot_1st")
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
                          .style("opacity", 1);
                        d3.select(this)
                          .style("stroke", "red")
                          .style("opacity", 1);
                        }
        var mousemove = function(e, d) {
                        Tooltip
                          .html("The salary is " + d.salary  + " and rating is " + d.rating)
                          .style("left", xScale(d.salary) +margin.bottom + "px" )
                          .style("top", yScale(d.rating) + "px")
                      }
        var mouseleave = function(d) {
                        Tooltip
                          .style("opacity", 0)
                        d3.select(this)
                          .style("stroke", "none")
                          .style("opacity", 0.8)
                      }




        svg.append("g").attr("transform", "translate(" + padding + ", 0)")
                       .call(d3.axisLeft(yScale));



        let updateLine = svg.selectAll("myCircle")
                            .data(data);
        let enterLine = updateLine.enter();
        let exitLine = updateLine.exit();
        enterLine
           .append("circle")
           .attr('cx', function(d){
               return xScale(d.salary);
           })
           .attr('cy', function(d){
               return yScale(d.rating);
           })
           .attr('r', 3)
           .attr('stroke', 'black')
           .attr('fill', '#69a3b2')
           .on("mouseover", mouseover)
           .on("mousemove", mousemove)
           .on("mouseleave", mouseleave);

        exitLine.remove();
        
        







        svg.append("text")
           .attr("class", "x label")
           .attr("text-anchor", "end")
           .attr("x", width / 2)
           .attr("y", height + margin.bottom)
           .text("Salary");

        svg.append('g')
           .attr('transform', 'translate(' + margin.left + ', ' + padding + ')')
           .append('text')
           .attr('text-anchor', 'middle')
           .attr('transform', 'rotate(-90)')
           .text('Rating');



        var yval = data.map(function (d) { return parseFloat(d.salary); });
        var xval = data.map(function (d) { return parseFloat(d.rating); });
           
           
        var lr = linearRegression(xval,yval);
        var max = d3.max(data, function (d) { return d.salary; });

        var myLine = svg.append("line")
                        .attr("x1", xScale(0))
                        .attr("y1", yScale(lr.intercept))
                        .attr("x2", xScale(max))
                        .attr("y2", yScale( (max * lr.slope) + lr.intercept ))
                        .style("stroke", "red")
                        .style("width", padding);

        svg.append('line')
           .attr('x1', width+margin.left)
           .attr('y1', height - margin.bottom)
           .attr('x2', width)
           .attr('y2', height - margin.bottom)
           .style("stroke", "red")
           .style("width", padding);

        var text_padding = 12;
        svg.append('text')
        .attr("text-anchor", "middle")
        .attr("x", width)
        .attr("y", height - margin.bottom + text_padding)
        .text("linear regession of salary and rating")
        .style("font-size", "10px");


        svg.append('circle')
            .attr("cx", width)             
            .attr("cy", height - margin.top - margin.bottom)
            .attr('r', 3)
            .attr('stroke', 'black')
            .attr('fill', '#69a3b2')

        svg.append("text")
            .attr("x", width + 5)             
            .attr("y", height - margin.top - margin.bottom)
            .attr("text-anchor", "start")  
            .style("font-size", "10px") 
            .style("text-decoration", "underline")  
            .text("Salary and Rating");


        svg.append("text")
                .attr("x", (width ) / 2 - margin.left)             
                .attr("y", 50 - margin.top)
                .attr("text-anchor", "start")  
                .style("font-size", "16px") 
                .style("text-decoration", "underline")  
                .text("The relation between Salary and Rating");


        d3.select('#first_text').append('p').text("This graph use points to instead " 
        + "the position of rating and salary, and use red line to show the line regession"
        + ". Then use Horizontal and Vertical in position to represent the position of each point.")
        .style('font-size', '15px');

        d3.select('#first_text').append('p')
        .text("In adintion, this graph show the the most of salary between 50,000 to 140,000"
        + "and rating between 3.5 to 4.5, but the linear regession still show the high rating"
        + "will give you more salary.");
    });
}

start();