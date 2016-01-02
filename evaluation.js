function evaluate(board) {
	//return evaluateWithEstimatedMoves(board,5,1,1);
	return evaluateWithEstimatedMovesAndAvoidCastling(board,5,1,1);
}

function evaluateWithEstimatedMovesAndAvoidCastling(board, pieceValueFactor, threatValueFactor, moveValueFactor){
	var score = 0;
    
    for (var file=0; file<8; file++){
        for (var rank=0; rank<8; rank++){
            score += getPieceValueAt(board,file,rank) * pieceValueFactor;
            score += getThreatValueAt(board,file,rank) * threatValueFactor;
            score += getMoveValueAt(board,file,rank) * moveValueFactor;
        }
    }
	
	if (board.whiteLongCastlingEnabled) {
		score += 1;
	}
	if (board.whiteShortCastlingEnabled) {
		score += 1;
	}
	if (board.blackLongCastlingEnabled) {
		score -= 1;
	}
	if (board.blackShortCastlingEnabled) {
		score -= 1;
	}

	score = (Math.round(score*100))/100;
    return score;
}

function evaluateWithEstimatedMoves(board, pieceValueFactor, threatValueFactor, moveValueFactor){
	var score = 0;
    
    for (var file=0; file<8; file++){
        for (var rank=0; rank<8; rank++){
            score += getPieceValueAt(board,file,rank) * pieceValueFactor;
            score += getThreatValueAt(board,file,rank) * threatValueFactor;
            score += getMoveValueAt(board,file,rank) * moveValueFactor;
        }
    }
	score = (Math.round(score*100))/100;
    return score;
}

function evaluateWithCenterValuation(board, pieceValueFactor, threatValueFactor, moveValueFactor){
	var score = 0;
    
    for (var file=0; file<8; file++){
        for (var rank=0; rank<8; rank++){
            score += getPieceValueAt(board,file,rank) * pieceValueFactor;
            score += getThreatValueAt(board,file,rank) * threatValueFactor;
            score += getMoveValueAt(board,file,rank) * moveValueFactor;
        }
    }

	if (board.isPositionThreatenedBy(3,3, WHITE)){ score += 1; }
	if (board.isPositionThreatenedBy(3,3, BLACK)) { score -= 1; }
	if (board.isPositionThreatenedBy(3,4, WHITE)){ score += 1; }
	if (board.isPositionThreatenedBy(3,4, BLACK)) { score -= 1; }
	if (board.isPositionThreatenedBy(4,3, WHITE)){ score += 1; }
	if (board.isPositionThreatenedBy(4,3, BLACK)) { score -= 1; }
	if (board.isPositionThreatenedBy(4,4, WHITE)){ score += 1; }
	if (board.isPositionThreatenedBy(4,4, BLACK)) { score -= 1; }
	score = (Math.round(score*100))/100;
    return score;
}

function evaluateWithRealMoves(board){
	var score = 0;
    var pieceValueFactor = 1; // play around with these
    var threatValueFactor = 1;
	var moveValueFactor = 1;
	var blackMoves = board.getAllPossibleMovesForColor(BLACK);
	if (blackMoves.length == 0 && board.turn == BLACK) return Number.MAX_SAFE_INTEGER;

	var whiteMoves = board.getAllPossibleMovesForColor(WHITE); // 
	if (whiteMoves.length == 0 && board.turn == WHITE) return Number.MIN_SAFE_INTEGER;

    for (var file=0; file<8; file++){
        for (var rank=0; rank<8; rank++){
            score += getPieceValueAt(board,file,rank) * pieceValueFactor;
            score += getThreatValueAt(board,file,rank) * threatValueFactor;
        }
    }
	score -= blackMoves.length * moveValueFactor; // 
	score += whiteMoves.length * moveValueFactor;
	score = (Math.round(score*100))/100;
    return score;
}


