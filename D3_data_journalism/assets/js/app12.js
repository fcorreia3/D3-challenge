// @TODO: YOUR CODE HERE!
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it
    // and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
    
    if (!svgArea.empty()) {
    svgArea.remove();
    }
    
    // Set SVG wrapper dimensions and margins, width and height of the graph
    var svgWidth = 900;
    var svgHeight = 500;
    
    var margin = {
      top: 20,
      right: 40,
      bottom: 80,
      left: 100
    };
  
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
  
    // Create an SVG wrapper; append an SVG group that will hold the chart
    // and shift it by the left and top margins
    var svg = d3
      .select(".chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
    //   .attr("viewBox", [0, 0, width, height])
    //   .attr("font-size", 12)
    //   .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");
  
    // Append an SVG group
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  console.log("first");
  
    // Scales and  Axes//
  
    // Initial Params
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";
   
    // ** X AXIS ** 
    // function used for updating x-scale var upon click on axis label
    function xScale(data, chosenXAxis) {
      // create scales
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
          d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
  
      return xLinearScale;
    }
  
    // function used for updating xAxis var upon click on axis label
    function renderXaxis(xLinearScale, xAxis) {
      var bottomAxis = d3.axisBottom(xLinearScale);
  
      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
  
      return xAxis;
    }
  
  // ** Y AXIS ** 
  // function used for updating y-scale var upon click on axis label
    function yScale(data, chosenYAxis) {
      // create scales
      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
          d3.max(data, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);
  
      return yLinearScale;
    }
  
  // function used for updating yAxis var upon click on axis label
    function renderYaxis(yLinearScale, yAxis) {
      var leftAxis = d3.axisLeft(yLinearScale);
  
      yAxis.transition()
        .duration(1000)
        .call(leftAxis);
  
      return yAxis;
    }
  
  // Updating the circles depending on the chosen axes // 
  
    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, xLinearScale, chosenXAxis, 
        yLinearScale, chosenYAxis) {
  
      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis])
        );
  
      return circlesGroup;
    }

    // console.log(d[chosenXAxis]);
    // console.log(d[chosenYAxis]);
  
  // Retrieve data from the CSV file and execute everything below
    d3.csv("./assets/data/data.csv").then(function(censusData, err) {
      if (err) throw err;
  
      // parse data
      censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
      });
  
      console.log("here is after parsing");
  
      // xLinearScale function with the imported data above
      var xLinearScale = xScale(censusData, chosenXAxis);
  
      // yLinearScale function with the imported data above
      var yLinearScale = yScale(censusData, chosenYAxis);
  
      // Create initial axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // Append X axis
      var xAxis = chartGroup.append("g")
        // .classed("x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      // Append y axis
      var yAxis = chartGroup.append("g")
        // .classed("y-axis")
        .call(leftAxis);
  
      // Append initial circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "20")
        .attr("fill", "blue")
        .attr("opacity", ".5");
      
      // Create labels of circles
      
      var circlesGroup = chartGroup.selectAll()
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .style("font-size", "13px")
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));
  
      // Create group for 3 X- AXIS LABELS
      var XlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      var povertyLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .attr("axisText", "x-axis-text")
        .classed("active", true)
        .text("In Poverty (%)");
  
      var ageLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .attr("axisText", "x-axis-text")
        .classed("inactive", true)
        .text("Age (Median)");
  
      var incomeLabel = XlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .attr("axisText", "x-axis-text")
      .classed("inactive", true)
      .text("Household Income (Median)");
  
  
      // Create group for 3 Y- AXIS LABELS
      var YlabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle");
    
      var obeseLabel = YlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("value", "obesity") // value to grab for event listener
        .attr("axisText", "y-axis-text")
        .classed("inactive", true)
        .text("Obese (%)");
  
      var smokersLabel = YlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", -40)
        .attr("value", "smokes") // value to grab for event listener
        .attr("axisText", "y-axis-text")
        .classed("inactive", true)
        .text("Smokers (%)");
  
      var healthLabel = YlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", -60)
      .attr("value", "healthcare") // value to grab for event listener
      .attr("axisText", "y-axis-text")
      .classed("active", true)
      .text("Lacks Healthcare (%)");
  
      console.log("later is after YlabelsGroup");
  
      // X- AXIS LABELS event listener
      XlabelsGroup.selectAll("text")
        .on("click", function() {
          // get value of selection
          var value = d3.select(this).attr("value");
          console.log(this);
          if (value !== chosenXAxis) {
  
            // replaces chosenXAxis with value
            chosenXAxis = value;
            console.log(chosenXAxis);
  
            // updates x scale for new data
            xLinearScale = xScale(censusData, chosenXAxis);
  
            // updates x axis with transition
            xAxis = renderXaxis(xLinearScale, xAxis);
  
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
            // changes classes to change bold text
            if (chosenXAxis === "age") {
              ageLabel
                .classed("active", true)
                .classed("inactive", false);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenXAxis === "income") {
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", true)
                .classed("inactive", false);
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
              povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            }
          }
        });
  
      // Y- AXIS LABELS event listener
      YlabelsGroup.selectAll("text")
        .on("click", function() {
          // get value of selection
          var value = d3.select(this).attr("value");
          console.log(this);
          if (value !== chosenYAxis) {
            // replaces chosenXAxis with value
            chosenYAxis = value;
            console.log(chosenYAxis);

            // updates x scale for new data
            yLinearScale = yScale(censusData, chosenYAxis);
  
            // updates x axis with transition
            yAxis = renderYaxis(yLinearScale, yAxis);
  
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
              obeseLabel
                .classed("active", true)
                .classed("inactive", false);
              smokersLabel
                .classed("active", false)
                .classed("inactive", true);
              healthLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
              obeseLabel
                .classed("active", false)
                .classed("inactive", true);
              smokersLabel
                .classed("active", true)
                .classed("inactive", false);
              healthLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
              obeseLabel
                .classed("active", false)
                .classed("inactive", true);
              smokersLabel
                .classed("active", false)
                .classed("inactive", true);
              healthLabel
                .classed("active", true)
                .classed("inactive", false);
            }
          }
        });
    
      }).catch(function(error) {
      console.log(error);
    });
  
  }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
  