var width = 150;
var height = 70;
var margin = 35;


var columns = ["Team", "Goals", "Round/Result", "Wins", "Losses", "Total Games"];
/** Class implementing the table. */
class Table {
  /**
   * Creates a Table Object
   */
  constructor(teamData, treeObject) {

    //Maintain reference to the tree Object;
    this.tree = treeObject;

    // Create list of all elements that will populate the table
    // Initially, the tableElements will be identical to the teamData
    this.tableElements = null; //

    ///** Store all match data for the 2014 Fifa cup */
    this.teamData = teamData;

    //Default values for the Table Headers
    this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

    /** To be used when sizing the svgs in the table cells.*/
    this.cell = {
      "width": 70,
      "height": 20,
      "buffer": 15
    };

    this.bar = {
      "height": 20
    };

    /** Set variables for commonly accessed data columns*/
    this.goalsMadeHeader = 'Goals Made';
    this.goalsConcededHeader = 'Goals Conceded';

    /** Setup the scales*/
    this.goalScale = null;

    /** Used for games/wins/losses*/
    this.gameScale = null;

    /**Color scales*/
    /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
    this.aggregateColorScale = null;

    /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
    this.goalColorScale = null;
  }


  /**
   * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
   * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
   *
   */
  createTable() {

    var self = this;

    var svg = d3.select(".glyphicon").append("svg");

    svg.attr("width", width + 30)
      .attr("height", height)
      .attr("transform", "translate(0,0)");

    var self = this;
    var xScale = d3.scaleLinear().range([0, width])
      .domain([0, getMaxNumOfSomething(this.teamData, "goals")]);

    svg.append("g");

    svg.select("g")
      .attr("transform", "translate(15," + margin + ")")
      .call(d3.axisTop(xScale));

    tableInit(this.teamData, columns);

    var tbody = d3.select("#matchTable").select("tbody");
    d3.selectAll("#colHeaders").selectAll("td")
      .on("click", function(header) {
        var i = 0;
        var neededElement;

        self.collapseList(actualData);
        tableContentInit(actualData);
        self.updateTable();

        tbody.selectAll("tr").sort(function(a, b) {
          if (sortFlag <= 0) {
            i = 1;
            return d3.ascending(a[header], b[header]);
          } else {
            i = -1;
            return d3.descending(a[header], b[header]);
          }
        });
        sortFlag = i;
      });

  }


  /**
   * Updates the table contents with a row for each element in the global variable tableElements.
   */
  updateTable() {
    var self = this;
    d3.selectAll("tr")
      .on("mouseover", function(d){
        if (d !== undefined){
            self.tree.updateTree(d);
        }
      })
      .on("mouseout", function(d){
        self.tree.clearTree();
      })
      .on("click", function(d) {

        if (d["Team"].indexOf("x") == 0) {
          //do nothing if click on additional row
        } else { //if click on general raw
          for (var j = 0; j < actualData.length; j++) {
            if (actualData[j]["Team"] == d["Team"]) {
              break;
            }
          }
          var canceledRows = self.updateList(actualData, j);

          if (canceledRows == 0) {
            //to show additional row
            var newRowsData = [];
            var rowData;
            for (var k = 0; k < d["Games"].length; k++) {
              var currentGame = d["Games"][k];
              rowData = {
                Team: "x" + currentGame.key,
                Goals: [currentGame.value["Goals Conceded"], currentGame.value["Goals Made"], "gameInfo"],
                Result: currentGame.value["Result"]["label"]
              }
              newRowsData.push(rowData);
            }

            var dataWithGamesInfo = mergeData(actualData, newRowsData, d["Team"]);


            tableContentInit(dataWithGamesInfo);

            self.updateTable();

            d3.selectAll("td.teamCol").classed("additionalRowTeam", function(d) {
              if (d.value.indexOf('x') == 0) {
                return true;
              } else {
                return false;
              }
            });

          } else {
            //to hide additional row
            tableContentInit(actualData);
            self.updateTable();
          }
        }
      });
  }

  /**
   * Updates the global tableElements variable, with a row for each row to be rendered in the table.
   *
   */
  updateList(data, startElementNumber) {
    var k = startElementNumber + 1;
    var numOfRemovedRows = 0;
    while (data[k]["Team"].indexOf('x') == 0) {
      data.splice(k, 1);
      numOfRemovedRows++;
    }
    return numOfRemovedRows;
  }

  /**
   * Collapses all expanded countries, leaving only rows for aggregate values per country.
   *
   */
  collapseList(data) {
    var k = 0;
    while (data[k + 1] !== undefined) {
      if (data[k]["Team"].indexOf('x') == 0) {
        data.splice(k, 1);
      } else {
        k++;
      }
    }
  }

}
