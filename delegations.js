


var width = $("#map-delegations").width();
var height = width * 3 / 4;

var svg = d3.select("#map-delegations")
    .append("svg:svg")
    .attr("class", "RdPu")
    .attr("height", height)
    .attr("width", width);

var delegationsMap = svg.append("svg:g");
var _selectedCirconscription = $("#select-circonscription").val();
var _addLabels = $("#add-labels").is(":checked");
var _selectedDelegation = null;
var _selectedFeature = null;
var _data = null;

d3.select("#select-circonscription").on("change", function() {
    _selectedCirconscription = this.value;
    update(delegationsMap, width, height);
});

d3.select("#select-color").on("change", function() {
    d3.selectAll("svg").attr("class", this.value);
});

d3.select("#add-labels").on("change", function() {
    _addLabels = this.checked;
    update(delegationsMap, width, height);
});

d3.select("#download-svg").on("click", downloadSVG);

update(delegationsMap, width, height);

function update(svg, width, height) {
    d3.json("geojson/" + _selectedCirconscription + ".geojson", function(json) {
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
	    return d.properties.name_1 + " " + d.properties.name_2;
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
        .on("click", click)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
    
    features
        .append("svg:title")
        .text(function(d) {return d.properties.name_2;});
    
    features.exit().remove();     
}
function updateLabels(svg, json, path) {
    if (_addLabels){
	var labels =  svg.selectAll("text")
            .data(json.features, function (d) {
		return d.properties.name_1 + " " + d.properties.name_2;
            });
	
	labels
            .enter()
            .append("svg:text")
            .attr("class","delegation-label")
            .text(function(d){return d.properties.name_2;})  
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
    d3.select("#info-title")
	.text(_data.features[0].properties.name_1);
    var table = d3.select("#info-table").select("tbody");
    table.selectAll("tr").remove();

    if (false && selectedDelegation){
	table.selectAll("tr")
	    .data(_selectedFeature.properties)
            .append("tr")
            .text(function(d){return d });
    } else {
	var counter = 1;
        var tr = table.selectAll("tr")
	    .data(_data.features, function (d) {
		return d.properties.name_1 + " " + d.properties.name_2;
            })
	    .enter()
	    .append("tr")
	    .sort(function(a,b) {
		if (!a.properties.code_deleg){ 
		    return -1;
		} else if (!b.properties.code_deleg){ 
		    return 1;
		} else {
		    return parseInt(a.properties.code_deleg) - parseInt(b.properties.code_deleg);
		}
	    });
	var td = tr.selectAll("td")
	    .data(function(d) { return [d.properties.code_deleg, d.properties.name_deleg, d.properties.name_2]; })
	    .enter().append("td")
	    .text(function(d) {return d; });
    }
}

function quantize(d) {
    return d.properties.code_deleg ? "q" + (d.properties.code_deleg % 10 % 9) + "-9" : "unidentified";
}


function click(d, i) {
/*
    var previousDelegation = _selectedDelegation;
    var previousFeature = _selectedFeature;
    _selectedDelegation = (_selectedDelegation != null && _selectedDelegation == d.properties.name_2) ? null : d.properties.name_2;
    
    if (previousDelegation && previousFeature){
	d3.select(previousFeature)
            .transition()
            .duration(100)
            .ease("bounce")
            .style("fill",null)
            .style("stroke-width", null)
    }
    if (_selectedDelegation) {
	_selectedFeature = this;
	d3.select(_selectedFeature)
            .transition()
            .duration(100)
            .ease("bounce")
            .style("fill","#FF0000")
            .style("stroke-width", "4px")
    }
    updateInfoBox()
*/
}
