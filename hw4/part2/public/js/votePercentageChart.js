/** Class implementing the votePercentageChart. */
class VotePercentageChart {

  /**
   * Initializes the svg elements required for this chart;
   */
  constructor() {
    this.margin = {
      top: 30,
      right: 20,
      bottom: 30,
      left: 50
    };
    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //fetch the svg bounds
    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 200;

    //add the svg to the div
    this.svg = divvotesPercentage.append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)

  }

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
   * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
   *
   * @param electionResult election data for the year selected
   */
  update(electionResult, colorScale) {
    d3.select("#votePercentageArea").remove();

    var data = [{
        votePercent: electionResult[0].I_PopularPercentage.length > 0 ? electionResult[0].I_PopularPercentage.slice(0, -1) : 0,
        nominee: electionResult[0].I_Nominee_prop,
        party: "I"
      },
      {
        votePercent: electionResult[0].D_PopularPercentage.length > 0 ? electionResult[0].D_PopularPercentage.slice(0, -1) : 0,
        nominee: electionResult[0].D_Nominee_prop,
        party: "D"
      },
      {
        votePercent: electionResult[0].R_PopularPercentage.length > 0 ? electionResult[0].R_PopularPercentage.slice(0, -1) : 0,
        nominee: electionResult[0].R_Nominee_prop,
        party: "R"
      },
    ];

    var self = this;

    this.svg.append("g").attr("id", "votePercentageArea");

    var bar = this.svg.select("#votePercentageArea").selectAll("g")
      .data(data)
      .enter().append("g");

    var perc_so_far = 0;

    bar.append("rect")
      .attr("width", function(d) {
        return d.votePercent + "%";
      })
      .attr("x", function(d) {
        var prev_perc = perc_so_far;
        var this_perc = d.votePercent;
        perc_so_far = parseFloat(perc_so_far) + parseFloat(this_perc);
        return prev_perc + "%";
      })
      .attr("transform", " translate(50,100)")
      .attr("class", function(d) {
        return self.chooseClass(d.party);
      })
      .attr("height", 40)
      .classed("electoralVotes", true)

    bar.append("line")
      .style("stroke", "black")
      .attr("x1", "50%")
      .attr("y1", 48)
      .attr("x2", "50%")
      .attr("y2", 92)
      .attr("transform", "translate(20,50)");

    var prev = 0;
    bar.append("text")
      .text(function(d) {
        return d.votePercent == 0 ? "" : d.votePercent + "%";
      })
      .attr("x", function(d) {
        if (d.party == "I") {
          prev = parseFloat(d.votePercent);
          return 0 + "%"
        } else if (d.party == "D") {
          if (prev == 0) {
            return 0 + "%";
          }
          return (parseFloat(d.votePercent) + prev) / 2.5 + "%";
        } else {
          return 93 + "%";
        }
      })
      .attr("transform", " translate(50,90)")
      .classed("votesPercentageText", true);


    prev = 0;
    bar.append("text")
      .text(function(d) {
        return d.nominee;
      })
      .attr("x", function(d) {
        if (d.party == "I") {
          prev = parseFloat(d.votePercent);
          return 0 + "%"
        } else if (d.party == "D") {
          if (prev == 0) {
            return 0 + "%";
          }
          return (parseFloat(d.votePercent) + prev) / 2.5  + "%";
        } else {
          return 93 + "%";
        }
      })
      .attr("transform", " translate(50,60)")

      .classed("votesPercentageText", true);

    bar.selectAll(".votesPercentageText")
    .attr("class", function(d) {
      return self.chooseClass(d.party);
    });


    this.svg.select("#votePercentageArea").append("g").append("text")
      .text("Popular Vote 50%")
      .attr("transform", "translate(" + (self.svgWidth / 2) + "," + 80 + ")")
      .classed("yeartext", true);

    // ******* TODO: PART III *******

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

  };


}
