function mouseover(d, i) {
    var oldColor = d3.select(this).style("fill");
    var newColor = d3.hsl(oldColor).darker().toString();
    d3.select(this)
        .transition()
        .duration(100)
        .ease("bounce")
        .style("fill",newColor)
        .style("stroke-width", "1px");
}

function mouseout(d, i) {
    d3.select(this)
        .transition()
        .duration(100)
        .ease("bounce")
        .style("fill",null)
        .style("stroke-width", null);
}


function downloadSVG() {
  d3.select(this).attr("href", "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(
    svg.attr("version", "1.1")
       .attr("xmlns", "http://www.w3.org/2000/svg")
     .node().parentNode.innerHTML))));
}