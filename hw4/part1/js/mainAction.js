var data;
var selectedYear = 2012;
var width = 1000;
var height = 1700;

var foci = {
  "Africa": {
    x_horizontal: width * 0.2,
    y_horizontal: height / 4,
    x_pie: width * 0.15,
    y_pie: height / 4,
    color: "yellow"
  },
  "Americas": {
    x_horizontal: width * 0.4,
    y_horizontal: height / 4,
    x_pie: width * 0.25,
    y_pie: height / 8,
    color: "brown"
  },
  "Europe": {
    x_horizontal: width * 0.6,
    y_horizontal: height / 4,
    x_pie: width * 0.4,
    y_pie: height / 8,
    color: "red"
  },
  "Asia": {
    x_horizontal: width * 0.8,
    y_horizontal: height / 4,
    x_pie: width * 0.5,
    y_pie: height / 4,
    color: "blue"
  },
  "Oceania": {
    x_horizontal: width * 0.95,
    y_horizontal: height / 4,
    x_pie: width * 0.3,
    y_pie: height / 3,
    color: "green"
  }
};

var continentNodes = {
  Africa: [],
  Asia: [],
  Oceania: [],
  Americas: [],
  Europe: []
}

var force = d3.layout.force()
  .size([width, height])
  .charge(-5000)
  .gravity(.5)
  .linkStrength(0)
  .on("tick", tick)
  .on("start", function(d) {})
  .on("end", function(d) {});

d3.json("data/countries_1995_2012.json", function(allData) {
  data = allData;
  sortData(data, "population", 1);
  let nodes = initNodes(data);
  let links = initLinks(nodes);

  window.graph = new Graph(nodes, links, data);
  graph.updateGraph();

  for (var j = 0; j < graph.nodes.length; j++) {
    continentNodes[graph.nodes[j].continent].push(graph.nodes[j]);
  }
});

function updateGraph() {
  graph.applyLayaut();
}

function initNodes(actualData) {
  let nb_nodes = actualData.length;
  let k = -1;
  let nodes = d3.range(nb_nodes).map(function() {

    k++;

    var currentYears = actualData[k].years;
    var j = 0;
    while (currentYears[j].year != selectedYear) {
      j++;
    }

    return {
      id: actualData[k].country_id,
      country: actualData[k].name,
      continent: actualData[k].continent,
      latitude: actualData[k].latitude,
      longitude: actualData[k].longitude,
      population: currentYears[j].population,
      gdp: currentYears[j].gdp,
      life_expectancy: currentYears[j].life_expectancy,
      top_partners: currentYears[j].top_partners,
    };
  });
  return nodes;
}

function initLinks(nodes) {
  let links = [];

  for (var i = 0; i < nodes.length; i++) {
    var partners = nodes[i].top_partners;
    for (var n = 0; n < nodes.length; n++) {
      for (var m = 0; m < partners.length; m++) {
        if (partners[m].country_id == nodes[n].id) {
          links.push({
            "source": i,
            "target": n
          });
        }
      }
    }
  }
  return links;
}

function lineLayout() {
  force.stop();
  var scale = d3.select('input[name="scaleRadio"]:checked').property("value");
  if (scale == "default") {
    defaultScale();
  } else {
    byValueScale();
  }
}

function defaultScale() {
  var sortBy = d3.select("select").property('value');
  sortData(graph.nodes, sortBy, 1);
  var step = height / data.length;
  graph.nodes.forEach(function(d, i) {
    d.x = width / 2;
    d.y = step * i;
  });
  graphUpdate(2000);
}

function byValueScale() {
  var selectedOption = d3.select("select").property('value');
  var minAndMaxVal = getMaxAndMinValue(graph.nodes, selectedOption);
  var maxVal = minAndMaxVal[1];
  var minVal = minAndMaxVal[0]
  graph.nodes.forEach(function(d, i) {
    d.x = width / 2;
    d.y = (1 - d[selectedOption] / maxVal) * height;
  });
  graphUpdate(2000);
}

function twoDemisionLayout() {
  force.stop();

  var axis = d3.select('input[name="axisRadio"]:checked').property("value");
  if (axis == "gdp_population") {
    populationGDPAxis();
  } else {
    longitudeLatitudeAxis();
  }
}

function populationGDPAxis() {
  var maxGDP = (getMaxAndMinValue(graph.nodes, "gdp"))[1];
  var maxPopulation = (getMaxAndMinValue(graph.nodes, "population"))[1];
  graph.nodes.forEach(function(d, i) {
    d.x = 50 + (d["gdp"] / maxGDP) * (width - 50);
    d.y = 50 + (1 - d["population"] / maxPopulation) * (height - 50);
  });
  graphUpdate(2000);
}

function longitudeLatitudeAxis() {
  var minAndMaxLong = getMaxAndMinValue(graph.nodes, "longitude");
  var minAndMaxLat = getMaxAndMinValue(graph.nodes, "latitude");
  graph.nodes.forEach(function(d, i) {
    d.x = 50 + ((-minAndMaxLong[0] + d["longitude"]) / (minAndMaxLong[1] - minAndMaxLong[0])) * (width - 200);
    d.y = 50 + ((-minAndMaxLong[0] + d["latitude"]) / (minAndMaxLong[1] - minAndMaxLong[0])) * (height - 50);
  });
  graphUpdate(2000);
}

function tick(d) {

  var k = 6 * d.alpha;

  var sepration = d3.select('input[name="circleSeparation"]').property("checked");
  var separationType = d3.select('input[name="circleRadio"]:checked').property("value");

  if (sepration && separationType == "horizonral") {
    graph.nodes.forEach(function(o, i) {
      o.y += (foci[o.continent].y_horizontal - o.y) * k;
      o.x += (foci[o.continent].x_horizontal - o.x) * k;
    });
  } else if (sepration && separationType == "pie") {
    graph.nodes.forEach(function(o, i) {
      o.y += (foci[o.continent].y_pie - o.y) * k;
      o.x += (foci[o.continent].x_pie - o.x) * k;
    });
  } else {
    graph.nodes.forEach(function(o, i) {
      o.y += (width / 4 - o.y) * k;
      o.x += (height / 4 - o.x) * k;
    });
  }
  graphUpdate(500);

}

function circleLayout() {
  force.nodes(graph.nodes)
    .links(graph.links)
    .start();
  graphUpdate(500);
}

function ringLayout() {
  force.stop();
  var sepration = d3.select('input[name="ringSeparation"]').property("checked");
  var sortBy = d3.select('input[name="ringSortRadio"]:checked').property("value");

  var pie = d3.layout.pie()
    .sort(function(a, b) {
      return a[sortBy] - b[sortBy];
    })
    .value(function(d, i) {
      return 1; // We want an equal pie share/slice for each point
    });

  if (!sepration) {
    var arc = d3.svg.arc()
      .outerRadius(Math.min(height, width) / 2);
    graph.nodes = pie(graph.nodes).map(function(d, i) {
      d.innerRadius = 0;
      d.outerRadius = Math.min(height, width) / 3;
      d.data.x = arc.centroid(d)[0] + width / 3;
      d.data.y = arc.centroid(d)[1] + height / 4;
      return d.data;
    });
  } else {

    var multArc = d3.svg.arc()
      .outerRadius(Math.min(height, width) / 10);

    var keys = Object.keys(continentNodes);

    for (var k = 0; k < keys.length; k++) {
      pie(continentNodes[keys[k]]).map(function(d, i) {
        d.innerRadius = 0;
        d.outerRadius = Math.min(height, width) / 10;
        d.data.x = multArc.centroid(d)[0] + foci[keys[k]].x_pie;
        d.data.y = multArc.centroid(d)[1] + foci[keys[k]].y_pie;;
        return d.data;
      });
    }
  }

  graphUpdate(2000);
}

function graphUpdate(duration) {
  d3.selectAll(".node").transition() 
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  d3.selectAll(".link").transition()
    .attr("x1", function(d) {
      return d.target.x;
    })
    .attr("y1", function(d) {
      return d.target.y;
    })
    .attr("x2", function(d) {
      return d.source.x;
    })
    .attr("y2", function(d) {
      return d.source.y;
    });
}

function chooseData() {
  selectedOption = d3.select("select").property('value');
  sortData(graph.nodes, selectedOption, 1);
  graph.applyLayaut();
}

function getMaxAndMinValue(data, key) {
  var max = 0,
    min = 0;
  for (var i = 0; i < data.length; i++) {
    var curretVal = !!data[i][key] ? data[i][key] : 0;
    if (curretVal > max) {
      max = curretVal;
    }
    if (curretVal < min) {
      min = curretVal;
    }
  }
  return [min, max];
}


function sortData(data, sortByParam, reverse) {
  switch (sortByParam) {
    case "name":
      data.sort(sortByKey("name", reverse));
      break;
    case "population":
      data.sort(sortByKey("population", reverse));
      break;
    case "gdp":
      data.sort(sortByKey("gdp", reverse));
      break;
    case "life_expectancy":
      data.sort(sortByKey("life_expectancy", reverse));
      break;
    case "longitude":
      data.sort(sortByKey("longitude", reverse));
      break;
    case "latitude":
      data.sort(sortByKey("latitude", reverse));
      break;
  }
  return data;
}

function sortByKey(key, reverse) {
  var moveSmaller = reverse ? 1 : -1;
  var moveLarger = reverse ? -1 : 1;
  return function(a, b) {
    if (a[key] < b[key]) {
      return moveSmaller;
    }
    if (a[key] > b[key]) {
      return moveLarger;
    }
    return 0;
  };
}
