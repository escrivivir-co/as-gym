const drag = simulation => {

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

const legend = (data) => {
    // select the svg area
    var SVG = d3.select("#leyenda")

    // create a list of keys
    var keys = data.types;

    // Add one dot in the legend for each name.
    var size = 20
    SVG.selectAll("mydots")
        .data(keys)
        .enter()
        .append("rect")
            .attr("x", 0)
            .attr("y", function(d,i){ return i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill",  d => data.color(d.id))

    // Add one dot in the legend for each name.
    SVG.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
            .attr("x", 0 + size*1.2)
            .attr("y", function(d,i){ return i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill",  d => data.color(d.id))
            .text(function(d){ return d.id})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");
}
console.log('creating chart')
d3.json("./files/red.json").then((data) => {

    const links = data;
    const nodes = Array.from(
        new Set(
            links.flatMap(l => [l.source, l.target])
        ),
        id => ({id})
    );
    const types = Array.from(
        new Set(
            links.flatMap(l => [l.type])
        ),
        id => ({id})
    );
    color = d3.scaleOrdinal(types, d3.schemeCategory10);
    linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
    console.log('Loaded data', nodes, types);
    const svg = ForceGraph({
        svg: "arbol",
        links, nodes, types, color, linkArc, drag
    });
    legend({types, color});
    console.log('D3 svg', svg)

});

console.log('creating chart')
d3.json("./files/arbol.json").then((tree) => {

    const svgTree = TreeChart({
        svg: "arbol1",
        tree
    });
});
