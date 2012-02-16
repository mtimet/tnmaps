
function mouseover(key) {
    return function(d, i){
	svg.selectAll("path")
	    .filter(function(f){return f.properties[key] == d.properties[key]})
            .transition()
	    .duration(200)
	    .ease("bounce")
	    .style("fill", function(d){
		var oldColor = d3.select(this).style("fill");
		return d3.hsl(oldColor).darker().toString();
	    })
	    .style("stroke-width", "1px");
    }
}

function mouseout(key) {
    return function(d, i){
	svg.selectAll("path")
	    .filter(function(f){return f.properties[key] == d.properties[key]})
	    .transition()
            .duration(100)
            .ease("bounce")
            .style("fill",null)
            .style("stroke-width", null);
    }
}


function downloadSVG() {
  d3.select(this).attr("href", "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(
    svg.attr("version", "1.1")
       .attr("xmlns", "http://www.w3.org/2000/svg")
     .node().parentNode.innerHTML))));
}