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



  };


}
