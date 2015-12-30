function getBestMoveMinmax(board, evaluationFunction, depth){
	var moves = board.getAllPossibleNextMoves();
	var best;
	var bestMove;
	var t = board.turn;
	if (t == WHITE) best = Number.MIN_SAFE_INTEGER;
	else best = Number.MAX_SAFE_INTEGER;
	
	for (var i = 0; i < moves.length; i++) {
		board.move(moves[i]);
		var score = minmax(board, evaluationFunction, depth-1);
		if ((t == WHITE && score > best) ||
			(t == BLACK && score < best)){
			best = score;
			bestMove = moves[i];
		}
		board.undo();
	}
	return {move:bestMove,score:best};
}

function minmax(board, evaluationFunction, depth) {
	if (depth == 0) {
		return evaluationFunction(board);
	}
	
	var moves = board.getAllPossibleNextMoves();
	var bestVal;
	if (board.turn == WHITE) {
		bestVal = Number.MIN_SAFE_INTEGER;
		for (var i = 0; i < moves.length; i++){
			board.move(moves[i]);
			var v = minmax(board, evaluationFunction, depth-1);
			board.undo();
			bestVal = Math.max(v,bestVal);
		}
	} else {
		bestVal = Number.MAX_SAFE_INTEGER;
		for (var i = 0; i < moves.length; i++){
			board.move(moves[i]);
			var v = minmax(board, evaluationFunction, depth-1);
			board.undo();

			bestVal = Math.min(v,bestVal);
		}
	}

	return bestVal;
}
