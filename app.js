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