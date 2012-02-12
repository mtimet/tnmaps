var width = $("#map-circonscriptions").width();
var height = width * 2.3;

var circonscriptionsSVG = d3.select("#map-circonscriptions")
    .append("svg:svg")
    .attr("class", "RdPu")
    .attr("height", height)
    .attr("width", width);

var circonscriptionsMap = circonscriptionsSVG.append("svg:g");
var _addLabels = $("#add-labels").is(":checked");
var _data = null;


d3.select("#select-color").on("change", function() {
    d3.selectAll("svg").attr("class", this.value);
});

d3.select("#add-labels").on("change", function() {
    _addLabels = this.checked;
    load(circonscriptionsMap, width, height);
});

load(circonscriptionsMap, width, height);

function load(svg, width, height) {
    d3.json("geojson/circonscriptions.geojson", function(json) {
        _data = json;
	var path = getProjectionPath(json, width, height);
	updateMap(svg, json, path);
	updateLabels(svg, json, path);
	updateInfoBox();
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
 
function updateMap(svg, json, path) {
    var features = svg.selectAll("path")
        .data(json.features, function (d) {
	    return d.properties.name_1;
        });
    
    features
        .enter()
        .append("svg:path");
    
    features
        .attr("class", quantize)
        .attr("id", function(d) {return d.properties.code_circo ? d.properties.code_circo : null})
        .attr("d", path)

        .attr("circonscription-ar", function(d) {return d.properties.name_circo})
        .attr("circonscription-fr", function(d) {return d.properties.name_1})
        .attr("circonscription-code", function(d) {return d.properties.code_circo})
        .on("click", click)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
    
    features
        .append("svg:title")
        .text(function(d) {return d.properties.name_1;});
    
    features.exit().remove();     
}
function updateLabels(svg, json, path) {
    if (_addLabels){
	var labels =  svg.selectAll("text")
            .data(json.features, function (d) {
		return d.properties.name_1;
            });
	
	labels
            .enter()
            .append("svg:text")
            .attr("class","circonscription-label")
            .text(function(d){return d.properties.name_1;})  
            .attr("x", function(d){return (path.centroid(d))[0];}) 
            .attr("y", function(d){return (path.centroid(d))[1];}) 
            .attr("fill", "black") 
            .attr("text-anchor", "middle") ;
    
	labels.exit().remove(); 
    } else {
	svg.selectAll("text").remove();
    }
}

function updateInfoBox() {
    var table = d3.select("#info-table").select("tbody");
    table.selectAll("tr").remove();

    var counter = 1;
    var tr = table.selectAll("tr")
	.data(_data.features, function (d) {
	    return d.properties.name_1;
        })
	.enter()
	.append("tr")
        .sort(function(a,b) {
	    return parseInt(a.properties.code_circo) - parseInt(b.properties.code_circo);
	} );

    var td = tr.selectAll("td")
	.data(function(d) { return [d.properties.code_circo, d.properties.name_circo, d.properties.name_1]; })
	.enter().append("td")
	.text(function(d) {return d; });
}

function quantize(d) {
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
    return "q" + q + "-9";
}


function click(d, i) {
}

