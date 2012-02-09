


var width = $("#map").width();
var height = width;

var svg = d3.select("#map")
    .append("svg:svg")
    .attr("class", "hero-unit")
    .attr("height", height)
    .attr("width", width);

var map = svg.append("svg:g");
window.delegations = null;

load_delegation("tunis1");

d3.select("#select-delegation").on("change", function() {
  load_delegation(this.value);
});

function load_delegation(name) {
d3.json("geojson/" + name + ".geojson", function(json) {

var proj = d3.geo.mercator().scale(1).translate([0, 0]),
    path = d3.geo.path().projection(proj);

    var bounds0 = d3.geo.bounds(json),
        bounds = bounds0.map(proj),
        xscale = width/Math.abs(bounds[1][0] - bounds[0][0]),
        yscale = height/Math.abs(bounds[1][1] - bounds[0][1]),
        scale = Math.min(xscale, yscale);

    proj.scale(scale);
    proj.translate(proj([-bounds0[0][0], -bounds0[1][1]]));
    
    delegations = map.selectAll("path")
        .data(json.features, function (d) {
            return d.properties.name_1 + " " + d.properties.name_2;
        });

    delegations
        .enter()
        .append("svg:path");

    delegations
        .attr("class", quantize)
        .attr("id", function(d) {return d.properties.code_deleg ? d.properties.code_deleg : null})
        .attr("d", path)
        .attr("delegation-ar", function(d) {return d.properties.name_deleg})
        .attr("delegation-fr", function(d) {return d.properties.name_2})
        .attr("delegation-code", function(d) {return d.properties.code_deleg})
        .attr("circonscription-ar", function(d) {return d.properties.name_circo})
        .attr("circonscription-fr", function(d) {return d.properties.name_1})
        .attr("circonscription-code", function(d) {return d.properties.code_circo})
        .on("click", click)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    delegations
        .append("svg:title")
        .text(function(d) {return d.properties.name_deleg});
        
    delegations.exit().remove(); 

    function quantize(d) {
	return d.properties.code_deleg ? "q" + (d.properties.code_deleg % 10) + "-9" : "unidentified";
    }

   function click(d, i) {
       console.log("click", d, i);
   }

   function mouseover(d, i) {
       var oldColor = d3.select(this).style("fill");
       var newColor = d3.hsl(oldColor).darker().toString();
       d3.select(this)
           .transition()
           .duration(100)
           .ease("bounce")
           .style("fill",newColor)
           .style("stroke-width", "4px")
   }

   function mouseout(d, i) {
       d3.select(this)
           .transition()
           .duration(100)
           .ease("bounce")
           .style("fill",null)
           .style("stroke-width",null)
           .style("stroke", null)
   }
   function project(width) {

   }
})
};
