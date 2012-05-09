

var width = $("#map-circonscriptions").width();
var height = width * 2.3;

var svg = d3.select("#map-circonscriptions")
    .append("svg:svg")
    .attr("class", "RdPu")
    .attr("height", height)
    .attr("width", width);

var svgG = svg.append("svg:g");

svgG.attr("class","circonscriptionName")
    .attr("transform","translate(0,25)")
    .append("svg:text")
    .attr("class","circonscription")
    .text("");

load(svgG, width, height);


function load(svg, width, height) {

    d3.json("data/geojson/circonscriptions.json", function(json) {
	var path = getProjectionPath(json, width, height);
	updateMap(svg, json, path);
	updateInfoBox(json);
    })

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

    function quantize(d) {
	return "q1-9";
    }

    function updateMap(svg, json, path) {
	var features = svg.selectAll("path")
            .data(json.features, function (d) {
	    return d.properties.name_1;
        });
	
	features
            .enter()
            .append("svg:path");
	
	features
            .attr("class", "ennahdha")
            .attr("id", function(d) {return d.properties.code_circo ? d.properties.code_circo : null})
            .attr("d", path)
            .attr("circonscription-ar", function(d) {return d.properties.name_circo})
            .attr("circonscription-fr", function(d) {return d.properties.name_1})
            .attr("circonscription-code", function(d) {return d.properties.code_circo})
            .on("mouseover", fade(.2))
            .on("mouseout", fade(1))
            .on("click", function(_){window.location = "delegations.html#"+_.properties.name_1})
	    .append("svg:title")
            .text(function(d) {return d.properties.name_circo;});
	
	features.exit().remove(); 
    }
    
    function updateInfoBox(json) {
	var table = d3.select("#info-table").select("tbody");

	var tr = table.selectAll("tr")
	    .data(json.features, function (d) {
		return d.properties.name_1;
            })

	tr.enter()
	    .append("tr")
            .sort(function(a,b) {
		return parseInt(a.properties.code_circo) - parseInt(b.properties.code_circo);
	    } )
	    .on("mouseover", fade(.2))
	    .on("mouseout", fade(1));
	
	var td = tr.selectAll("td")
	    .data(function(d) { return [d.properties.code_circo, d.properties.name_circo, d.properties.name_1]; })
	    .enter().append("td")
	    .text(function(d,i) {return d; });

	tr.exit().remove();
    }
}


