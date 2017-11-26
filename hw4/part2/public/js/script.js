
let votePercentageChart = new VotePercentageChart();

let tileChart = new TileChart();

let shiftChart = new ShiftChart();

let electoralVoteChart = new ElectoralVoteChart(shiftChart);

d3.csv("data/yearwiseWinner.csv", function (error, electionWinners) {
    let yearChart = new YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners);
    yearChart.update();
});
