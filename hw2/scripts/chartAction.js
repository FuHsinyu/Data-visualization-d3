var aggrBy = "Country";
var sortBy = "Name";
var encodesBarBy = "Population";
var max;
var min;
var initialData;
var selectedYear;
var dataForCurrentYear;
var displayedData;
function initBarPage(data) {

  initialData = data;

  var range = getMaxYearMinYear(initialData);
  selectedYear = ~~((range[1] + range[0]) / 2);
  d3.select("input[name='range']")
    .attr("min", range[0])
    .attr("max", range[1])
    .attr("value", selectedYear)
    .on("change", changeBarsYear);

  d3.selectAll("input[name='encodesBarRadio']").on("change", changeEncode);
  d3.selectAll("input[name='checkbox']").on("change", barFilter);
  d3.selectAll("input[name='aggrRadio']").on("change", barAggregate);
  d3.selectAll("input[name='sortRadio']").on("change", sortRadio);

  BarPageChanged();
}

function BarPageChanged() {
  d3.select("g").remove();

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  dataForCurrentYear = getFilteredInfoForCurrentYear(initialData, selectedYear);

  displayedData = dataForCurrentYear;
  if (encodesBarBy == "Population") {
    max = d3.max(displayedData, function (d) {
      return d.population;
    });
  } else {
    max = d3.max(displayedData, function (d) {
      return d.gdp;
    });
  }

  min = 0;

  xScale.domain([min, max]);
  yScale.domain(dataForCurrentYear.map(function (d) {
    return d.name;
  }));

  var groups = g.append("g")
    .selectAll("text")
    .data(displayedData)
    .enter()
    .append("g");

  var labels = groups
    .append("text")
    .text(function (d) {
      return d.name
    })
    .attr("x", xScale(min))
    .attr("y", function (d) {
      return yScale(d.name) * 2;
    })
    .attr("dy", "0.7em")
    .attr("dx", "-11em")
    .attr("class", "label");

  var bars = groups
    .append("rect")
    .attr("width", function (d) {
      if (encodesBarBy == "Population") {
        return xScale(d.population);
      } else {
        return xScale(d.gdp)
      }
    })
    .attr("x", xScale(min))
    .attr("y", function (d) {
      return yScale(d.name) * 2;
    })
    .attr("class", "bar");
}

function barFilter() {
  BarPageChanged();
}


function barAggregate() {
  aggrBy = d3.select("input[name='aggrRadio']:checked").property("value");
  BarPageChanged();
}

function changeEncode() {
  encodesBarBy = d3.select("input[name='encodesBarRadio']:checked").property("value");
  BarPageChanged();
}

function sortRadio() {
  sortBy = d3.select("input[name='sortRadio']:checked").property("value");
  BarPageChanged();
}

function changeBarsYear() {
  selectedYear = d3.select("input[name='range']").property("value");
  BarPageChanged();
}


function getFilteredInfoForCurrentYear(data, year) {
  var newData = [];
  for (var i = 0; i < data.length; i++) {
    var currentYears = data[i].years;
    var j = 0;
    while (currentYears[j].year != year) {
      j++;
    }
    getCheckedContinents();
    if (aggrBy == "Country") {
      if (!Array.isArray(checkedContinents) || !checkedContinents.length) {
        newData[i] = {
          alpha2_code: data[i].alpha2_code,
          continent: data[i].continent,
          gdp: !!(data[i].years)[j].gdp ? (data[i].years)[j].gdp : "",
          latitude: data[i].latitude,
          life_expectancy: (data[i].years)[j].life_expectancy,
          longitude: data[i].longitude,
          name: data[i].name,
          population: (data[i].years)[j].population,
          year: (data[i].years)[j].year
        }
      } else {
        if (checkedContinents.indexOf(data[i].continent) > -1) {
          newData.push({
            alpha2_code: data[i].alpha2_code,
            continent: data[i].continent,
            gdp: !!(data[i].years)[j].gdp ? (data[i].years)[j].gdp : "",
            latitude: data[i].latitude,
            life_expectancy: (data[i].years)[j].life_expectancy,
            longitude: data[i].longitude,
            name: data[i].name,
            population: (data[i].years)[j].population,
            year: (data[i].years)[j].year
          });
        }
      }
    } else {

    }
  }
  return sortData(newData, sortBy);
}


function sortData(data, sortByParam) {
  switch (sortByParam) {
    case "Name":
      data.sort(sortByKey("name"));
      break;
    case "Population":
      data.sort(sortByKey("population"));
      break;
    case "GDP":
      data.sort(sortByKey("gdp"));
      break;
  }
  return data;
}

function sortByKey(key, reverse) {
  var moveSmaller = reverse ? 1 : -1;
  var moveLarger = reverse ? -1 : 1;
  return function (a, b) {
    if (a[key] < b[key]) {
      return moveSmaller;
    }
    if (a[key] > b[key]) {
      return moveLarger;
    }
    return 0;
  };
}
