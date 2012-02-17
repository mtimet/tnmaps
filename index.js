

var width = $("#map-circonscriptions").width();
var height = width * 2.3;

var svg = d3.select("#map-circonscriptions")
    .append("svg:svg")
    .attr("class", "RdPu")
    .attr("height", height)
    .attr("width", width);

var circonscriptionGroup = svg.append("svg:g")
    .attr("class","circonscriptionName")
    .attr("transform","translate(0,25)");
circonscriptionGroup.append("svg:text")
    .attr("class","circonscription")
    .text("");


var circonscriptionsMap = svg.append("svg:g");
var _addLabels = $("#add-labels").is(":checked");

d3.select("#select-color").on("change", function() {
    d3.selectAll("svg").attr("class", this.value);
});

d3.select("#add-labels").on("change", function() {
    _addLabels = this.checked;
    load(circonscriptionsMap, width, height);
});



load(circonscriptionsMap, width, height);
loadDeputyData();

function load(svg, width, height) {
    d3.json("data/geojson/circonscriptions.json", function(json) {
	var path = getProjectionPath(json, width, height);
	updateMap(svg, json, path);
	updateLabels(svg, json, path);
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
        .on("mouseover", mouseover("code_circo"))
        .on("mouseout", mouseout("code_circo"));
    
    features
        .append("svg:title")
        .text(function(d) {return d.properties.name_circo;});
    
    features.exit().remove();    
    $("path").tipsy({gravity:'w'}); 
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

function updateInfoBox(json) {
    var table = d3.select("#info-table").select("tbody");
    table.selectAll("tr").remove();

    var counter = 1;
    var tr = table.selectAll("tr")
	.data(json.features, function (d) {
	    return d.properties.name_1;
        })
	.enter()
	.append("tr")
        .sort(function(a,b) {
	    return parseInt(a.properties.code_circo) - parseInt(b.properties.code_circo);
	} )
	.on("mouseover", mouseover("code_circo"))
	.on("mouseout", mouseout("code_circo"));

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

function loadDeputyData(){
    d3.csv("data/deputy_data.csv", function (csv) {
	var table = d3.select("#deputy-table");
	table
	    .select("thead")
            .append("tr")
            .selectAll("th")
            .data(d3.keys(csv[0]))
            .enter()
            .append("th")
            .text(function (d) {return d});
	
	table
            .select("tbody")
            .selectAll("tr")
            .data(csv)
            .enter()
            .append("tr")
            .filter(function(d){return d['Party Name']=='Mouvement Ennahda';})
            .selectAll("td")
            .data(function(d){return d3.entries(d);})
            .enter()
            .append("td")
            .text(function(d) {return d.value;});	
    });
}


