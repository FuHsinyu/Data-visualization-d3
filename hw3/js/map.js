/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.


        // Select the host country and change it's color accordingly.

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.


        // Add a marker for gold/silver medalists
        d3.selectAll(".new_point").remove();
        
            var self = this;
        
            var dataForSelectedBar = getDataByYear(data, worldcupData);
        
            var host = dataForSelectedBar.host_country_code;
            var winner = dataForSelectedBar.teams_iso[dataForSelectedBar.teams_names.indexOf(dataForSelectedBar.winner)];
            var silver = dataForSelectedBar.teams_iso[dataForSelectedBar.teams_names.indexOf(dataForSelectedBar.runner_up)];
            var participant = dataForSelectedBar.teams_iso;
        
            var goldMedalLocation = dataForSelectedBar.win_pos;
            var silverMedalLocation = dataForSelectedBar.ru_pos;
        
        
            d3.selectAll('.countries')
              .classed('countries', true)
              .classed('runner_up', function(d) {
                return (d.id == silver);
              })
              .classed('winner', function(d) {
                return (d.id == winner);
              })
              .classed('team', function(d) {
                return (participant.indexOf(d.id) > -1);
              })
              .classed('host', function(d) {
                return (d.id == host);
              });
        
            d3.select("#points")
              .append("circle")
              .classed("gold", true)
              .classed("new_point", true)
              .attr("r", "5px");
        
            d3.select(".new_point.gold")
              .attr("cx", function() {
                return self.projection(goldMedalLocation)[0];
              })
              .attr("cy", function() {
                return self.projection(goldMedalLocation)[1];
              });
        
        
            d3.select("#points")
              .append("circle")
              .classed("silver", true)
              .classed("new_point", true)
              .attr("r", "5px");
        
            d3.select(".new_point.silver")
              .attr("cx", function() {
                return self.projection(silverMedalLocation)[0];
              })
              .attr("cy", function() {
                return self.projection(silverMedalLocation)[1];
              });
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

        var self = this;
        var path = d3.geoPath().projection(self.projection);
        var svg = d3.select("#map");
        svg.append("path")
          .datum(topojson.feature(world, world.objects.countries))
          .attr("d", path);
    
        var countries_full = topojson.feature(world, world.objects.countries);
        var countries = topojson.feature(world, world.objects.countries).features;
    
        var g = svg.append('g');
        svg.selectAll('.countries').data(countries).enter()
          .append('path')
          .attr('class', 'countries')
          .attr('d', path);
    
        g.append('path')
          .datum(d3.geoGraticule())
          .attr('class', 'grat')
          .attr('d', path);
      }


}
