/**
    0  - not sorted,
    1  - asc sorted,
    -1 - desc sorted
*/
var sortFlag = 0;
var columns = ["Team", "Goals", "Result", "Wins", "Losses", "Total Games"];
var actualData;
/**
 * Loads in the table information from fifa-matches.json
 */
d3.json('data/fifa-matches.json', function(error, data) {

  /**
   * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
   *
   */
  d3.csv("data/fifa-tree.csv", function(error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function(d, i) {
      d.id = i;
    });

    //Create Tree Object
    let tree = new Tree();
    tree.createTree(csvData);

    //Create Table Object and pass in reference to tree object (for hover linking)
    let table = new Table(data, tree);

    table.createTable();
    table.updateTable();
  });
});



function getMaxNumOfSomething(teamData, something) {
  var max = 0;
  if (something == "goals") {
    for (var k = 0; k < teamData.length; k++) {
      if (max < teamData[k].value["Goals Conceded"]) {
        max = teamData[k].value["Goals Conceded"]
      }
      if (max < teamData[k].value["Goals Made"]) {
        max = teamData[k].value["Goals Made"]
      }
    }
  } else {
    for (var k = 0; k < teamData.length; k++) {
      if (max < teamData[k].value["something"]) {
        max = teamData[k].value["something"]
      }
    }
  }
  return max;
}

function columnHeadersInit() {
  var colHeaders = d3.selectAll("#colHeaders").selectAll("td");

  colHeaders.data(columns).enter();

  colHeaders.attr("class", "colHeaders");
}

function getNeededData(data) {
  var res = [];
  var rowObj;
  for (var i = 0; i < data.length; i++) {
    rowObj = {
      "Team": data[i].key,
      "Goals": [data[i].value["Goals Conceded"], data[i].value["Goals Made"]],
      "Result": data[i].value["Result"]["label"],
      "Wins": data[i].value["Wins"],
      "Losses": data[i].value["Losses"],
      "Total Games": data[i].value["TotalGames"],
      "Games": data[i].value["games"]
    };
    res.push(rowObj);
  }
  return res;
}

function tableContentInit(data) {
  var tbody = d3.select("#matchTable").select("tbody");
  tbody.selectAll('tr').remove();
  // create a row for each object in the data
  actualData = data;
  var rows = tbody.selectAll('tr')
    .data(actualData)
    .enter()
    .append('tr')
    .attr("id", function(d) {
      return d["Team"];
    });

  // create a cell in each row for each column
  var cells = rows.selectAll('td')
    .data(function(row) {
      return columns.map(function(column) {
        return {
          column: column,
          value: row[column]
        };
      });
    })
    .enter()
    .append('td')
    .attr("class", function(d) {
      if (d.column == "Wins" || d.column == "Losses" || d.column == "Total Games") {
        return "chartCol";
      } else if (d.column == "Goals") {
        if (d.value[2] == "gameInfo") {
          return "additionalRowGoals";
        }
        return "goalsCol";
      } else if (d.column == "Team") {
        return "teamCol";
      } else {
        return "simple"
      };
    })
    .text(function(d) {
      return d.value;
    });

  specificDataRender();
}

function specificDataRender() {
  d3.selectAll(".simple").property("innerHTML", "");
  d3.selectAll(".simple")
    .append("div")
    .style("width", "115px")
    .property("innerHTML", function(d) {
      return d.value;
    });

  goalChartsRender();
  gameCountChartsRender();
  gameGoalChartsRender();
}

function goalChartsRender() {
  d3.selectAll(".goalsCol").property('innerHTML', "");
  d3.selectAll(".goalsCol")
    .append("div")
    .attr("class", "bar_container")
    .append("svg").attr("class", "goal_chart");


  d3.selectAll(".goal_chart")
    .append("rect")
    .style("fill", function(d) {
      return d.value[0] < d.value[1] ? "#ff6666" : "#5faae3";
    })
    .attr("height", "16px")
    .attr("width", function(d) {
      return (8.6 * Math.abs(d.value[0] - d.value[1])) + "px";
    })
    .attr("x", function(d) {
      var res = d.value[0] < d.value[1] ? d.value[0] : d.value[1];
      return (8 + res * 8.6) + "px"
    })
    .attr("y", "7px");;

  d3.selectAll(".goal_chart")
    .append("circle")
    .classed("made_goals", true)
    .classed("goal_circle", true)
    .attr("r", "8px")
    .attr("cx", function(d) {
      return (8 + d.value[0] * 8.6) + "px";
    })
    .attr("cy", "15px");

  d3.selectAll(".goal_chart")
    .append("circle")
    .classed("conceded_gols", true)
    .classed("goal_circle", true)
    .attr("r", "8px")
    .attr("cx", function(d) {
      return (8 + d.value[1] * 8.6) + "px";
    })
    .attr("cy", "15px");

  d3.selectAll(".goal_circle")
    .classed("equal_score", function(d) {
      return d.value[0] == d.value[1] ? true : false;
    })
}

function gameGoalChartsRender() {
  d3.selectAll(".additionalRowGoals").property('innerHTML', "");
  d3.selectAll(".additionalRowGoals")
    .append("div")
    .attr("class", "bar_container")
    .append("svg").attr("class", "game_goal_chart");

  d3.selectAll(".game_goal_chart")
    .append("rect")
    .style("fill", function(d) {
      return d.value[0] < d.value[1] ? "#5faae3" : "#ff6666";
    })
    .attr("height", "4px")
    .attr("width", function(d) {
      return (8.6 * Math.abs(d.value[0] - d.value[1])) + "px";
    })
    .attr("x", function(d) {
      var res = d.value[0] < d.value[1] ? d.value[0] : d.value[1];
      return (8 + res * 8.6) + "px"
    })
    .attr("y", "13px");;

  d3.selectAll(".game_goal_chart")
    .append("circle")
    .classed("made_goals", true)
    .classed("goal_circle", true)
    .attr("r", "8px")
    .attr("cx", function(d) {
      return (8 + d.value[0] * 8.6) + "px";
    })
    .attr("cy", "15px");

  d3.selectAll(".game_goal_chart")
    .append("circle")
    .style("fill", "white")
    .attr("r", "5px")
    .attr("cx", function(d) {
      return (8 + d.value[0] * 8.6) + "px";
    })
    .attr("cy", "15px");

  d3.selectAll(".game_goal_chart")
    .append("circle")
    .classed("conceded_gols", true)
    .classed("goal_circle", true)
    .attr("r", "8px")
    .attr("cx", function(d) {
      return (8 + d.value[1] * 8.6) + "px";
    })
    .attr("cy", "15px");

  d3.selectAll(".game_goal_chart")
    .append("circle")
    .style("fill", "white")
    .attr("r", "5px")
    .attr("cx", function(d) {
      return (8 + d.value[1] * 8.6) + "px";
    })
    .attr("cy", "15px");

  d3.selectAll(".goal_circle")
    .classed("equal_score", function(d) {
      return d.value[0] == d.value[1] ? true : false;
    });

}

function gameCountChartsRender() {
  d3.selectAll(".chartCol").property('innerHTML', "");
  d3.selectAll(".chartCol")
    .append("div")
    .attr("class", "bar_container")
    .append("div").attr("class", "chart")
    .property('innerHTML', function(d) {
      if ((d.value == undefined) || (d.value <= 0)) {
        return "";
      } else {
        return d.value;
      }
    });

  //TODO: find max val
  var maxVal = 10;

  d3.selectAll(".chart")
    .style("width", function(d) {
      return (d.value * 10) + "px";
    });

  d3.selectAll(".chart")
    .style("background-color", function(d) {
      if (d) {
        if (d.value == undefined || d.value == 0) {
          return "rgba(0,0,0,0)";
        }
        var k = 100 - 80 * d.value / maxVal;
        return "hsl(180,50%," + ~~k + "%)";
      }
    });
}


function tableInit(data, columns) {
  columnHeadersInit();
  tableContentInit(getNeededData(data));
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


function mergeData(mainData, gameData, countryName) {
  var mergedData = [];
  var k = 0;
  var i = 0;
  while (mainData[k + 1] !== undefined) {
    mergedData[i] = mainData[k];
    i++;
    if (mainData[k]["Team"] == countryName) {
      for (var j = 0; j < gameData.length; j++) {
        mergedData[i] = gameData[j];
        i++;
      }
    }
    k++;
  }
  return mergedData;
}

function removeGames(data, startElementNumber) {
  var k = startElementNumber + 1;
  var numOfRemovedRows = 0;
  while (data[k]["Team"].indexOf('x') == 0) {
    data.splice(k, 1);
    numOfRemovedRows++;
  }
  return numOfRemovedRows;
}


// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
// d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//     d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

//     // ******* TODO: PART I *******


//     });

// });
// // ********************** END HACKER VERSION ***************************
