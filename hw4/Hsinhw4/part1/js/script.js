var svg = d3.select(".graph").append("svg")
            .attr("width", 1200)
            .attr("height", 1500)
            .attr("transform", "translate(0, 20)");

d3.json("data/countries_1995_2012.json", function(data)
{
    data = data.map(function (item)
    {
        var year = item.years.find(function (d) { return d.year === 1995; });
        return {
            id : item.country_id,
            continent : item.continent,
            gdp : year.gdp,
            latitude : item.latitude,
            life_expectancy : year.life_expectancy,
            longitude : item.longitude,
            population : year.population,
            name: item.name,
            partners: year.top_partners.map(function (d) { return d.country_id; })
        };
    });

	var graph = new Graph(data);

    graph.update(svg, d3.select('input[name=layout]:checked').node().value);

    d3.selectAll(".input").on("change", function ()
    {
        graph.update(svg, d3.select('input[name=layout]:checked').node().value);
    });

    var layouts = d3.selectAll('input[name=layout]').on("change", function ()
    {
        var layout = d3.select('input[name=layout]:checked').node().value;

        d3.selectAll('select').each(function ()
        {
            var select = d3.select(this);
            select.attr("disabled", select.attr("id") === layout ? null : "disabled");
        });

        graph.update(svg, layout);
    });
});