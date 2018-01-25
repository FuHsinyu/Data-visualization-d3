/** Class implementing the tree view. */
var treeData;
class Tree {
  /**
   * Creates a Tree Object
   */
  constructor() {

  }

  /**
   * Creates a node/edge structure and renders a tree layout based on the input data
   *
   * @param treeData an array of objects that contain parent/child information.
   */
  createTree(flatData) {

    treeData = d3.stratify()
      .id(function (d) {
        return d.id;
      })
      .parentId(function (d) {
        return d.PARENT_GAME;
      })
      (flatData);

    // assign the name to each node
    treeData.each(function (d) {
      d.name = d.id;
    });

    // set the dimensions and margins of the diagram
    var margin = {
      top: 20,
      right: 90,
      bottom: 30,
      left: 90
    },
      width = 500 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    var treemap = d3.tree()
      .size([height, width]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData, function (d) {
      return d.children;
    });

    // maps the node data to the tree layout
    nodes = treemap(nodes);

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var g = d3.select("#tree").attr("transform", "translate(100,100)");

    // adds the links between the nodes
    var link = g.selectAll(".link")
      .data(nodes.descendants().slice(1))
      .enter().append("path")
      .attr("id", function (d) {
        return "ID" + d.data.id;
      })
      .attr("class", "link")
      .attr("d", function (d) {
        return "M" + d.y + "," + d.x +
          "C" + (d.y + d.parent.y) / 2 + "," + d.x +
          " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
          " " + d.parent.y + "," + d.parent.x;
      });

    // adds each node as a group
    var node = g.selectAll(".node")
      .data(nodes.descendants())
      .enter().append("g")
      .attr("class", function (d) {
        return "node" +
          (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // adds the circle to the node
    node.append("circle")
      .attr("r", 5)
      .style("fill", function (d) {
        if (d.data.data.WINS == 1) {
          return "blue";
        } else {
          return "red";
        }
      });

    // adds the text to the node
    node.append("text")
      .attr("dy", ".35em")
      .attr("x", function (d) {
        return d.children ? -13 : 13;
      })
      .style("text-anchor", function (d) {
        return d.children ? "end" : "start";
      })
      .text(function (d) {
        return d.data.data.TEAM;
      });
  };

  /**
   * Updates the highlighting in the tree based on the selected team.
   * Highlights the appropriate team nodes and labels.
   *
   * @param row a string specifying which team was selected in the table.
   */
  updateTree(row) {
    // ******* TODO: PART VII *******




  }

  /**
   * Removes all highlighting from the tree.
   */
  clearTree() {
    // ******* TODO: PART VII *******
    d3.selectAll(".selected_link")
      .classed("selected_link", false);
    // You only need two lines of code for this! No loops!
  }
}
