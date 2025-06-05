const req = new XMLHttpRequest();
req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
let data;
req.onload = () => {
  console.log("data fetched")
  data = JSON.parse(req.responseText)
  draw_heatmap(data)
}
req.send();

let tooltip = document.getElementById("tooltip")

const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

const dims = {
  h: 540, w: 1603, pl: 90, pr: 30, pb: 80, pt: 10
}

const svg = d3.select("body")
  .append("svg")
  .attr("width", dims.w)
  .attr("height", dims.h);


const draw_heatmap = () => {
  yScale = d3.scaleBand()
    .domain(months)
    .range([dims.pt, dims.h - dims.pb]);

  yAxis = d3.axisLeft(yScale);

  extremes = {
    min: d3.min(data.monthlyVariance, d => d.variance),
    max: d3.max(data.monthlyVariance, d => d.variance)
  }

  xScale = d3.scaleBand()
    .domain(Array.from(new Set(data.monthlyVariance.map(d => d.year))))
    .range([dims.pl, dims.w - dims.pr]);

  xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter(function(d,i){ return !(d%10)}));

  // https://observablehq.com/@d3/color-legend
  colorScale = d3.scaleThreshold(
    [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    d3.schemeRdBu[11].reverse()
  )

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${dims.pl}, 0)`)
    .call(yAxis)

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${dims.h - dims.pb})`)
    .call(xAxis)

  svg.append("g")
    .selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.year))
    .attr("class", "cell")
    .attr("y", d => yScale(months[d.month - 1]))
    .attr("height", yScale("February") - yScale("January"))
    .attr("width", xScale(1830)-xScale(1829))
    .attr("fill", d => colorScale(d.variance + data.baseTemperature))
    .attr("data-month", d => d.month - 1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => data.baseTemperature + d.variance)
    .on("mouseover", (e, d) => {
      tooltip.innerHTML = `
        <b>Month</b>: ${months[d.month-1]} ${d.year}<br/>
        <b>Temperature</b>: ${Math.round(10*(data.baseTemperature + d.variance))/10}°F
      `
      tooltip.setAttribute("data-year", d.year)
      tooltip.style.display = "block"

      var x = e.clientX, y = e.clientY;
      tooltip.style.top = (y + 20) + 'px';
      tooltip.style.left = xScale(d.year) - 100 + 'px';
      //tooltip.style['border-color'] = colorScale(data.baseTemperature + d.variance)
    })
    .on("mouseleave", (e) => {
      tooltip.style.display = "none"
    })

    let legend_symbol_size = 30;

    legend = svg.append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${dims.pl + 10}, ${dims.h-dims.pb + 40})`)

    legend
      .selectAll("rect")
      .data(d3.schemeRdBu[11])
      .enter()
      .append("rect")
      .attr("fill", d => d)
      .attr("x", (d, i) => i*legend_symbol_size)
      .attr("height", legend_symbol_size-5)
      .attr("width", legend_symbol_size)

    legend
      .selectAll("text")
      .data([3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
      .enter()
      .append("text")
      .text(d => d)
      .attr("x", (d, i) => ((i+1) * legend_symbol_size))
      .attr("y", legend_symbol_size + 10)

    /*color_legend = legend({
      color: colorScale,
      title: "Temperature (°F)"
    })*/
}
