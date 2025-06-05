let i = 0;

const req = new XMLHttpRequest();
req.open("GET", "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
let country_data;
req.onload = () => {
  console.log("data fetched")
  country_data = JSON.parse(req.responseText)
  i++;
  if (i == 2)
    draw_map(country_data, shape_data)
  //draw_map(data)
}
req.send();

const req2 = new XMLHttpRequest();
req2.open("GET", "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
let shape_data;
req2.onload = () => {
  console.log("data fetched")
  shape_data = JSON.parse(req2.responseText);
  i++;
  if (i == 2)
    draw_map(country_data, shape_data)
  //draw_map(data)
}
req2.send();


let tooltip = document.getElementById("tooltip")

const dims = {
  h: 600, w: 960, pl: 90, pr: 30, pb: 80, pt: 10
}

const svg = d3.select("body")
  .append("svg")
  .attr("width", dims.w)
  .attr("height", dims.h);

draw_map = (counties, shapes) => {
  console.log("both data loaded")


  let colors = d3.schemeGreens[8], tresholds = [10, 20, 30, 40, 50, 60],
    symbolWidth = 30;
  colors.shift();

  let legend = svg.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${dims.w - symbolWidth*colors.length-150}, 30)`);

  legend
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i*symbolWidth)
    .attr("width", symbolWidth)
    .attr("height", 15)
    .attr("fill", d => d)

  legend
    .selectAll("text")
    .data(tresholds)
    .enter()
    .append("text")
    .text(d => d + "%")
    .attr("x", (d,i) => (i+1) * symbolWidth)
    .attr("y", 25)

  colorScale = d3.scaleThreshold(
    tresholds,
    colors
  )

  path = d3.geoPath();

  combined_data = topojson.feature(shapes, shapes.objects.counties).features;
  combined_data.forEach((d, i) => {
    d.fips = counties[i].fips;
    d.education = counties[i].bachelorsOrHigher;
    d.name = counties[i].area_name;
    d.state = counties[i].state
  })

  svg.append("g")
    .selectAll("path")
    .data(combined_data)
    //.data(topojson.feature(shapes, shapes.objects.counties).features)
    .enter()
    .append("path")
    .attr("class", "county")
    //.attr("data-fips", (d, i) => counties[i].fips)
    .attr("data-fips", d => d.fips)
    .attr("data-education", d => d.education)
    .attr("d", path)
    .attr("fill", d => colorScale(d.education))
    .on("mouseenter", (e, d) => {
      tooltip.innerHTML = `${d.name}, ${d.state}: ${d.education}%`
      tooltip.setAttribute("data-education", d.education);
      tooltip.style.display = "block"
      var x = e.clientX, y = e.clientY;
      if (x > dims.w*0.75)
        x -= 200
      tooltip.style.top = (y + 10) + 'px';
      tooltip.style.left = (x + 10) + 'px';
    })
    .on("mouseleave", (e, d) => {
      tooltip.style.display = "none"
    })
}
