const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    data = response;
    // console.log(response[0].Year);
    chart(data);
  });

function chart() {
  //  define div for tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // define canvas
  const w = 1100;
  const h = 600;
  //  const padding = 45;

  const svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("height", h)
    .attr("width", w);
}
