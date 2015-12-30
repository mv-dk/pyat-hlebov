var DummyBoard = function(){
	this.turn = WHITE;
	this.i = 0;
};
DummyBoard.prototype.move = function() {
	this.turn = this.turn == WHITE ? BLACK : WHITE;
};
DummyBoard.prototype.undo = function() {
	this.turn = this.turn == WHITE ? BLACK : WHITE;
};
DummyBoard.prototype.getAllPossibleNextMoves = function() {
	return [[1,2,3],
			[11,12,13],
			[21,22,23],
			[31,32,33]][this.i++];
};

/*
        5|3  (if this is a minimizer, 5 is returned, otherwise 3)
        ,|.
      ,' | '.
    ,'   |   '.
 3 8    2 7   -2 5 
 /|\    /|\    /|\
/ | \  / | \  / | \
3 5 8  7 2 4 -1 5 -2
*/

var alphaBetaTests = [
	function mustFindMaximumNodeAtDepth1() {
		// Arrange
		var b = new DummyBoard();
		var evalValues = [3,2,-2];
		var evalIdx = 0;
		var dummyEval = function() {
			return evalValues[evalIdx++];
		};

		// Act
		var m = getBestMove(b, getBestMoveAlphaBeta, dummyEval, 1);

		// Assert
		assertEquals(3, m.score);
		assertEquals(1, m.move);
	},
	
	function mustFindMinimumNodeAtDepth1() {
		// Arrange
		var b = new DummyBoard();
		b.move();
		var evalValues = [3,2,-2]
		var evalIdx = 0;
		var dummyEval = function() {
			return evalValues[evalIdx++];
		};

		// Act
		var m = getBestMove(b, getBestMoveAlphaBeta, dummyEval, 1);

		// Assert
		assertEquals(-2, m.score);
		assertEquals(3, m.move);
	},
	
	function mustFindMaximumNodeAtDepth2() {
		// Arrange
		var b = new DummyBoard();
		var evalValues = [3,5,8,7,2,4,-1,5,-2];
		var evalIdx = 0;
		var dummyEval = function() {
			return evalValues[evalIdx++];
		};

		// Act
		var m = getBestMove(b, getBestMoveAlphaBeta, dummyEval, 2);

		// Assert
		assertEquals(3, m.score);
		assertEquals(1, m.move);
	},
	
	function mustFindMinimumNodeAtDepth2() {
		// Arrange
		var b = new DummyBoard();
		b.move();
		var evalValues = [3,5,8,7,2,4,-1,5,-2];
		var evalIdx = 0;
		var dummyEval = function() {
			return evalValues[evalIdx++];
		};

		// Act
		var m = getBestMove(b, getBestMoveAlphaBeta, dummyEval, 2);

		// Assert
		assertEquals(5, m.score);
		assertEquals(3, m.move);
	}
];

addTests(alphaBetaTests);
