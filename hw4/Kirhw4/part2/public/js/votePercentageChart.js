/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor() {
        this.margin = { top: 30, right: 20, bottom: 30, left: 50 };
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
    chooseClass(data) {
        if (data == "R") {
            return "republican";
        }
        else if (data == "D") {
            return "democrat";
        }
        else if (data == "I") {
            return "independent";
        }
    }

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
    /*	 
        tooltip_render (tooltip_data) {
            let text = "<ul>";
            tooltip_data.result.forEach((row)=>{
                text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
            });
            
            return text;
        }
    */
	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
    update(electionResult) {
        let self = this;

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function () {
                return [0, 0];
            })
            .html(function (d) {
                return "<ul><li class = " + self.chooseClass(d.party) + ">" + d.nominee + ":\t\t" + d.votecount + "(" + d.percent + "%)" + "</li>";
            });

        self.svg.call(tip);

        let data = [];

        if (electionResult[0].I_PopularPercentage)
            data.push({ party: 'I', percent: +(electionResult[0].I_PopularPercentage.slice(0, -1)), nominee: electionResult[0].I_Nominee_prop, votecount: +electionResult[0].I_Votes_Total });
        data.push({ party: 'D', percent: +(electionResult[0].D_PopularPercentage.slice(0, -1)), nominee: electionResult[0].D_Nominee_prop, votecount: +electionResult[0].D_Votes_Total });
        data.push({ party: 'R', percent: +(electionResult[0].R_PopularPercentage.slice(0, -1)), nominee: electionResult[0].R_Nominee_prop, votecount: +electionResult[0].R_Votes_Total });

        let widthScale = d3.scaleLinear().range([0, self.svgWidth - 50]).domain([0, 100]);

        let offset = 50;

        let bars = self.svg.selectAll('*')
            .remove()
            .exit()
            .data(data)
            .enter();

        bars.each(function (data) {
            let width = widthScale(data.percent);

            let g = d3.select(this).append('g');

            g.attr('transform', 'translate(' + offset + ', ' + self.svgHeight / 3 + ')');

            g.append('rect')
                .attr('width', width)
                .attr('height', 40)
                .attr('class', self.chooseClass(data.party) + ' votesPercentage')
                .on('mouseover', tip.show)
                .on('mouseleave', tip.hide);
            offset += width;

            g.append('text')
                .attr('class', function (d) { return self.chooseClass(d.party) + ' votesPercentageText'; })
                .attr('x', function (d) { return d.party === 'R' ? width : 0; })
                .attr('y', -40)
                .text(function (d) { return d.nominee; });

            g.append('text')
                .attr('class', function (d) { return self.chooseClass(d.party) + ' votesPercentageText'; })
                .attr('x', function (d) { return d.party === 'R' ? width : 0; })
                .attr('y', -5)
                .text(function (d) { return d.percent + '%'; });
        });

        self.svg.append('rect')
            .attr('class', 'middlePoint')
            .attr('x', (offset + 50) / 2)
            .attr('y', self.svgHeight / 3 - 5)
            .attr('width', 1)
            .attr('height', 50)

        self.svg.append('text')
            .attr('class', 'votesPercentageNote')
            .attr('x', (offset + 50) / 2)
            .attr('y', self.svgHeight / 3 - 10)
            .text('Popular vote(50%)');

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
