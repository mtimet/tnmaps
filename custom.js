var width = 290;
var height = 380;

var delegations = ["tunis1","tunis2","ariana","benarous","manubah"
                   ,"nabeul1","nabeul2","zaghouane","bizerte"
                   ,"beja","jendouba","kef","siliana"
                   ,"sousse","monastir","mahdia","sfax1","sfax2"
                   ,"kairouan","kasserine","sidibouzid"
                   ,"gabes","medenine","tataouine"
                   ,"gafsa","tozeur","kebili"];



var svg = d3.select("#maps")
    .selectAll("svg")
    .data(delegations)
    .enter()
    .append("svg:svg")
    .attr("id", function(d) {return d})
    .attr("class", "RdPu")
    .attr("height", height)
    .attr("width", width)
    .append("svg:g")
    .each(update)


function update(name) {
    
    d3.json("data/geojson/" +name + ".json", function(json) {

	var path = getProjectionPath(json, width, height);
	buildMap(name, json, path);
    })
};


function buildMap(name, json, path) {
    var svg = d3.select("svg#"+name).select("g");
    var features = svg.selectAll("path")
        .data(json.features, function (d) {
	    return name + " " + d.properties.name_1 + " " + d.properties.name_2;
        });
    
    features
        .enter()
        .append("svg:path");
    
    features
        .attr("class", quantize)
        .attr("id", function(d) {return d.properties.code_deleg ? d.properties.code_deleg : null})
        .attr("d", path)
        .attr("delegation-ar", function(d) {return d.properties.name_deleg})
        .attr("delegation-fr", function(d) {return d.properties.name_2})
        .attr("delegation-code", function(d) {return d.properties.code_deleg})
        .attr("circonscription-ar", function(d) {return d.properties.name_circo})
        .attr("circonscription-fr", function(d) {return d.properties.name_1})
        .attr("circonscription-code", function(d) {return d.properties.code_circo})
        .on("mouseover", mouseover("code_deleg"))
        .on("mouseout", mouseout("code_deleg"));
    
    features
        .append("svg:title")
        .text(function(d) {return d.properties.name_deleg;});
    
    features.exit().remove(); 
}

function quantize(d) {
    return d.properties.code_deleg ? "q" + (d.properties.code_deleg % 10 % 9) + "-9" : "unidentified";
}

