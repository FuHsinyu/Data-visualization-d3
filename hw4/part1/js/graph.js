class Graph {


  constructor(nodes, links, allData) {
    this.nodes = nodes;
    this.links = links;
    this.actialData = allData;
  }

  /**
   * Render and update the graph based on the selection of the data type in the drop-down box
   */
  updateGraph() {
    d3.selectAll("input[type = 'radio']").on("change", updateGraph);
    d3.select("select").on("change", chooseData);

    var self = this;
    d3.selectAll(".node").remove();

    var svg = d3.select("#graph")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(0,70)");

    svg.selectAll(".link")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("class", "link");

    var node = svg.selectAll(".node")
      .data(self.nodes)
      .enter()
      .append("g")
      .attr("class", "node")

    svg.selectAll(".node")
      .append("text")
      .text(function(d) {
        return d.country;
      })
      .attr("class", "country_label")
      .attr("dx", 12)
      .attr("dy", 5);

    node.append("circle")
      .attr("r", 6)
      .attr("class", "node_circle")

    /*  .attr("style", function(d) {
        return "fill: " + foci[d.continent].color;
      })*/;

    svg.selectAll(".node")
      .on("mouseover", function(d, i) {

        d3.selectAll(".link")
          .classed("link_source", function(l) {
            if (l.source === d) {
              l.source.source = true;
              l.target.target = true;
              return true;
            } else {
              return false;
            }
          })
          .classed("link_others", function(l) {
            return !(l.source === d);
          });

        d3.selectAll(".node")
          .classed("node_target", function(n) {
            return n.target;
          })
          .classed("node_source", function(n) {
            return n.source;
          })
          .classed("node_others", function(n) {
            return !(n.source || n.target);
          })

        d3.selectAll(".node_circle")
          .classed("node_circle_source", function(n) {
            return n.source;
          })
          .classed("node_circle_others", function(n) {
            return !(n.source || n.target);
          });

      }).on("mouseout", function() {

        d3.selectAll(".link")
          .classed("link_source", false)
          .classed("link_others", false);

        d3.selectAll(".node")
          .classed("node_target", false)
          .classed("node_source", false)
          .classed("node_others", false)
          .each(function(d) {
            d.target = false;
            d.source = false;
          });
        d3.selectAll(".node_circle")
          .classed("node_circle_source", false)
          .classed("node_circle_others", false);
      });
    this.applyLayaut();
  }

  applyLayaut() {
    var layaut = d3.select('input[name="layautRadio"]:checked').property("value");
    d3.selectAll(".optionBlock").attr("style", "display: none");
    switch (layaut) {
      case "line":
        d3.select("#lineBlock").attr("style", "display: block");
        lineLayout();
        break;
      case "2D":
        d3.select("#twoDBlock").attr("style", "display: block");
        twoDemisionLayout();
        break;
      case "circle":
        d3.select("#circleBlock").attr("style", "display: block");
        circleLayout();
        break;
      case "ring":
        d3.select("#ringBlock").attr("style", "display: block");
        ringLayout();
        break;
    }
  }
}
