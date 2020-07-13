/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {

  // create a new function, piecePlacer, that takes in two parameters, coordinates and n
  var piecePlacer = function(rowIndex, columnIndex, n) {
    // create new Board of size n
    var newBoard = new Board({n: n});
    // create a new variable, offLimitPositions, and assign it to an empty array
    var offLimitPositions = new Set();
    // toggle piece based on inputted coordinates parameters
    newBoard.togglePiece(rowIndex, columnIndex);
    // iterate through the row using a while loop and push every place into offLimitPositions array
    for (var i = 0; i < n; i++) {
      offLimitPositions.add([rowIndex, i]);
      offLimitPositions.add([i, columnIndex]);
    }

    // there will be a nested function, placeHelper, that takes in array of off limit positions
    var placeHelper = function(offLimitPositions) {
      // iterate through the board
      if (offLimitPositions.size !== n * n) {
        for (var i = 0; i < n; i++) {
          for (var j = 0; j < n; j++) {
            for (var k = 0; k < offLimitPositions.size; k++) {
              // if current coordinate is not contained in OffLimitPositions, toggle piece
              if (JSON.stringify(offLimitPositions[k]) !== JSON.stringify([i, j])) {
                newBoard.togglePiece(i, j);
                // iterate through the row and push every place into offLimitPositions array
                for (var l = 0; l < n; l++) {
                  offLimitPositions.add([rowIndex, l]);
                  offLimitPositions.add([l, columnIndex]);
                }
                // check for conflicts
                console.log(offLimitPositions);
                console.log('newBoard ', newBoard);
                if (newBoard.hasAnyRooksConflicts()) {
                  return console.log('No need to continue placing pieces, we have a problem');
                }
                // else {
                //   // place next piece
                //   // placeHelper(offLimitPositions);
                // }
              }
            }
          }
        }

      } else {
        return newBoard;
      }
    };
    return placeHelper(offLimitPositions);
  };
  piecePlacer(0, 0, n);


  // if no conflicts, push new off limits coordinates of new piece into placement array
  // recursively call itself with new off limits coordinates
  // the termination case will be if there are no more available positions

  // return the result of calling the new function within findNRooksSolution

  // var solution = piecePlacer(0, 0, n);
  // console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  // return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = undefined; //fixme
  // mark off every slot that was used
  //

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
