/**
    0  - not sorted,
    1  - asc sorted,
    -1 - desc sorted
*/
var sortFlag = 0;
var columns = ["Team", "Goals", "Result", "Wins", "Losses", "Total Games"];
var actualData;
/**
 * Loads in the table information from fifa-matches.json
 */
d3.json('data/fifa-matches.json', function (error, data) {

  /**
   * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
   *
   */
  d3.csv("data/fifa-tree.csv", function (error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
      d.id = i;
    });

    //Create Tree Object
    let tree = new Tree();
    tree.createTree(csvData);

    //Create Table Object and pass in reference to tree object (for hover linking)

  });
});






// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
// d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//     d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

//     // ******* TODO: PART I *******


//     });

// });
// // ********************** END HACKER VERSION ***************************
