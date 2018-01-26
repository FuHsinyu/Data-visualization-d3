var data;

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function(error, allData) {
  allData.forEach(function(d) {
    // Convert numeric values to 'numbers'
    d.year = +d.YEAR;
    d.teams = +d.TEAMS;
    d.matches = +d.MATCHES;
    d.goals = +d.GOALS;
    d.avg_goals = +d.AVERAGE_GOALS;
    d.attendance = +d.AVERAGE_ATTENDANCE;
    // Lat and Lons of gold and silver medals teams
    d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
    d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

    //Break up lists into javascript arrays
    d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
    d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;
  });

  data = allData;

  /* Create infoPanel, barChart and Map objects  */
  let infoPanel = new InfoPanel();
  let worldMap = new Map();

  /* DATA LOADING */
  //Load in json data to make map
  d3.json("data/world.json", function(error, world) {
    if (error) throw error;
    worldMap.drawMap(world);
  });

  // Define this as a global variable
  window.barChart = new BarChart(worldMap, infoPanel, allData);

  // Draw the Bar chart for the first time
  barChart.updateBarChart('attendance');
});

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {
  var dimension = d3.select("#dataset").property("value");
  barChart.chooseData(dimension);
}

function sortData(data, sortByParam) {
  switch (sortByParam) {
    case "year":
      data.sort(sortByKey("year"));
      break;
  }
  return data;
}

function sortByKey(key, reverse) {
  var moveSmaller = reverse ? 1 : -1;
  var moveLarger = reverse ? -1 : 1;
  return function(a, b) {
    if (a === null && b === null)
      return 0;
    if (a === null)
      return moveSmaller;
    if (b === null)
      return moveLarger;
    if (a[key] < b[key]) {
      return moveSmaller;
    }
    if (a[key] > b[key]) {
      return moveLarger;
    }
    return 0;
  };
}

function getCurrentData(data, selectedDimension) {
  var currentData = [];
  for (var j = 0; j < data.length; j++) {
    currentData[j] = {
      year: data[j].year,
      value: data[j][selectedDimension]
    };
  }
  return currentData;
}


function getDataByYear(data, year) {
  var i = 0
  while ((data[i].year != year) && (i < data.length)) {
    i++;
  }
  return data[i];
}


function findMaxVal(data) {
  var maxVal = 0;
  for (var i = 0; i < data.length; i++) {
    if (maxVal < data[i].value) {
      maxVal = data[i].value;
    }
  }
  return maxVal;
}
