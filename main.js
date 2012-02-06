
var proj = d3.geo.mercator().scale(1).translate([0, 0]),
    path = d3.geo.path().projection(proj);

var margin = 30,
    width = window.innerWidth - margin,
    height = window.innerHeight - margin;

var stl = "fill: rgb(209, 210, 213); fill-opacity: 1; stroke-width: 1.87696; stroke-miterlimit: 4; stroke-dasharray: none; stroke: rgb(255, 255, 255); stroke-opacity: 1;";

var svg = d3.select("body")
        .append("svg:svg")
        .attr("height", height)
        .attr("width", width);
var map = svg.append("svg:g");

d3.json("geojson/delegations.geojson", function(json) {
    var bounds0 = d3.geo.bounds(json),
        bounds = bounds0.map(proj),
        xscale = width/Math.abs(bounds[1][0] - bounds[0][0]),
        yscale = height/Math.abs(bounds[1][1] - bounds[0][1]),
        scale = Math.min(xscale, yscale);

    proj.scale(scale);
    proj.translate(proj([-bounds0[0][0], -bounds0[1][1]]));

    map.selectAll("path")
        .data(json.features)
        .enter().append("svg:path")
        .attr("d", path)
        .attr("style", stl);
});
