function start(){
    var filePath="Data_related_jobs_glassdoor.csv";
    plot_1(filePath)

}

function plot_1(filePath){
    var rowConverter= function(d){
        if ((d['company_type'] != "") && (d['company_sector'] != "")){
            
            return {
                salary: parseFloat(d['salary estimate']),
                type: d['company_type'],
                company: d['company_sector']
            };
        }
    };

    d3.csv(filePath, rowConverter).then(function(data){
        var margin = {top: 30, right: 30, bottom: 30, left: 150};
        let padding = 50;
        let width = 600;
        let height = 500 - margin.top - margin.bottom;
        var svg = d3.select('#plot_2nd').append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom);
        
        var company = d3.rollup(data, v=>d3.mean(v, d=>d.salary), d=>d.company);
        var type = d3.rollup(data, v=>d3.mean(v, d=>d.salary), d=>d.type);

        var dic = {"company": company, "type": type};
        var current_index = "company";

        var yScale = d3.scaleBand()
                             .domain(Array.from(dic[current_index].keys()).sort())
                             .range([margin.top, height])
                             .padding(0.1);


        var xScale = d3.scaleLinear()
                       .domain([d3.max(Array.from(dic[current_index].values())), 0])
                       .range([width - margin.left, 0]);

        svg.append("g")
                       .attr('transform', `translate(${margin.left},0)`)
                       .attr("class","y_axis")
                       .call(d3.axisLeft(yScale))
                       .append("text")
                       .attr("dx", "-.1em")
                       .attr("dy", "0.71em")
                       .attr("text-anchor", "end");
            
        svg.append('g')
                        .attr('transform', `translate(${margin.left},${height})`)
                        .attr("class","x_axis")
                        .call(d3.axisBottom(xScale))
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", function (d) {
                            return "rotate(-30)";
                        });


        svg.append('g')
           .attr('transform', 'translate(' + padding + ', ' + margin.top + ')')
           .append('text')
           .attr("class", 'y_label')
           .attr('text-anchor', 'middle')
           .style("font-size", "12px")
           .style("fill", "red")
           .text(current_index);

        svg.selectAll('rect')
           .data(dic[current_index])
           .enter()
           .append("rect")
           .attr("x", margin.left)
           .attr("y", function(d){
            return yScale(d[0]);
            })
            .attr("width", function(d){
                return xScale(d[1]);
                })
            .attr("height", yScale.bandwidth());

        var title = {};
        title['type'] = "The mean salary of different Company Type";
        title['company'] = "The mean salary of different Company Sector";
        svg.append("text")
            .attr("x", (width)/2 - margin.left)             
            .attr("y", padding - margin.top)
            .attr("text-anchor", "start") 
            .attr("class", "My2ndtext") 
            .style("font-size", "16px")  
            .text(title[current_index]);


        svg.append("text")
            .attr("class", "x_label")
            .attr("text-anchor", "end")
            .attr("x", width / 2 + padding)
            .attr("y", height + padding)
            .text("Salary");


        d3.select('#second_text').append('p').text("Marks is line and the channels is "
        + "Position and Length to show the salary in different company sector and compamy"
        + " type.")
            .style('font-size', '15px')


        d3.select('#second_text').append('p')
            .text("In this graph, we can get the Telecommunications will have highest salary"
            + "in different company sector and Private Practice / Firm will let you "
            + "earn highest salary for company type.");


        svg.append('rect')
            .attr("class", "label")
            .attr("x", width)
            .attr("y", margin.top)
            .attr("width", padding + margin.top)
            .attr("height", 10);

        svg.append("text")
                .attr("class", "label_text")
           .attr("x", width)
           .attr("y", padding - margin.top)
           .text("mean salary of " + current_index)
           .attr("text-anchor", "start")  
           .style('font-size', '10px')



        d3.select('#radio_q2')
           .attr('name', 'region')
           .on("change", function (d) {
              current_index = d.target.value; 
              c_data = dic[current_index];

              var max_lst_value = d3.max(Array.from(dic[current_index].values()));

              var yScale = d3.scaleBand()
                             .domain(Array.from(dic[current_index].keys()).sort())
                             .range([margin.top, height])
                             .padding(0.1);


            var xScale = d3.scaleLinear()
                       .domain([max_lst_value, 0])
                       .range([width - margin.left, 0]);

            svg.selectAll("g.y_axis")
               .transition()
               .call(d3.axisLeft(yScale));
            
            svg.selectAll("g.x_axis")
               .transition()
               .call(d3.axisBottom(xScale))
               .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", function (d) {
                            return "rotate(-30)";
                        });

            svg.selectAll("rect").remove();
            svg.selectAll('rect')
                .data(dic[current_index])
               .enter()
               .append("rect")
               .attr("x", margin.left)
               .attr("y", function(d){
                   return yScale(d[0]);
                })
                .attr("width", function(d){
                    return xScale(d[1]);
                })
                .attr("height", yScale.bandwidth());


            svg.selectAll(".My2ndtext")
                .transition()
                    .duration(500)
                    .attr("x", (width)/2 - margin.left)             
            .attr("y", padding - margin.top)
            .attr("text-anchor", "start") 
            .attr("class", "My2ndtext") 
            .style("font-size", "16px")  
            .text(title[current_index]);


            svg.selectAll(".y_label")
                .transition()
                .duration(500)
                .text(function(d){
                    return current_index;
                });


            svg.selectAll('.label_text')
                .transition()
                .duration(500)
                .text("mean salary of " + current_index);


            svg.append("rect")
                .attr("x", width)
                .attr("y", margin.top)
                .attr("width", padding + margin.top)
                .attr("height", 10);
                        
            });
    });
}

start();