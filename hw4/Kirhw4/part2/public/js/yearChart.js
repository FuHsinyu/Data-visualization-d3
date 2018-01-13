
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor(electoralVoteChart, tileChart, votePercentageChart, shiftChart, electionWinners) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        this.shiftChart = shiftChart;
        // the data
        this.electionWinners = electionWinners;

        // Initializes the svg elements required for this chart
        this.margin = { top: 10, right: 20, bottom: 30, left: 50 };
        let divyearChart = d3.select("#year-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)

        this.selected;
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass(data) {
        if (data == "R") {
            return "yearChart republican";
        }
        else if (data == "D") {
            return "yearChart democrat";
        }
        else if (data == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update() {

        let self = this;
        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        self.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        // ******* TODO: PART I *******

        // Create the chart by adding circle elements representing each election year
        //The circles should be colored based on the winning party for that year
        //HINT: Use the .yearChart class to style your circle elements
        //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

        let years = self.electionWinners.map(function (d) { return d.YEAR; });

        let yearscale = d3.scaleBand().rangeRound([50, self.svgWidth]).domain(years);

        self.svg.append('line')
            .attr('class', 'lineChart')
            .attr('x1', yearscale(years[0]))
            .attr('y1', self.svgHeight / 3)
            .attr('x2', yearscale(years[years.length - 1]))
            .attr('y2', self.svgHeight / 3);

        let nodes = self.svg.selectAll('g')
            .data(self.electionWinners)
            .enter().append('g')
            .attr('transform', function (d) { return 'translate(' + yearscale(d.YEAR) + ', ' + self.svgHeight / 3 + ')'; });

        nodes.append('circle')
            .attr('class', function (d) { return self.chooseClass(d.PARTY); })
            .attr('r', 20);

        //Append text information of each year right below the corresponding circle
        //HINT: Use .yeartext class to style your text elements

        nodes.append('text')
            .attr('class', 'yeartext')
            .attr('y', 50)
            .text(function (d) { return d.YEAR; });

        //Style the chart by adding a dashed line that connects all these years.
        //HINT: Use .lineChart to style this dashed line

        //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
        //HINT: Use .highlighted class to style the highlighted circle
        nodes.on('mouseover', function (d) {
            d3.select(this).select('circle')
                .attr('class', function (d) { return self.chooseClass(d.PARTY) + ' highlighted'; })
        });

        nodes.on('mouseleave', function (d) {
            if (typeof (self.selected) === 'undefined' || self.selected.datum().YEAR != d.YEAR)
                d3.select(this).select('circle')
                    .attr('class', function (d) { return self.chooseClass(d.PARTY) + ''; })
        })

        nodes.on('click', function (d) {
            if (typeof (self.selected) != 'undefined') {
                let circle = self.selected.select('circle');
                circle.attr('r', 20);

                if (self.selected.datum().YEAR === d.YEAR) {
                    circle.attr('class', function (d) { return self.chooseClass(d.PARTY) + ' highlighted'; })
                    self.selected = undefined;
                    return;
                }
                circle.attr('class', function (d) { return self.chooseClass(d.PARTY); })
            }

            self.selected = d3.select(this);

            self.selected.select('circle')
                .attr('class', function (d) { return self.chooseClass(d.PARTY) + ' selected'; })
                .attr('r', 25);

            d3.csv('data/Year_Timeline_' + d.YEAR + '.csv', function (error, data) {
                self.electoralVoteChart.update(data, self.colorScale);
                self.votePercentageChart.update(data);
                self.tileChart.update(data, self.colorScale);
                self.shiftChart.update([]);
            });
        })
        //Election information corresponding to that year should be loaded and passed to
        // the update methods of other visualizations


        //******* TODO: EXTRA CREDIT *******

        //Implement brush on the year chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.

    };

};
