var xym = d3.geo.mercator();

var translate = xym.translate();
translate[0] = -17;
translate[1] = 2000;

xym.translate(translate);
xym.scale(17838);

var svg = d3.select("body").append("svg");
svg.append("g").attr("id", "states");

d3.json("geojson/delegations.geojson", function(collection) {
  var map = svg.select("#states")
               .selectAll("path")
               .data(collection.features)
               .enter()
               .append("path")
               .attr("d", d3.geo.path().projection(xym));
});
