(async () => {
    const resp = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json");
    const data = await resp.json();
    const dimensions = {
        width: 1200,
        height: 800,
        legend_height: 50
    }
    handleTooltipShow = (e, d) => {
        const value = parseInt(d.data.value)
            .toLocaleString().replace(/,/g, " ");
        tooltip.innerHTML = `
            <div><b>Name</b>: ${d.data.name}</div>
            <div><b>Category</b>: ${d.data.category}</div>
            <div><b>Value</b>: ${value}</div>
        `
        tooltip.setAttribute("data-value", d.data.value)
        tooltip.style.display = "block"
        tooltip.style.top  = e.clientY + 'px';
        tooltip.style.left = e.clientX + 'px';
    }
    const color = d => `var(--col-${d.data.name})`
    var svg = d3.select("#chart")
        .append("svg")
        .attr('width', dimensions.width)
        .attr('height', dimensions.height + dimensions.legend_height)
        .append('g');
    var root = d3.hierarchy(data).sum(d => d.value).sort((a, b) => b.value - a.value);
    d3.treemap()
        .size([dimensions.width, dimensions.height])
        .padding(1)
        .round(false)
        (root)
    //window.data = data; window.root = root;
    svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style("stroke", "#444")
        .attr("data-name", d => d.data.name)
        .attr("data-value", d => d.data.value)
        .attr("data-category", d => d.data.category)
        .attr("fill", d => color(d.parent))
        //.on("mousemove", handleTooltipShow)
        .on("mouseover", handleTooltipShow)
        .on("mouseleave", (e) => {
            tooltip.style.display = "none"
        });
    svg
        .selectAll("foreignObject")
        .data(root.leaves())
        .enter()
        .append("foreignObject")
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .append("xhtml:div")
        .attr("class", "tile-label")
        .html(d => d.data.name);
    legend = svg.append('g').attr('id', 'legend');
    legend
        .selectAll('rect')
        .data(root.children)
        .enter()
        .append('rect')
        .attr('y', 800 + 20)
        .attr('x', (_d, i) => 70 + 150 * i)
        .attr('fill', color)
        .attr('width', '30')
        .attr('height', '30')
        .attr('data-category', d => d.data.name)
        .attr('class', 'legend-item');
    legend
        .selectAll('text')
        .data(root.children)
        .enter()
        .append('text')
        .attr('y', 800 + 42)
        .attr('x', (_d, i) => 110 + 150 * i)
        .text(d => d.data.name)
        .attr('fill', '#ddd')
        .attr("font-size", "20px");
})()

//https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json
//https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json
