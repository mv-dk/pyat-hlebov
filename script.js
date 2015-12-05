//// vars
var BLACK = 0;
var WHITE = 8;

var EMPTY = 0;
var PAWN = 1;
var KNIGHT = 2;
var BISHOP = 3;
var ROOK = 4;
var QUEEN = 5;
var KING = 6;

function Board(array){
	this.array = array || new Array();
	this.turn = WHITE;
	
	this.constructor = function(){
		if (this.array.length == 0) {
			for(var i = 0; i < 64; i++) { this.array[i] = 0; }
		}
	};

	this.setUpInitialPosition = function(){
		var arr = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
		for (var f = 0; f < 8; f++) { 
			this.setPiece(f,0, arr[f] | WHITE);
			this.setPiece(f,1, PAWN | WHITE);
			this.setPiece(f,6, PAWN | BLACK);
			this.setPiece(f,7, arr[f] | BLACK);
		}
	};

	this.pieceAt = function (file,rank) {
		return this.array[idx(file,rank)];
	};
	
	this.move = function (fromFile, fromRank, toFile, toRank){
		this.array[idx(toFile,toRank)] = this.pieceAt(fromFile,fromRank);
		this.array[idx(fromFile,fromRank)] = EMPTY;
		this.toggleTurn();
	};

	this.undoMove = function () {
		
	};

	this.setPiece = function (file,rank,piece){
		this.array[idx(file,rank)] = piece;
	};

	this.evaluate = function() { return evaluate(this); };
	
	this.toggleTurn = function() { 
		this.turn = this.turn == WHITE ? BLACK : WHITE;
		printDebug("turn is now "+(this.turn == WHITE ? "white's" : "black's"));
	};

	this.constructor();
}


function evaluate(board) {
	var score = 0;
	var pieceValueFactor = 10; // play around with these
	var threatValueFactor = 3;
	var moveValueFactor = 2;

	for (var file=0; file<8; file++){
		for (var rank=0; rank<8; rank++){
			score += getPieceValueAt(board,file,rank) * pieceValueFactor;
			score += getThreatValueAt(board,file,rank) * threatValueFactor;
			score += getMoveValueAt(board,file,rank) * moveValueFactor;
		}
	}
	score += (board.turn == WHITE) ? 0.5 : -0.5;
	return score;
}

var M = {
	PAWN: {
		attacks: [[-1,1],[1,1]],
		movements: [/*if first move*/[0,2],/*otherwise*/[0,1]]
	},
	ROOK: {
		movements: [[-1,0],[0,1],[1,0],[0,-1]]
	},
	KNIGHT: {
		movements: [[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1]]
	},
	BISHOP: {
		movements: [[-1,1],[1,1],[1,-1],[-1,-1]]
	},
	QUEEN: {
		movements: [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]
	},
	KING: {
		movements: [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]
	}
};

function getMovesAt(board,file,rank){
	var piece = board.pieceAt(file,rank);
	var pieceType = getPieceType(piece);
	var col = getColor(piece);
	var moves = [];
	if (pieceType == PAWN) {
		var dr = col == WHITE ? 1 : -1;
		var m = M.PAWN.movements;
		for (var i = 0; i < m.length; i++) {
			if (board.pieceAt(m[i][0],m[i][1]) == EMPTY)
				
				}
	} else {
		
	}
}



function getPieceValueAt(board,file,rank) {
	var score = 0;
	p = board.pieceAt(file,rank);
	switch (p & 7) { 
	case EMPTY: return 0;
	case PAWN: score = 1; break;
	case KNIGHT: score = 3; break;
	case ROOK: score = 5; break;
	case BISHOP: score = 4; break;
	case QUEEN: score = 10; break;
	case KING: score = 100000; break;
	}
	if (isBlack(p)) { score *= -1; }
	return score;
}

function getThreatValueAt(board,file,rank){
	var score = 0;
	var piece = board.pieceAt(file,rank);
	if (piece == EMPTY) { return 0; }
	
	var p = piece & 7;
	var enemy = EMPTY;
	if (p == PAWN) {
		return getPawnThreatValueAt(board,file,rank);
	} else if (p == ROOK){
		return getRookThreatValueAt(board,file,rank);
	} else if (p == KNIGHT) {
		return getKnightThreatValueAt(board,file,rank);
	} else if (p == BISHOP){
		return getBishopThreatValueAt(board,file,rank);
	} else if (p == QUEEN){
		return getQueenThreatValueAt(board,file,rank);
	} else if (p == KING) {
		return getKingThreatValueAt(board,file,rank);
	}

	return score;
}

function getPawnThreatValueAt(board,file,rank) {
	var piece = board.pieceAt(file,rank);
	if ((getPieceType(piece)) != PAWN) { return 0; }
	
	var score = 0;
	if (isBlack(piece)) {
		// can kill left
		if (isColoredPieceAt(board, WHITE, file-1, rank-1)) { score += 1; }

		// can kill right
		if (isColoredPieceAt(board, WHITE, file+1, rank-1)) { score += 1; }
	} else {
		// can kill left
		if (isColoredPieceAt(board, BLACK, file-1, rank+1)) { score += 1; }

		// can kill right
		if (isColoredPieceAt(board, BLACK, file+1, rank+1)) { score += 1; }
	}
	if (isBlack(piece)) score *= -1;
	return score;
}

function getRookThreatValueAt(board,file,rank,extending) {
	if (extending == undefined) extending = true;
	var piece = board.pieceAt(file,rank);
	var pieceType = getPieceType(piece);
	if (pieceType != ROOK && pieceType != QUEEN && pieceType != KING) { return 0; }
	
	var score = 0;
	var i = 0;
	var dfs = [-1, 0, 1, 0];
	var drs = [0, -1, 0, 1];
	for (i; i<4; i++){ // 4 directions
		var f = file + dfs[i];
		var r = rank + drs[i];
		while (isInside(f,r)) {
			var p = board.pieceAt(f,r);
			if (p != EMPTY) {
				if (getColor(p) != getColor(piece)) ++score;
				else break;
			}
			f += dfs[i];
			r += drs[i];
			if (!extending) break;
		}
	}
	if (isBlack(piece)) score *= -1;
	return score;
}

function getBishopThreatValueAt(board,file,rank,extending){
	if (extending == undefined) extending = true;
	var piece = board.pieceAt(file,rank);
	var pieceType = getPieceType(piece);
	if (pieceType != BISHOP) { return 0; }
	
	var score = 0;
	var i = 0;
	var dfs = [-1, -1, 1, 1];
	var drs = [-1, 1, -1, 1];
	for (i; i<4; i++){ // 4 directions
		var f = file + dfs[i];
		var r = rank + drs[i];
		while (isInside(f,r)) {
			var p = board.pieceAt(f,r);
			if (p != EMPTY) {
				if (getColor(p) != getColor(piece)) ++score;
				else break;
			}
			f += dfs[i];
			r += drs[i];
			if (!extending) break;
		}
	}
	if (isBlack(piece)) score *= -1;
	return score;
}

function getQueenThreatValueAt(board,file,rank){
	if (getPieceType((board.pieceAt(file,rank))) != QUEEN) { return 0; }
	var s1 = getBishopThreatValueAt(board,file,rank,true);
	var s2 = getRookThreatValueAt(board,file,rank,true);
	var score = s1 + s2;
	return score;
}

function getKingThreatValueAt(board,file,rank){
	if ((getPieceType(board.pieceAt(file,rank))) != KING) { return 0; }
	var s1 = getBishopThreatValueAt(board,file,rank,false);
	var s2 = getRookThreatValueAt(board,file,rank,false);
	var score = s1 + s2;
	return score;
}

function getKnightThreatValueAt(board,file,rank){
	var piece = board.pieceAt(file,rank);
	var pieceType = getPieceType(piece);
	if (pieceType != KNIGHT) { return 0; }
	var score = 0;
	var dfs = [-1, 1, 2, 2, 1, -1, -2, -2];
	var drs = [2, 2, 1, -1, -2, -2, -1, 1];
	for (var i=0; i < 8; i++){
		var f = file + dfs[i];
		var r = rank + drs[i];
		if (isInside(f,r)) {
			var p = board.pieceAt(f,r);
			if (p != EMPTY){
				if (getColor(p) != getColor(piece)) ++score;
			}
		}
	}
	if (isBlack(piece)) score *= -1;
	return score;
}

function getMoveValueAt(board,file,rank){
	var piece = board.pieceAt(file,rank);
	var pieceType = getPieceType(piece);
	if (pieceType == PAWN) {
		return getPawnMoveValueAt(board,file,rank);
	} else if (pieceType == ROOK) {
		return getRookMoveValueAt(board,file,rank);
	} else if (pieceType == BISHOP){
		return getBishopMoveValueAt(board,file,rank);
	} else if (pieceType == KNIGHT){
		return getKnightMoveValueAt(board,file,rank);
	} else if (pieceType == QUEEN){
		return getQueenMoveValueAt(board,file,rank);
	} else if (pieceType == KING){
		return getKingMoveValueAt(board,file,rank);
	}

	return 0;
}

function getPawnMoveValueAt(board,file,rank){
	var piece = board.pieceAt(file,rank);
	var pieceType = getPieceType(piece);
	if (pieceType != PAWN) { return 0; }
	var pieceColor = getColor(piece);
	var dfs = [1,2];
	var isUnmoved = 
		(pieceColor == WHITE && rank == 1) ||
		(pieceColor == BLACK && rank == 6);
	var score = 0;
	if (pieceColor == WHITE) {
		if (board.pieceAt(file,rank+1) == EMPTY) ++score;
		if (isUnmoved && board.pieceAt(file,rank+2) == EMPTY) ++score;
	} else {
		if (board.pieceAt(file,rank-1) == EMPTY) ++score;
		if (isUnmoved && board.pieceAt(file,rank-2) == EMPTY) ++score;
	}
	if (isBlack(piece)) score *= -1;
	return score;
}

function getRookMoveValueAt(board,file,rank,extending){
	if (extending == undefined) extending = true;
	var piece = board.pieceAt(file,rank);
	var pieceType = getPieceType(piece);
	if (pieceType != ROOK && pieceType != QUEEN && pieceType != KING) return 0;
	var dfs = [-1, 0, 1, 0];
	var drs = [0, 1, 0, -1];
	var score = 0;
	for (var i=0; i<4; i++){
		var f = file+dfs[i];
		var r = rank+drs[i];
		while (isInside(f,r)) {
			if (board.pieceAt(f,r) == EMPTY) ++score;
			f += dfs[i];
			r += drs[i];
			if (!extending) break;
		}
	}
	if (isBlack(piece)) score *= -1;
	return score;
}

function getBishopMoveValueAt(board,file,rank,extending){
	if (extending == undefined) extending = true;
	var piece = board.pieceAt(file,rank);
	var pieceType = getPieceType(piece);
	if (pieceType != BISHOP && pieceType != QUEEN && pieceType != KING) return 0;
	var dfs = [-1, 1, 1, -1];
	var drs = [1, 1, -1, -1];
	var score = 0;
	for (var i=0; i<4; i++){
		var f = file+dfs[i];
		var r = rank+drs[i];
		while (isInside(f,r)) {
			if (board.pieceAt(f,r) == EMPTY) ++score;
			f += dfs[i];
			r += drs[i];
			if (!extending) break;
		}
	}
	if (isBlack(piece)) score *= -1;
	return score;
}

function getQueenMoveValueAt(board,file,rank){
	var s1 = getBishopMoveValueAt(board,file,rank,true);
	var s2 = getRookMoveValueAt(board,file,rank,true);
	return s1+s2;
}

function getKingMoveValueAt(board,file,rank){
	var s1 = getBishopMoveValueAt(board,file,rank,false);
	var s2 = getRookMoveValueAt(board,file,rank,false);
	return s1+s2;
}

function getKnightMoveValueAt(board,file,rank){
	var piece = board.pieceAt(file,rank);
	var pieceType = getPieceType(piece);
	if (pieceType != KNIGHT) return 0;
	var dfs = [-1, 1, 2, 2, 1, -1, -2, -2];
	var drs = [2, 2, 1, -1, -2, -2, -1, 1];
	var score = 0;
	for(var i=0; i<8; i++){
		var f = file+dfs[i];
		var r = rank+drs[i];
		if (isInside(f,r) && board.pieceAt(f,r) == EMPTY) ++score;
	}
	if (isBlack(piece)) score *= -1;
	return score;
}

function idx(file,rank) { return file + (rank*8); }

function isEmpty(board,file,rank) {
	return board.pieceAt(file,rank) == EMPTY;
}

function isColoredPieceAt(board,col,file,rank){
	if (!isInside(file,rank)) return false;
	var p = board.pieceAt(file,rank);
	if (getPieceType(p) == EMPTY) { return false; }
	if (col == WHITE) { return isWhite(p); }
	return isBlack(p);
}

function isInside(file,rank) {
	return file >= 0 && file <= 7 && rank >= 0 && rank <= 7;
}

function isBlack(piece) { if (piece == EMPTY) throw "isBlack called on empty field"; return (piece & 8) == 0; }
function isWhite(piece) { if (piece == EMPTY) throw "isWhite called on empty field"; return !isBlack(piece); }

function getColor(piece) { return piece & 8; }
function getPieceType(piece) { return piece&7; }

