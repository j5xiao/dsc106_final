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
        var margin = {top: 30, right: 30, bottom: 30, left: 60};
        let padding = 50;
        let double_padding = 100;
        let width = 600;
        let height = 500 - margin.top - margin.bottom;
        var svg = d3.select('#plot_5th').append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom);


        var company = d3.rollup(data, v=>v.length, d=>d.company);
        var type = d3.rollup(data, v=>v.length, d=>d.type);
        var dic = {}

        var company_key = Array.from(company).sort((a, b) => d3.descending(a[1], 
            b[1])).slice(0, 5);
        company_key = d3.map(company_key, d=>d[0]);
        var company_value = data.filter(d=>company_key.includes(d.company));
        var type_key = Array.from(type).sort((a, b) => d3.descending(a[1], 
            b[1])).slice(0, 5);
            type_key = d3.map(type_key, d=>d[0]);
        var type_value = data.filter(d=>type_key.includes(d.type));
        var key_dic = {};
        key_dic['companys'] = company_key;
        key_dic['types'] = type_key;
        var dic = {};
        var company_dic = [];
        var type_dic = [];
        var max_y = d3.max(d3.map(data, v=>v.salary)) * 1.2;

        for (let i of company_key){
            var val = [];
            val.push(i);
            val.push(Array.from(d3.map(company_value.filter(d=>(d.company == i)), 
                                                                    v=>v.salary)))
            company_dic.push(val);
        }

        for (let i of type_key){
            var val = [];
            val.push(i);
            val.push(Array.from(d3.map(type_value.filter(d=>(d.type == i)), 
                                                                    v=>v.salary)))
            type_dic.push(val);
        }

        dic["companys"] = company_dic;
        dic["types"] = type_dic;

        var current = "companys";

        var x = d3.scaleBand()
                  .range([ double_padding, width ])
                  .domain(company_key)
                  .paddingInner(1)
                  .paddingOuter(.5)
        svg.append("g")
           .attr("transform", "translate(0," + height + ")")
           .attr("class","x_axis")
           .call(d3.axisBottom(x))
           .selectAll('text')
           .style("text-anchor", "middle")
           .attr("transform", function (d) {
            return "rotate(-30)";
        })

        var y = d3.scaleLinear()
                  .domain([0, max_y])
                  .range([height, 0])
        svg.append("g").attr('transform', `translate(${double_padding},${0})`)
            .call(d3.axisLeft(y));


        svg.selectAll("Lines")
           .data(dic[current])
           .enter()
           .append("line")
           .attr("class", "Lines")
           .attr("x1", function(d){
               return(x(d[0]))
            })
            .attr("y1", function(d){return(y(d3.min(d[1])))})
            .attr("x2", function(d){
                return(x(d[0]))
            })
            .attr("y2", function(d){return(y(d3.max(d[1])))})
            .attr("stroke", "black")
            .style("width", 40);


        var boxWidth = 80;
        svg.selectAll("boxes")
           .data(dic[current])
           .enter()
           .append("rect")
           .attr("class", "boxes")
           .attr("x", function(d){return x(d[0])-boxWidth/2})
           .attr("y", function(d){return y(d3.quantile(d[1], .75))})
           .attr("height", function(d){
               return y(d3.quantile(d[1], .25))- y(d3.quantile(d[1], .75))
            })
           .attr("width", boxWidth )
           .attr("stroke", "black")
           .style("fill", "#69b3a2");


        svg
           .selectAll("medianLines")
           .data(dic[current])
           .enter()
           .append("line")
           .attr("class", "medianLines")
             .attr("x1", function(d){return x(d[0])-boxWidth/2 })
             .attr("x2", function(d){return x(d[0])+boxWidth/2 })
             .attr("y1", function(d){return y(d3.median(d[1])) })
             .attr("y2", function(d){return y(d3.median(d[1])) })
             .attr("stroke", "black")
             .style("width", 80);


        svg.append("text")
             .attr("class", "x_label")
             .attr("text-anchor", "end")
             .attr("x", width / 2 + padding)
             .attr("y", height + padding)
             .text(current);
  
        svg.append('g')
             .attr('transform', 'translate(' + margin.right + ', ' + padding + ')')
             .append('text')
             .attr("class", 'y_label')
             .attr('text-anchor', 'middle')
             .attr('transform', 'rotate(-90)')
             .text('Salary');

        svg.append("text")
             .attr("x", (width) / 2 - double_padding)             
             .attr("y", padding - margin.top)
             .attr("text-anchor", "start") 
             .attr("class", "Mytext") 
             .style("font-size", "16px") 
             .style("text-decoration", "underline")  
             .text("Revenue Distribution of Top 5 Company Sector");

        var title = {};
        title['types'] = "Revenue Distribution of Top 5 Company Type";
        title['companys'] = "Revenue Distribution of Top 5 Company Sector";

        d3.select('#radio_q5')
             .attr('name', 'region_5')
             .on("change", function (d) {
                current_index = d.target.value; 
                c_data = dic[current_index];
            
            var x = d3.scaleBand()
                .range([ double_padding, width ])
                .domain(key_dic[current_index])
                .paddingInner(1)
                .paddingOuter(.5)
                
            svg
               .selectAll("g.x_axis")
               .transition()
               .call(d3.axisBottom(x))
               .selectAll('text')
           .style("text-anchor", "middle")
           .attr("transform", function (d) {
            return "rotate(-30)";
        });



            svg.selectAll(".Lines")
               .data(c_data)
               .transition()
               .duration(500)
               .attr("x1", function(d){
                   return(x(d[0]))
                })
                .attr("y1", function(d){return(y(d3.min(d[1])))})
                .attr("x2", function(d){
                    return(x(d[0]))
                })
                .attr("y2", function(d){return(y(d3.max(d[1])))})
                .attr("stroke", "black")
                .style("width", 40);
    
    
            svg.selectAll(".boxes")
               .data(c_data)
               .transition()
               .duration(500)
               .attr("x", function(d){return x(d[0])-boxWidth/2})
               .attr("y", function(d){return y(d3.quantile(d[1], .75))})
               .attr("height", function(d){
                   return y(d3.quantile(d[1], .25))- y(d3.quantile(d[1], .75))
                })
               .attr("width", boxWidth )
               .attr("stroke", "black")
               .style("fill", "#69b3a2");
    
    
            svg.selectAll(".medianLines")
               .data(c_data)
               .transition()
               .duration(500)
                 .attr("x1", function(d){return x(d[0])-boxWidth/2 })
                 .attr("x2", function(d){return x(d[0])+boxWidth/2 })
                 .attr("y1", function(d){return y(d3.median(d[1])) })
                 .attr("y2", function(d){return y(d3.median(d[1])) })
                 .attr("stroke", "black")
                 .style("width", 80);

            
            svg.selectAll(".x_label")
                .transition()
                .duration(500)
                .text(function(d){
                    return current_index;
                });


            svg.selectAll(".Mytext")
            .transition()
                .duration(500)
                .attr("x", (width) / 2 - double_padding)             
                .attr("y", padding - margin.top)
                .attr("text-anchor", "start")  
                .style("font-size", "16px") 
                .style("text-decoration", "underline")  
                .text(title[current_index]);

        });
   });
}

start()