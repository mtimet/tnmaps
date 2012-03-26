
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
	    .style("stroke-width", "1px")
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


function getProjectionPath(json, width, height){
    var proj = d3.geo.mercator().scale(1).translate([0, 0]),
    path = d3.geo.path().projection(proj);

    var bounds0 = d3.geo.bounds(json),
        bounds = bounds0.map(proj),
        xscale = width/Math.abs(bounds[1][0] - bounds[0][0]),
        yscale = height/Math.abs(bounds[1][1] - bounds[0][1]),
        scale = Math.min(xscale, yscale);

    proj.scale(scale);
    proj.translate(proj([-bounds0[0][0], -bounds0[1][1]]));

    return path;
}

function downloadSVG() {
  d3.select(this).attr("href", "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(
    svg.attr("version", "1.1")
       .attr("xmlns", "http://www.w3.org/2000/svg")
     .node().parentNode.innerHTML))));
}