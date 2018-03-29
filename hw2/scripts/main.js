var rangeBar = document.getElementById("myRange");
var year = document.getElementById("year");
var newYear = 0;
var data2 = [];
var checkedContinents = [];

function none() {

    d3.json('../countries_2012.json', function (error, data) {
        d3.selectAll('table').remove();
        tabulate(data, ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year'])
    });

}

function continentSort() {

    d3.json('../countries_2012.json', function (error, data) {
        var dataSet = d3.nest()
            .key(function (d) { return d.continent; })
            .rollup(function (d) {
                return {

                    continent: d[0].continent,

                    gdp: d3.sum(d, g => g.gdp),

                    life_expectancy: d3.mean(d, g => g.life_expectancy),

                    population: d3.sum(d, g => g.population),

                    Year: d3.mean(d, g => g.year),

                }
            })
            .entries(data);

        dataSet.forEach(function (obj) { return data2.push(obj.value); });

        d3.selectAll('table').remove();

        tabulate(data2, ['continent', 'gdp', 'life_expectancy', 'population', 'year'])

    })

}
function getMaxYearMinYear(data) {
    var maxyear = 2012;
    var minyear = 2012;
    for (var i = 0; i < data.length; i++) {
        var currentYears = data[i].years;
        for (var j = 0; j < currentYears.length; j++) {
            var curruntYear = currentYears[j].year;
            if (maxyear < curruntYear) {
                maxyear = curruntYear;
            }
            if (minyear > curruntYear) {
                minyear = curruntYear;
            }
        }
    }
    return [minyear, maxyear];
}
function getCheckedContinents() {
    d3.selectAll("input[name='checkbox']").each(function () {
        var currentContinent = d3.select(this);
        if (currentContinent.property("checked")) {
            if (checkedContinents.indexOf(currentContinent.attr("value")) < 0) {
                checkedContinents.push(currentContinent.attr("value"));
            }
        } else {
            var continentIndex = checkedContinents.indexOf(currentContinent.attr("value"));
            if (continentIndex > -1) {
                checkedContinents.splice(continentIndex, 1);
            }
        }
    });
}
function continentSeparete() {

    options = [];
    d3.selectAll('.continent').each(function (d) {
        singleContinent = d3.select(this);
        if (singleContinent.property('checked')) {
            options.push(singleContinent.property('value'));
        }
    });

    d3.selectAll('table').remove();
    d3.json('../countries_2012.json', function (error, data) {

        if (options.length > 0)
            data = data.filter(function (row) { return options.includes(row.continent) });
        else
            data = data
        tabulate(data, ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year'])
    });

}


function tabulate(data, columns) { // data formatting code quoted from internet

    var table = d3.select('body').append('table')
    var thead = table.append('thead')
    var tbody = table.append('tbody');
    table.append('caption')
        .html('World Countries Ranking')

    thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .text(function (column) { return column; })
        .on('click', function (header, i) {
            tbody.selectAll('tr').sort(function (a, b) {
                return d3.descending(a[header], b[header]);
            })
        })


    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');


    var formatComma = d3.format(",");
    var formatDecimal = d3.format(".1f");
    var cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] };
            });
        })
        .enter()
        .append('td')
        .text(function (d) {
            if (d.column === 'population')
                return formatComma(d.value)
            else if (d.column === 'life_expectancy')
                return formatDecimal(d.value)
            else if (d.column === 'gdp')
                return formatDecimal(d.value) + 'D'
            else
                return d.value
        })
        .on('mouseover', function (d, i) {
            d3.select(this.parentNode)
                .style('background-color', '#F3ED86');
        }).on("mouseout", function () {

            tbody.selectAll("tr")
                .style("background-color", null)
                .selectAll("td")
                .style("background-color", null);

        });

    return table;
}

// sort continent
year.innerHTML = rangeBar.value;
d3.selectAll(".continent").on('click', function () {

    continentSeparete();

});

//sort data by year
rangeBar.oninput = function () {

    year.innerHTML = this.value;
    newYear = year.innerHTML;

}


