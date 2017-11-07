var data;
// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, allData) {
    allData.forEach(function (d) {
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
        // console.log(d3.csvParse(d.goals));
        //Break up lists into javascript arrays
        //question
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        // console.log(d3.csvParse(d.TEAM_LIST));
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;
    });
    // console.log(allData[1])
    //new
    data = allData;

    /* Create infoPanel, barChart and Map objects  */
    let infoPanel = new InfoPanel();
    let worldMap = new Map();

    /* DATA LOADING */
    //Load in json data to make map
    d3.json("data/world.json", function (error, world) {
        if (error) throw error;
        worldMap.drawMap(world);
    });

    // Define this as a global variable
    window.barChart = new BarChart(worldMap, infoPanel, allData);

    // Draw the Bar chart for the first time
    barChart.updateBarChart('attendance');
    infoPanel.updateInfo(2014);
    worldMap.updateMap(2014);
});

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {
    // ******* TODO: PART I *******
    // Changed the selected data when a user selects a different
    // menu item from the drop down.
    var dimension = d3.select("#dataset")
        .property("value");
    barChart.chooseData(dimension);
}

//new1 "year"
function getDataByPara(data, para1, para2) {
    var paraData = [];
    for (i = 0; i < data.length; i++) {
        paraData[i] = { year: data[i][para1], value: data[i][para2] };
    }
    return paraData;
}

function sortData(data, sortByParam) {
    switch (sortByParam) {
        case "year":
            data.sort(function (a, b) {
                if (a[sortByParam] < b[sortByParam]) {
                    return -1;
                }
                if (a[sortByParam] > b[sortByParam]) {
                    return 1;
                }
                return 0;
            });
            break;
    }
    return data;
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

function getDataByYear(data, year) {
    var i = 0
    while ((data[i].year != year) && (i < data.length)) {
        i++;
    }
    return data[i];
}