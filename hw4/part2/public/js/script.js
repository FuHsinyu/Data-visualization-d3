
        let votePercentageChart = new VotePercentageChart();

        let tileChart = new TileChart();

        let shiftChart = new ShiftChart();

        let electoralVoteChart = new ElectoralVoteChart(shiftChart);



        //load the data corresponding to all the election years
        //pass this data and instances of all the charts that update on year selection to yearChart's constructor
        d3.csv("data/yearwiseWinner.csv", function (error, electionWinners) {
            let yearChart = new YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners);
            yearChart.update();
        });
