const req = new XMLHttpRequest();
req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
let data;
req.onload = () => {
  data = JSON.parse(req.responseText)
  draw_scatter(data)
}
req.send();

let tooltip = document.getElementById("tooltip")

const w = 900, h = 460, padding = 40;
const svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

const draw_scatter = data => {
  let padding = 70;
  data.forEach(d => {
    d.time2 = d3.timeParse("%M:%S")(d.Time)
  })
  xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
    .range([padding, w-padding]);
  yScale = d3.scaleTime()
    .domain([d3.min(data, d => d.time2), d3.max(data, d => d.time2)])
    .range([padding, h-padding]);

  let xAxis = d3.axisBottom(xScale)
    .tickFormat(d => d);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis);

  let yAxis = d3.axisLeft(yScale)
    .tickFormat(d => {
      let mins = d.getMinutes(), secs = d.getSeconds()
      if (secs == 0)
        secs = "00"
      return `${mins}:${secs}`
    });

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis)

  points = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.time2))
    .attr("fill", d => d.Doping == "" ? "steelblue" :  "darkred")
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => d.time2)
    .on("mouseenter", (e, d) =>  {
      tooltip.setAttribute("data-year", d.Year)
      let htmlString = `
        <b>${d.Name}</b> (${d.Nationality})<hr/>
        <b>Year</b>: ${d.Year} <br/>
        <b>Time</b>: ${d.Time}
      `
      if (d.Doping !== "") {
        htmlString += `<hr/><em style="color: darkred">${d.Doping}</em>`
      } else {
        htmlString += `<hr/><em style="color: steelblue">No doping allegation</em>`
      }
      tooltip.innerHTML = htmlString;
      tooltip.style.display = "block";
      console.log(d)
    })
    .on("mouseleave", e => {
      tooltip.style.display = "none"
    })

  let legend = svg.append("g")
    .attr("transform", `translate(200, ${30 + h-padding})`)
    .attr("id", "legend")

  legend.append("rect")
    .attr("class", "legend-symbol")
    .style("fill", "steelblue");

  legend.append("text")
    .attr("transform", "translate(20, 12.5)")
    .text("No doping allegations")

  legend.append("rect")
    .attr("transform", "translate(200, 0)")
    .attr("class", "legend-symbol")
    .style("fill", "darkred");

  legend.append("text")
    .attr("transform", "translate(220, 12.5)")
    .text("Riders with doping allegations")

}
