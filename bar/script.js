const req = new XMLHttpRequest();
req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
let gdp_data;
req.onload = () => {
  console.log("data fetched")
  gdp_data = JSON.parse(req.responseText)
  draw_bar(gdp_data.data)
}
req.send();

draw_bar = (data) => {
  const w = 900, h = 460, padding = 40;
  const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  yScale = d3.scaleLinear()
    .domain([
        d3.max(data, d => d[1]),
        0
    ])
    .range([padding, h - padding]);

  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  xScale = d3.scaleTime()
    .domain([new Date("1947-01-01"), new Date("2015-10-01")])
    .range([padding, w - padding])

  const xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis);

  var bars = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    //.attr("x", (d, i) => xScale(1947 + i/4))
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("height", d => yScale(0) - yScale(d[1]))
    //.attr("width", (xScale(1/4) - xScale(0))*0.8)
    .attr("width", xScale(new Date("2020-04-01")) - xScale(new Date("2020-01-01")))
    .attr("class", "bar")
    .attr("data-gdp", d => d[1])
    .attr("data-date", d => d[0])
    //.attr("data-date", (d, i) => 1947 + i/4)
    .on("mouseover", (e, d) => {
      let tt = document.getElementById("tooltip");
      tt.setAttribute("data-date", d[0]);
      tt.innerHTML = `<b>Time</b>: ${d[0]}<br/> <b>GDP</b>: ${d[1]}`;
      tt.style.display = "block";
      tt.style.left = (xScale(new Date(d[0])) - 60) + "px";
    })
    .on("mouseleave", (e, d) => {
      let tt = document.getElementById("tooltip");
      tt.style.display = "none";
    })
}
