function chartBar(dataset) {
  let height = 400,
    width = 800,
    padding = 60,
    barWidth = width / dataset.length;

  let yearsData = dataset.map((item) => new Date(item[0]));

  let GDP = dataset.map((item) => item[1]);

  let xScale = d3
    .scaleTime()
    .domain([d3.min(yearsData), d3.max(yearsData)])
    .range([padding, width - padding]);

  console.log(d3.max(yearsData));

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(GDP)])
    .range([height, padding]);

  let tooltip = d3
    .select(".diagram-canvas")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  let diagram = d3
    .select(".diagram-canvas")
    .append("svg")
    .attr("height", height + padding)
    .attr("width", width);

  diagram
    .selectAll("rect")
    .data(GDP)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(yearsData[i]))
    .attr("y", (d) => yScale(d))
    .attr("width", barWidth)
    .attr("height", (d) => height - yScale(d))
    .attr("class", "bar")
    .attr("data-date", (d, i) => dataset[i][0])
    .attr("data-gdp", (d, i) => GDP[i])
    .attr("fill", "rgb(21, 52, 99)")
    .on("mouseover", function (d, i) {
      d3.select(this).attr("fill", "aqua");
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          dataset[i][0].replace(/-/g, ".") +
            "<br>" +
            "$" +
            dataset[i][1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
            " Billion"
        )
        .attr("data-date", dataset[i][0])
        .style("left",  xScale(yearsData[i]) + 20 + "px")
        .style("top", height - 20 + "px");
    })
    .on("mouseout", function (d, i) {
      d3.select(this).attr("fill", "rgb(21, 52, 99)");
      tooltip.transition().duration(200).style("opacity", 0);
    });

  let xAxis = d3.axisBottom(xScale);

  let yAxis = d3.axisLeft(yScale);

  diagram
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  diagram
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
}

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  function (error, data) {
    let dataset = data.data;
    chartBar(dataset);
  }
);
