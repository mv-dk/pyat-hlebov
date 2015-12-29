
function runGames(numGames, depth1, depth2, evaluationFunction1, evaluationFunction2) {
	var whiteWins = 0, draws = 0, whiteLosses = 0;
	var f = function() {};
	for (var i = 0; i < numGames; i++) {
		var board = new Board();
		board.setUpInitialPosition();
		board.redrawCallback = function(){redrawBoard(board)};
		
		var movesApplied = 0;
		while (movesApplied <= 200) {
			var d = board.turn == WHITE
				? depth1
				: depth2;

			var e = board.turn == WHITE 
				? evaluationFunction1
				: evaluationFunction2;
			
			var move = getBestMove(board,d,e);
			if (move == undefined) {
				if (board.isKingThreatened(WHITE)) {
					whiteLosses++;
				} else if (board.isKingThreatened(BLACK)) {
					whiteWins++;
				} else {
					draws++;
				}
				break;
			}
			if (movesApplied == 200) {
				draws++;
				break;
			}
			movesApplied++;
			board.move(move);
		}
	}
	return {whiteWins:whiteWins, whiteLosses:whiteLosses, draws: draws};
}

function findBestEvaluationFunction(){
	
}

