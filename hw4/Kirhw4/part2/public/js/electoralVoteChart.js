
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */

    constructor(shiftChart) {
        this.shiftChart = shiftChart;

        this.margin = { top: 30, right: 20, bottom: 30, left: 50 };
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
        }
        else if (party == "D") {
            return "democrat";
        }
        else if (party == "I") {
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
        let self = this;

        // ******* TODO: PART II *******

        let total = +electionResult[0].D_EV_Total + +electionResult[0].I_EV_Total + +electionResult[0].R_EV_Total;

        //Group the states based on the winning party for the state;
        //then sort them based on the margin of victory

        let grouped = d3.nest()
            .key(function (d) { return d.State_Winner; })
            .entries(electionResult);

        if (grouped.length > 2) {
            let tmp = grouped[0];
            grouped[0] = grouped[1];
            grouped[1] = tmp;
        }

        grouped.forEach(function (d) {
            d.values.sort(function (a, b) {
                return +a.RD_Difference - +b.RD_Difference;
            });
        });

        let widthScale = d3.scaleLinear().range([0, self.svgWidth - 50]).domain([0, total]);

        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .electoralVotes class to style your bars.

        let offset = 50;

        self.svg.selectAll('*')
            .remove()
            .exit()
            .data(grouped)
            .enter()
            .each(function (group, i) {
                let x = 0;
                let g = d3.select(this).append('g');
                g.attr('transform', 'translate(' + offset + ', ' + self.svgHeight / 3 + ')')
                    .selectAll('rect')
                    .data(group.values)
                    .enter()
                    .each(function (d, j) {
                        let width = widthScale(+d.Total_EV);

                        grouped[i].values[j].extent = [offset + x, offset + x + width];

                        d3.select(this).append('rect')
                            .attr('class', 'electoralVotes')
                            .attr('x', x)
                            .attr('width', width)
                            .attr('height', 40)
                            .attr('fill', function (d) {
                                return d.State_Winner === 'I' ? '#45AD6A' : colorScale(+d.RD_Difference);
                            });
                        x += width;
                    });
                offset += x;

                //Display total count of electoral votes won by the Democrat and Republican party
                //on top of the corresponding groups of bars.
                //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
                // chooseClass to get a color based on the party wherever necessary

                g.append('text')
                    .attr('class', function (d) { return self.chooseClass(d.key) + ' electoralVoteText'; })
                    .attr('x', function (d) { return d.key === 'R' ? x : 0; })
                    .attr('y', -5)
                    .text(function (d) { return d.key === 'D' ? d.values[0].D_EV_Total : d.key === 'I' ? d.values[0].I_EV_Total : d.values[0].R_EV_Total });
            });

        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        self.svg.append('rect')
            .attr('class', 'middlePoint')
            .attr('x', (offset + 50) / 2)
            .attr('y', self.svgHeight / 3 - 5)
            .attr('width', 1)
            .attr('height', 50)

        //Just above this, display the text mentioning the total number of electoral votes required
        // to win the elections throughout the country
        //HINT: Use .electoralVotesNote class to style this text element

        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

        self.svg.append('text')
            .attr('class', 'electoralVotesNote')
            .attr('x', (offset + 50) / 2)
            .attr('y', self.svgHeight / 3 - 10)
            .text('Electoral vote (' + Math.ceil(total / 2) + ' needed to win)');

        //******* TODO: PART V *******
        //Implement brush on the bar chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.

        let brush = d3.brushX()
            .on("end", brushed)
            .extent([[0, self.svgHeight / 3], [self.svgWidth, self.svgHeight / 3 + 40]]);

        let g = self.svg.append("g")
            .attr("class", "brush")
            .call(brush);

        function brushed() {
            let selected = [];
            let selection = d3.brushSelection(d3.select('.brush').node());

            if (!selection) {
                self.shiftChart.update(selected);
                return;
            }

            grouped.forEach(function (group) {
                group.values.forEach(function (state) {
                    if (state.extent[0] >= selection[0] && state.extent[1] <= selection[1])
                        selected.push(state);
                });
            });

            self.shiftChart.update(selected);
        }
    };


}
