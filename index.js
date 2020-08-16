const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    data = response;
    chart(data);
  });

function chart(data) {
  //  define div for tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // define canvas
  const w = 1000;
  const h = 600;
  const padding = 45;

  const svg = d3
    .select(".chart-container")
    .append("svg")
    .attr("height", h)
    .attr("width", w);

  // define max and min time
  const maxTime = d3.max(
    data,
    (d) => new Date(0, 0, 0, 0, d.Time.split(":")[0], d.Time.split(":")[1])
  );

  const minTime = d3.min(
    data,
    (d) => new Date(0, 0, 0, 0, d.Time.split(":")[0], d.Time.split(":")[1])
  );

  // define y scale and add a few extra seconds on the scale as padding
  const yScale = d3.scaleTime();
  yScale
    .domain([
      minTime.setSeconds(minTime.getSeconds() - 5),
      maxTime.setSeconds(maxTime.getSeconds() + 5),
    ])
    .range([h - padding, padding]);

  // define x scale and an extra year as padding
  const xScale = d3
    .scaleTime()
    .domain([
      d3.min(data, (d) => new Date(d.Year - 1)),
      d3.max(data, (d) => new Date(d.Year + 1)),
    ])
    .range([padding, w - padding]);

  // define the y  and x axis
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  // draw y and x axis
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .attr("id", "y-axis")
    .call(yAxis);

  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

  // create circle plots
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(new Date(d.Year)))
    .attr("cy", (d) =>
      yScale(new Date(0, 0, 0, 0, d.Time.split(":")[0], d.Time.split(":")[1]))
    )
    .attr("r", 6)
    .attr("data-xvalue", (d) => d.Year)
    .attr(
      "data-yvalue",
      (d) => new Date(0, 0, 0, 0, d.Time.split(":")[0], d.Time.split(":")[1])
    )
    .attr("name", (d) => d.Name)
    .attr("time", (d) => d.Time)
    .attr("nationality", (d) => d.Nationality)
    .attr("doping", (d) => d.Doping)
    .on("mouseover", function (d) {
      tooltip.transition().duration(200).style("opacity", 0.8);
      tooltip.html(
        d3.select(this).attr("name") +
          " " +
          "(" +
          d3.select(this).attr("nationality") +
          ")" +
          "<br/>" +
          "year: " +
          d3.select(this).attr("data-xvalue") +
          "<br/>" +
          "time: " +
          d3.select(this).attr("time") +
          "<br/>" +
          d3.select(this).attr("doping")
      );
      tooltip
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 75 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
}
