

var width = $("#map").width();
var height = width * 2.3;

var svg = d3.select("#map")
    .append("svg:svg")
    .attr("class", "RdPu")
    .attr("height", height)
    .attr("width", width);

var map = svg.append("svg:g");
var _addLabels = $("#add-labels").is(":checked");

d3.select("#select-color").on("change", function() {
    d3.selectAll("svg").attr("class", this.value);
});

d3.select("#add-labels").on("change", function() {
    _addLabels = this.checked;
    load(circonscriptionsMap, width, height);
});



load(map, width, height);


function load(map, width, height) {
    d3.json("data/geojson/governorates.json", function(json) {
	var path = getProjectionPath(json, width, height);
	updateMap(map, json, path);
	updateLabels(map, json, path);
	updateInfoBox(json);
    })
};


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
 
function updateMap(map, json, path) {
    var features = map.selectAll("path")
        .data(json.features, function (d) {
	    return d.properties.code_gov;
        });
    
    features
        .enter()
        .append("svg:path");
    
    features
        .attr("class", quantize)
        .attr("id", function(d) {return d.properties.code_gov ? d.properties.code_gov : null})
        .attr("d", path)
        .on("mouseover", mouseover("code_gov"))
        .on("mouseout", mouseout("code_gov"));
    
    features
        .append("svg:title")
        .text(function(d) {return d.properties.name_gov;});
    
    features.exit().remove();
}
function updateLabels(map, json, path) {
    if (_addLabels){
	var labels =  map.selectAll("text")
            .data(json.features, function (d) {
		return d.properties.code_gov;
            });
	
	labels
            .enter()
            .append("svg:text")
            .text(function(d){return d.properties.name_gov;})  
            .attr("x", function(d){return (path.centroid(d))[0];}) 
            .attr("y", function(d){return (path.centroid(d))[1];}) 
            .attr("fill", "black") 
            .attr("text-anchor", "middle") ;
    
	labels.exit().remove(); 
    } else {
	map.selectAll("text").remove();
    }
}

function updateInfoBox(json) {
    var table = d3.select("#info-table").select("tbody");
    table.selectAll("tr").remove();

    var counter = 1;
    var tr = table.selectAll("tr")
	.data(json.features, function (d) {
	    return d.properties.code_gov;
        })
	.enter()
	.append("tr")
        .sort(function(a,b) {
	    return parseInt(a.properties.code_gov) - parseInt(b.properties.code_gov);
	} )
	.on("mouseover", mouseover("code_gov"))
	.on("mouseout", mouseout("code_gov"));

    var td = tr.selectAll("td")
	.data(function(d) { return [d.properties.code_gov, d.properties.name_gov, d.properties.name_govfr]; })
	.enter().append("td")
	.text(function(d) {return d; });
}

function quantize(d,i) {
    var code = d.properties.code_circo;
    var q = null;
    switch (code % 10){
    case 0:
	q = (code/10)% 10;
	break;
    case 1:
	q = 0;
	break;
    case 2:
	q = 8;
	break;
    }
    return "q" + (i % 9) + "-9";
}




