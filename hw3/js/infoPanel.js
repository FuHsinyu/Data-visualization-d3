/** Class implementing the infoPanel view. */
class InfoPanel {
  /**
   * Creates a infoPanel Object
   */
  constructor() {}

  /**
   * Update the info panel to show info about the currently selected world cup
   * @param oneWorldCup the currently selected world cup
   */
  updateInfo(oneWorldCup) {

    // ******* TODO: PART III *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year

    // Hint: For the list of teams, you can create an list element for each team.
    // Hint: Select the appropriate ids to update the text content.

    //Set Labels

    var dataForSelectedBar = getDataByYear(data, oneWorldCup);

    d3.selectAll(".text_label").remove();

    d3.select("#edition")
      .property('innerHTML', dataForSelectedBar.EDITION);


    d3.select("#host")
      .append("text")
      .attr('class', 'text_label')
      .text(dataForSelectedBar.host);

    d3.select("#winner")
      .append("text")
      .attr('class', 'text_label')
      .text(dataForSelectedBar.winner);

    d3.select("#silver")
      .append("text")
      .attr('class', 'text_label')
      .text(dataForSelectedBar.runner_up);

    for (var k = 0; k < dataForSelectedBar.teams; k++) {
      d3.select("#teams")
        .append("div")
        .append("text")
        .attr('class', 'text_label')
        .text(dataForSelectedBar.teams_names[k])
    }
  }
}
