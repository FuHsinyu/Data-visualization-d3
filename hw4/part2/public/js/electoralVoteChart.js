class ElectoralVoteChart {
  /**
   * Constructor for the ElectoralVoteChart
   *
   * @param shiftChart an instance of the ShiftChart class
   */
  constructor(shiftChart) {
    this.shiftChart = shiftChart;

    this.margin = {
      top: 30,
      right: 20,
      bottom: 30,
      left: 50
    };
    let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 150;

    //creates svg element within the div
    this.svg = divelectoralVotes.append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)

  };

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass(party) {
    if (party == "R") {
      return "republican";
    } else if (party == "D") {
      return "democrat";
    } else if (party == "I") {
      return "independent";
    }
  }


  /**
   * Creates the stacked bar chart, text content and tool tips for electoral vote chart
   *
   * @param electionResult election data for the year selected
   * @param colorScale global quantile scale based on the winning margin between republicans and democrats
   */

  update(electionResult, colorScale) {

    d3.select("#barArea").remove();

    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
    var self = this;
    var stateGroups = {
      "democrat": [],
      "independent": [],
      "republican": []
    };


    var republicanVotes = 0;
    var democratVotes = 0;
    var independentVotes = 0;
    for (var i = 0; i < electionResult.length; i++) {
      if (electionResult[i]["RD_Difference"] > 0) {
        stateGroups["republican"].push(electionResult[i]);
        republicanVotes += parseInt(electionResult[i]["Total_EV"]);
      } else if (electionResult[i]["RD_Difference"] < 0) {
        stateGroups["democrat"].push(electionResult[i]);
        democratVotes += parseInt(electionResult[i]["Total_EV"]);
      } else {
        stateGroups["independent"].push(electionResult[i]);
        independentVotes += parseInt(electionResult[i]["Total_EV"]);
      }
    }

    var sumOfVOtes = republicanVotes + democratVotes + independentVotes;
    stateGroups["democrat"].sort(function(a, b) {
      return a.RD_Difference - b.RD_Difference;
    })
    stateGroups["republican"].sort(function(a, b) {
      return a.RD_Difference - b.RD_Difference;
    })
    var data = stateGroups["independent"].concat(stateGroups["democrat"].concat(stateGroups["republican"]));

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.
    this.svg.append("g").attr("id", "barArea");

    var bar = this.svg.select("#barArea").selectAll("g")
      .data(data)
      .enter().append("g");
    var perc_so_far = 0;

    bar.append("rect")
      .attr("width", function(d) {
        return ((d["Total_EV"] / sumOfVOtes) * 100) + "%";
      })
      .attr("x", function(d) {
        var prev_perc = perc_so_far;
        var this_perc = 100 * (d["Total_EV"] / sumOfVOtes);
        perc_so_far = perc_so_far + this_perc;
        return prev_perc + "%";
      })
      .attr("height", 40)
      .attr("transform", "translate(50,50)")
      .attr("fill", function(d) {
        if (d["RD_Difference"] == 0) {
          return "green";
        } else {
          return (colorScale(d["RD_Difference"]));
        }
      })
      .classed("electoralVotes", true);

    bar.append("line")
      .style("stroke", "black")
      .attr("x1", "50%")
      .attr("y1", 48)
      .attr("x2", "50%")
      .attr("y2", 92)
      .attr("transform", "translate(25,0)");
    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary



    var prev = 0
    var labelArea = this.svg.select("#barArea").append("g");

    labelArea.append("text")
      .text("Electoral Vote (" + parseInt(sumOfVOtes / 2) + " needed to win)")
      .attr("transform", "translate(" + (self.svgWidth / 2) + "," + 10 + ")")
      .classed("yeartext", true);

    labelArea.append("text").text(function(d) {
        return independentVotes == 0 ? "" : independentVotes;
      })
      .attr("x", function(d) {
        prev = independentVotes;
        return 0 + "%";
      })
      .attr("fill", "green")
      .classed("electoralVoteText", true);

    labelArea.append("text").text(democratVotes)
      .attr("x", function(d) {
        if (prev == 0) {
          return 0 + "%";
        }
        return (democratVotes / sumOfVOtes * 100 - 20) + "%";
      })
      .attr("style", "fill: #6baed6")
      .classed("electoralVoteText", true);

    labelArea.append("text").text(republicanVotes)
      .attr("x", function(d) {
        return 89 + "%";
      })
      .attr("fill", "#de2d26")
      .classed("electoralVoteText", true);

    labelArea.selectAll(".electoralVoteText").attr("transform", "translate(50, 40)");
    this.svg.select("#barArea").attr("transform", "translate(0,60)");

    var brush = d3.brushX().extent([
        [0, 0],
        [self.svgWidth, 50]
      ])
      .on("end", function() {
        self.brushed();
      });

    var brushArea = this.svg.select("#barArea").append("g");
    brushArea.append('g').attr("class", "brush").attr("transform", "translate(50,50)").call(brush);


    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.


  };

  brushed() {
    var s = d3.event.selection,
      x0 = s[0],
      x1 = s[1];
    var selectedStates = [];

    d3.select("#barArea").selectAll("rect").each(function(d, i) {
      var currectBarX = this.x.baseVal.value;
      var currectBarWidth = this.width.baseVal.value;
      var currentBarY = currectBarX + currectBarWidth;
      if ((s[0] >= currectBarX && s[0] <= currentBarY)
      || (s[1] >= currectBarX && s[1] <= currentBarY)
      || (currectBarX > s[0] && currectBarX < s[1])) {
        selectedStates.push(d3.select(this).data());
      }
    });

    this.shiftChart.update(selectedStates);
  }


}
