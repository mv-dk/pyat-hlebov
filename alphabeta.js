
function getBestMoveAlphaBetaIterativeDeepening(board, evaluationFunction, depth) {
	var best = {move:undefined,score:undefined};

	for (var i = 1; i <= depth; i++) {
		best = getBestMoveAlphaBeta(board, evaluationFunction, i,  best.move);
		if ((best.score == Number.MAX_SAFE_INTEGER && board.turn == WHITE) ||
			(best.score == Number.MIN_SAFE_INTEGER && board.turn == BLACK)) 
			break;
	}
	return best;
}

function getBestMoveAlphaBeta(board, evaluationFunction, depth, firstMoveToTry){
	var moves = board.getAllPossibleNextMoves();
	if (depth == 0) {
		return {move:undefined, score:evaluationFunction(board)};
	}

	if (moves.length == 0) {
		return board.turn == WHITE ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
	}
	
	var bestScore = undefined;
	var bestMove = undefined;
	var alpha = Number.MIN_SAFE_INTEGER;
	var beta = Number.MAX_SAFE_INTEGER;

	for (var i = -1; i < moves.length; i++) {
		var move;
		if (i == -1) {
			if (firstMoveToTry == undefined)
				continue;
			move = firstMoveToTry;
		} else {
			move = moves[i];
			//if (move == firstMoveToTry)
			//	continue;
		}
		board.move(move);
		var score = alphaBeta(board, depth-1, alpha, beta, board.turn, evaluationFunction);
		board.undo();
		if (board.turn == WHITE) {
			if (score > alpha) {
				alpha = score;
				bestScore = score;
				bestMove = move;
			}
		} else {
			if (score < beta) {
				beta = score;
				bestScore = score;
				bestMove = move;
			}
		}
	}

	return { move:bestMove, score:bestScore };
}

function alphaBeta(board,depth,alpha,beta,turn,evaluationFunction){
	if (depth == 0) {
		DEBUG_nodesEvaluated++;
		return evaluationFunction(board);
	}

	var moves = board.getAllPossibleNextMoves();
	
	if (turn == WHITE) {
		var v = Number.MIN_SAFE_INTEGER;
		for (var i = 0; i < moves.length; i++) {
			var move = moves[i];
			
			board.move(move);
			var score = alphaBeta(board,depth-1,alpha,beta,BLACK,evaluationFunction);
			board.undo();

			v = Math.max(v, score);
			alpha = Math.max(v, alpha);
			if (beta <= alpha) {
				DEBUG_cutoffs += (moves.length - i - 1);
				return v;
			}
		}
		return v;
	} else {
		var v = Number.MAX_SAFE_INTEGER;
		for (var i = 0; i < moves.length; i++) {
			var	move = moves[i];

			board.move(move);
			var score = alphaBeta(board,depth-1,alpha,beta,WHITE,evaluationFunction);
			board.undo();

			v = Math.min(v, score);			
			beta = Math.min(v, beta);
			if (beta <= alpha) {
				DEBUG_cutoffs += (moves.length - i - 1);
				return v;
			}
		}
		return v;
	}
}
