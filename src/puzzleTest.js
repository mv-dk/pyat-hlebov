function createPuzzleTests(){
	var __ = 0;
	var wp = WHITE|PAWN;
	var bp = BLACK|PAWN;
	var wn = WHITE|KNIGHT;
	var bn = BLACK|KNIGHT;
	var wb = WHITE|BISHOP;
	var bb = BLACK|BISHOP;
	var wr = WHITE|ROOK;
	var br = BLACK|ROOK;
	var wq = WHITE|QUEEN;
	var bq = BLACK|QUEEN;
	var wk = WHITE|KING;
	var bk = BLACK|KING;

	var flipArrayVertically = function(array){
		var newArray = new Array(64);
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				newArray[idx(j,i)] = array[idx(j,7-i)];
			}
		}
		return newArray;
	};
	
	var puzzleTests = [

		function whiteToMoveMateInTwo() {
			// Arrange
			// https://gameknot.com/chess-puzzle.pl?pz=186449
			var array = [__,__,__,__,wn,__,__,__,
						 bp,bp,__,__,__,bp,__,bk,
						 __,__,__,__,__,__,__,__,
						 __,__,__,bp,wp,__,__,bp,
						 bn,wb,__,__,__,bp,__,__,
						 wp,bq,__,__,__,__,__,__,
						 __,wp,__,__,__,__,wr,__,
						 __,wk,__,__,__,__,wr,__];
			var board = new Board(flipArrayVertically(array));
			//board.redrawCallback = function(){redrawBoard(board)};
			board.turn = WHITE;
			//board.redrawCallback();
			
			// Act
			var bestMove = getBestMove(board, getBestMoveAlphaBetaIterativeDeepening, evaluate, 1);
			
			board.move(bestMove.move);
			
			// Assert
			assertMoveEquals(createMoveFromString("E8-F6"),bestMove.move);
		},
	];
	return puzzleTests;
}

addTests(createPuzzleTests());
