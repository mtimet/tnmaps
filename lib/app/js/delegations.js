
var DELEGATIONS = [
    { name : "Tunis 1", region : "Grand Tunis"},
    { name : "Tunis 2", region : "Grand Tunis"},
    { name : "Ariana", region : "Grand Tunis"},
    { name : "Ben Arous", region : "Grand Tunis"},
    { name : "Manubah", region : "Grand Tunis"},

    { name : "Nabeul 1", region : "Nord Est"},
    { name : "Nabeul 2", region : "Nord Est"},
    { name : "Zaghouane", region : "Nord Est"},
    { name : "Bizerte", region : "Nord Est"},

    { name : "Beja", region : "Nord West"},
    { name : "Jendouba", region : "Nord West"},
    { name : "Le Kef", region : "Nord West"},
    { name : "Siliana", region : "Nord West"},

    { name : "Sousse", region : "Centre Est"},
    { name : "Monastir", region : "Centre Est"},
    { name : "Mahdia", region : "Centre Est"},
    { name : "Sfax 1", region : "Centre Est"},
    { name : "Sfax 2", region : "Centre Est"},

    { name : "Kairouan", region : "Centre Ouest"},
    { name : "Kasserine", region : "Centre Ouest"},
    { name : "Sidi Bou Zid", region : "Centre Ouest"},

    { name : "Gabes", region : "Sud Est"},
    { name : "Medenine", region : "Sud Est"},
    { name : "Tataouine", region : "Sud Est"},

    { name : "Gafsa", region : "Sud Ouest"},
    { name : "Tozeur", region : "Sud Ouest"},
    { name : "Kebili", region : "Sud Ouest"},
]

var width = $("#map-delegations").width();
var height = width * 3 / 4;

//add "value" field to DELEGATION items
DELEGATIONS.forEach(function(_){
    _.value = _.name.replace(" ","").replace(" ","").toLowerCase(); 
});

//nest delegations by region
var nest = d3.nest()
    .key(function(_){return _.region;})
    .entries(DELEGATIONS);

//build circonscription select element
var select = d3.select(".controls")
    .append("select")
    .attr("id","select-circonscription");

select.selectAll("optgroup")
    .data(nest)
    .enter()
    .append("optgroup")
    .attr("label", function(_) {return _.key;})
    .selectAll("option")
    .data(function(_){return _.values;})
    .enter()
    .append("option")
    .attr("value",function(_){return _.value})
    .attr("selected",function(_){var hash = location.hash.substr(1) ; return (_.value == hash || _.name == hash) ? "selected" : null;})
    .text(function(_){return _.name});


//build the map
var svg = d3.select("#map-delegations")
    .append("svg:svg")
    .attr("class", "RdPu")
    .attr("height", height)
    .attr("width", width);

var delegationsMap = svg.append("svg:g");
var _selectedCirconscription = $("#select-circonscription").val();
var _addLabels = $("#add-labels").is(":checked");

var circonscriptionGroup = svg.append("svg:g")
    .attr("class","circonscriptionName")
    .attr("transform","translate(0,20)");
circonscriptionGroup.append("svg:text")
    .attr("class","delegation")
    .text("");
circonscriptionGroup.append("svg:text")
    .attr("class","circonscription")
    .attr("y",""+height-40+"")
    .text("");

select.on("change", function() {
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
    window.location.hash = "#" + _selectedCirconscription ;
    d3.json("data/geojson/" + _selectedCirconscription + ".json", function(json) {
        _data = json;
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
        .on("mouseover", fade(.2))// mouseover("code_deleg"))
        .on("mouseout", fade(1))//mouseout("code_deleg"))
    
    features
        .append("svg:title")
        .text(function(d) {return d.properties.name_deleg;});
    
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

function updateInfoBox(json) {
    d3.select("#info-title")
	.text(json.features[0].properties.name_1);
    var table = d3.select("#info-table").select("tbody");

    var tr = table.selectAll("tr")
	.data(json.features, function (d) {
	    return d.properties.name_1 + " " + d.properties.name_2;
        })

    tr.enter()
	.append("tr")
	.sort(function(a,b) {
	    if (!a.properties.code_deleg){ 
		return -1;
	    } else if (!b.properties.code_deleg){ 
		return 1;
	    } else {
		return parseInt(a.properties.code_deleg) - parseInt(b.properties.code_deleg);
	    }
	})
	.on("mouseover", fade(.2))
	.on("mouseout", fade(1));

    var td = tr.selectAll("td")
	.data(function(d) { return [d.properties.code_deleg, d.properties.name_deleg, d.properties.name_2]; })
	.enter().append("td")
	.text(function(d) {return d; });

    tr.exit().remove();
}

function quantize(d) {
    return d.properties.code_deleg ? "q" + (d.properties.code_deleg % 10 % 9) + "-9" : "unidentified";
}

