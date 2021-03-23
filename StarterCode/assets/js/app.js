// set the dimensions and margins of the graph
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
  

//create chart group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read the data
d3.csv("assets/data/data.csv").then(function(data){
  console.log(data);

  data.forEach(function(data){
  data.poverty = +data.poverty;
  data.healthcare = +data.healthcare;
  });

  // Scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);
    
  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")
    .attr("y", 0 - (margin.left - 20))
    .attr("x", 0 - (height / 2) - 50)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")
    .attr("x", svgWidth/2 - 20)
    .attr("y", svgHeight *.91)
    .style("text-anchor", "middle")
    .text("In Poverty(%)");

    
  // creatng circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".5");
    
  // state abbreviations
  var textGroup = chartGroup.selectAll("data.abbr")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "abbr")
    .attr("x", d => xLinearScale(d.poverty)-8)
    .attr("y", d => yLinearScale(d.healthcare)+9)
    .attr("fill", "white")
    .attr("opacity", "1")
    .text(d => d.abbr)
    
  // tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([75, -55])
    .html(function (d, i) {
      return (`${d.state}<br>Poverty ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

    chartGroup.call(toolTip)
      .on("mouseout", function (d, i) {
      toolTip.hide(data)});  
    

    textGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
      });

    });
 