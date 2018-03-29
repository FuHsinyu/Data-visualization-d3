var initialData = null;

var continents = ["Asia", "Africa", "Europe", "Oceania", "Americas"];
var checkedContinents = [];
var selectedYear;

/**
    0  - not sorted,
    1  - asc sorted,
    -1 - desc sorted
*/
var sortFlag = 0;

function Continent(name) {
  this.name = name;
  this.continent = name;
  this.gdp = 0;
  this.life_expectancy = 0;
  this.population = 0;
  this.year = selectedYear;
  this.alpha2_code = 0;
  this.latitude = 0;
  this.longitude = 0;
}

function getAggregatedByContinentsInfo(data) {
  var aggregatedInf = [];
  var americas = new Continent("Americas");
  var asia = new Continent("Asia");
  var europe = new Continent("Europe");
  var oceania = new Continent("Oceania");
  var africa = new Continent("Africa");

  for (var i = 0; i < data.length; i++) {
    switch (data[i].continent) {
      case "Americas":
        americas.population += data[i].population;
        americas.gdp += data[i].gdp;
        americas.life_expectancy += data[i].life_expectancy;
        americas.alpha2_code++;
        break;
      case "Asia":
        asia.population += data[i].population;
        asia.gdp += data[i].gdp;
        asia.life_expectancy += data[i].life_expectancy;
        asia.alpha2_code++;
        break;
      case "Europe":
        europe.population += data[i].population;
        europe.gdp += data[i].gdp;
        europe.life_expectancy += data[i].life_expectancy;
        europe.alpha2_code++;
        break;
      case "Oceania":
        oceania.population += data[i].population;
        oceania.gdp += data[i].gdp;
        oceania.life_expectancy += data[i].life_expectancy;
        oceania.alpha2_code++;
        break;
      case "Africa":
        africa.population += data[i].population;
        africa.gdp += data[i].gdp;
        africa.life_expectancy += data[i].life_expectancy;
        africa.alpha2_code++;
        break;
    }
  }

  americas.life_expectancy /= americas.alpha2_code;
  asia.life_expectancy /= asia.alpha2_code;
  europe.life_expectancy /= europe.alpha2_code;
  oceania.life_expectancy /= oceania.alpha2_code;
  africa.life_expectancy /= africa.alpha2_code;

  aggregatedInf.push(americas);
  aggregatedInf.push(asia);
  aggregatedInf.push(europe);
  aggregatedInf.push(oceania);
  aggregatedInf.push(africa);
  return aggregatedInf;
}

function getMaxAndMinYears(data) {
  var max = 2012;
  var min = 2012;
  for (var i = 0; i < data.length; i++) {
    var currentYears = data[i].years;
    for (var j = 0; j < currentYears.length; j++) {
      var curruntYear = currentYears[j].year;
      if (max < curruntYear) {
        max = curruntYear;
      }
      if (min > curruntYear) {
        min = curruntYear;
      }
    }
  }
  return [min, max];
}

function getInfoForCurrentYear(data, year) {
  var newData = [];
  for (var i = 0; i < data.length; i++) {
    var currentYears = data[i].years;
    var j = 0;
    while (currentYears[j].year != year) {
      j++;
    }

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
  }
  return newData;
}

function getCheckedContinents(){
  d3.selectAll("input[name='checkbox']").each(function() {
    var currentContinent = d3.select(this);
    if (currentContinent.property("checked")) {
      if (checkedContinents.indexOf(currentContinent.attr("value")) < 0) {
        checkedContinents.push(currentContinent.attr("value"));
      }
    } else {
      var continentIndex = checkedContinents.indexOf(currentContinent.attr("value"));
      if (continentIndex > -1) {
        checkedContinents.splice(continentIndex, 1);
      }
    }
  });
}
