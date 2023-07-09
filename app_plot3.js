function start(){
    var filePath="Data_related_jobs_glassdoor.csv";
    plot_1(filePath)

}

function plot_1(filePath){
    var rowConverter= function(d){
        if ((d['job_simpl'] != "") && (d['company_sector'] != "")){
            if ((d.location == "New Jersey") || (d.location == "Township of Lawrence")){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "NJ",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Manhattan"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "NY",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "North Carolina"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "NC",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Massachusetts"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "MA",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Texas"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "TX",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Long Island-Queens"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "NC",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Arizona"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "AZ",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "California"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "CA",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Connecticut"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "CT",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "New York State"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "NY",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Wisconsin"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "WI",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "South Carolina"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "SC",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location == "Remote"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: "Remote",
                    salary: parseFloat(d['salary estimate'])
                }
            } else if(d.location != "United States"){
                return {
                    salary: parseFloat(d['salary estimate']),
                    type: d['job_simpl'],
                    company: d['company_sector'],
                    state: d.location.slice(-2),
                    salary: parseFloat(d['salary estimate'])
                }
            } 
        }
    };

    d3.csv(filePath, rowConverter).then(function(data){
        var margin = {top: 30, right: 30, bottom: 40, left: 60};
        let padding = 50;
        let width = 800;
        var event_length = 1450;  
        let height = 500 - margin.top - margin.bottom;
        var svg = d3.select('#plot_3rd').append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom);

        var max_Salary = d3.max(d3.map(data, v=>v.salary));
        var min_Salary = d3.min(d3.map(data, v=>v.salary));
        var quantize = d3.scaleQuantize()
                         .domain([min_Salary, max_Salary])
                         .range(["black", "blue", "red"])
         
        var state_value = d3.group(data, d=>d.state);
        
        var state_arr = [];
        var thrid_salary = parseInt((max_Salary - min_Salary) / 3);
        var thred_two_salary = parseInt(2 * (max_Salary - min_Salary) / 3);
        var salary_lst = ["<" + thrid_salary, 
                            thrid_salary + "~" + thred_two_salary,
                            ">" + thred_two_salary];
        var max_state = 0;
        for(let i of state_value.keys()){
            var dic = {};
            dic["state"] = i;
            dic["<" + thrid_salary] = data.filter(d => ((d.state == i) && (d.salary < thrid_salary))).length;

            dic[thrid_salary + "~" + thred_two_salary] = data.filter(d => ((d.state == i) && ((d.salary > thrid_salary) && (d.salary < thred_two_salary)))).length;
            dic[">" + thred_two_salary] = data.filter(d => ((d.state == i) && (d.salary > thred_two_salary))).length;
            if (max_state < (dic["<" + thrid_salary] + dic[thrid_salary + "~" + thred_two_salary] + dic[">" + thred_two_salary])){
                max_state = (dic["<" + thrid_salary] + dic[thrid_salary + "~" + thred_two_salary] + dic[">" + thred_two_salary])
            }
            state_arr.push(dic);

        }


        var x = d3.scaleBand()
                  .domain(Array.from(state_value.keys()).sort())
                  .range([margin.left, width])
                  .padding([0.2]);
        svg.append("g")
           .attr("transform", "translate(" + 0 + "," + height + ")")
           .call(d3.axisBottom(x).tickSizeOuter(0))
           .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("transform", function (d) {
                            return "rotate(-30)";
                        });
        max_state = max_state * 1.2;
        var y = d3.scaleLinear()
                  .domain([0, max_state])
                  .range([ height, 0 ]);
        svg.append("g")
           .attr('transform', `translate(${margin.left},${0})`)
           .call(d3.axisLeft(y));

        var stackedData = d3.stack()
                            .keys(salary_lst)
                            (state_arr);

        var color = d3.scaleOrdinal()
                            .domain(salary_lst)
                            .range(['#e41a1c','#377eb8','#4daf4a'])
       
        var Tooltip = d3.select("#plot_3rd")
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
                               .html("The salary belong to this part has " 
                                     + (d[1] - d[0]) + " person.")
                               .style("left", (d3.pointer(e, svg)[0]) + "px")
                               .style("top", (d3.pointer(e, svg)[1]) - event_length + "px")
                           }
        var mouseleave = function(d) {
                             Tooltip
                               .style("opacity", 0)
                             d3.select(this)
                               .style("stroke", "none")
                               .style("opacity", 0.8)
                           }

        svg.append("g")
           .selectAll("g")
           .data(stackedData)
           .enter().append("g")
           .attr("fill", function(d) { return color(d.key); })
           .selectAll("rect")
           .data(function(d) { return d; })
           .enter().append("rect")
           .attr("x", function(d) { 
               return x(d.data.state); 
            })
           .attr("y", function(d) { return y(d[1]); })
           .attr("height", function(d) { return y(d[0]) - y(d[1]); })
           .attr("width",x.bandwidth())
           .on("mouseover", mouseover)
           .on("mousemove", mousemove)
           .on("mouseleave", mouseleave);


        svg.append("text")
           .attr("class", "x label")
           .attr("text-anchor", "end")
           .attr("x", width / 2)
           .attr("y", height + margin.bottom)
           .text("State");

        svg.append('g')
           .attr('transform', 'translate(' + margin.top + ', ' + padding + ')')
           .append('text')
           .attr('text-anchor', 'middle')
           .attr('transform', 'rotate(-90)')
           .text('Count(Salary)');


        svg.selectAll("circle")
           .data(salary_lst)
           .enter()
           .append('circle')
           .attr('cx', width - margin.bottom)
           .attr('cy', function(d, i){
               return padding + (i + 1) * margin.top;
           })
           .attr('r', 5)
           .attr("fill", function(d) { return color(d); });

        svg.selectAll("myText")
           .data(salary_lst)
           .enter()
           .append('text')
           .attr('x', width - margin.right + 5)
           .attr('y', function(d, i){
               return padding + (i + 1) * margin.top;
           })
           .text(function(d){
               return d;
           })
           .style("font-size", "10px");


        svg.append("text")
           .attr("x", (width ) / 2 - margin.left - padding - margin.right)             
           .attr("y", 50 - margin.top)
           .attr("text-anchor", "start")  
           .style("font-size", "16px") 
           .style("text-decoration", "underline")  
           .text("Number of people with different incomes by state");
    });
}

start()