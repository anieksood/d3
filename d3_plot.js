
d3.csv("d3_sleep_hrv_grouped_data.csv").then(function(data) {
  const margin = { top: 40, right: 30, bottom: 60, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  const svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  data.forEach(d => {
    d.HRV = +d["Heart rate variability (ms)"];
  });

  const groupTypes = ["Below Normal", "Normal", "Above Normal"];
  const sleepStages = ["REM", "Deep", "Light"];
  const color = d3.scaleOrdinal()
      .domain(sleepStages)
      .range(["#5DADE2", "#A569BD", "#76D7C4"]);

  const x = d3.scalePoint()
      .domain(groupTypes)
      .range([0, width])
      .padding(0.5);

  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.HRV) * 1.1])
      .range([height, 0]);

  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

  svg.append("g")
      .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Group Type");

  svg.append("text")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Heart Rate Variability (ms)");

  svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d["Group Type"]))
      .attr("cy", d => y(d.HRV))
      .attr("r", 6)
      .style("fill", d => color(d.Stage))
      .style("opacity", 0.7)
      .attr("stroke", "#333");

  const legend = svg.selectAll(".legend")
      .data(sleepStages)
      .enter().append("g")
      .attr("transform", (d, i) => `translate(${width + 10}, ${i * 25})`);

  legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", d => color(d));

  legend.append("text")
      .attr("x", 24)
      .attr("y", 13)
      .text(d => d);
});
