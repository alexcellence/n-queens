// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //

    // Assumptions: piece will be represented with a 1, empty space will be a 0
    // Rooks: check rows and columns
    // Queens: check rows, columns, and diagonals

    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // this.attributes is an object containing the row arrays. the keys are the row numbers and the values are the rows themselves
      var currentArray = this.attributes[rowIndex];
      // use reduce to boil down the array elements to a single sum
      var sum = _.reduce(currentArray, (acc, element) => acc + element, 0);
      // if sum > 1 return true that there is a conflict
      return sum > 1 ? true : false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // use this.get('n') to get value of n
      var n = this.get('n');
      // iterate through all the rows
      for (var i = 0; i < n; i++) {
        var currentArray = this.attributes[i];
        var sum = _.reduce(currentArray, (acc, element) => acc + element, 0);
        if (sum > 1) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // once an item appears in a certain index on a row, no other row can have that index occupied
      // check every row at that colIndex and add up. if number is ever > 1 return true
      // use this.get('n') to determine how many rows there are
      var n = this.get('n');

      var columnSum = 0;
      // iterate through index
      for (var i = 0; i < n; i++) {
        // columnIndex stays constant
        columnSum += this.attributes[i][colIndex];
        return columnSum > 1 ? true : false;
      }
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      // check every n indexes and test hasColConflictAt
      var n = this.get('n');

      // iterate through index first
      for (var i = 0; i < n; i++) {
        var columnSum = 0;
        // then iterate through the rows
        for (var j = 0; j < n; j++) {
          columnSum += this.attributes[j][i];
          if (columnSum > 1) {
            return true;
          }
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // assign majorIndex to majorDiagonalColumnIndexAtFirstRow
      // assign n to this.get('n')
      // if majorIndex is 0, iterate through n and add the values of Board[i][i]
      // if majorIndex is negative, iterate through while i < n+majorIndex and add the values of Board[math.Abs(majorIndex)][i]
      // if majorIndex is positive, iterate through while i < n-majorIndex and add the values of Board[i][majorIndex+i]

      var n = this.get('n');
      var majorIndex = majorDiagonalColumnIndexAtFirstRow;
      var diagonalSum = 0;
      debugger;
      console.log(this);
      if (majorIndex === 0) {
        var i = 0;
        while (i < n) {
          diagonalSum += this.attributes[i][i];
          i++;
        }
      }
      if (majorIndex < 0) {
        var j = Math.abs(majorIndex);
        var k = 0;
        while (j < n && k < n / 2) {
          diagonalSum += this.attributes[j][k];
          j++;
          k++;
        }
      }
      if (majorIndex > 0) {
        var l = majorIndex;
        var k = 0;
        while (k < n / 2 && l < n) {
          diagonalSum += this.attributes[k][l];
          k++;
          l++;
        }
      }
      return diagonalSum > 1 ? true : false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
