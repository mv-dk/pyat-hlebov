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

function Board(array, redrawCallback){
    this.array = array || new Array();
    this.history = new Array();
    this.turn = WHITE;
    this.enPassant = 0;
    this.redrawCallback = redrawCallback || function () {};
	this.whiteLongCastlingEnabled = true;
	this.whiteShortCastlingEnabled = true;
	this.blackLongCastlingEnabled = true;
	this.blackShortCastlingEnabled = true;
	
	// Call the constructor
	this.constructor();
}

Board.prototype.constructor = function(){
    if (this.array.length == 0) {
        for(var i = 0; i < 64; i++) { this.array[i] = 0; }
    }
};

Board.prototype.setUpInitialPosition = function() {
    var arr = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
    for (var f = 0; f < 8; f++) { 
        this.setPiece(f,0, arr[f] | WHITE);
        this.setPiece(f,1, PAWN | WHITE);
        this.setPiece(f,6, PAWN | BLACK);
        this.setPiece(f,7, arr[f] | BLACK);
    }
    this.redrawCallback();
};

Board.prototype.pieceAt = function (file,rank) {
    return this.array[idx(file,rank)];
};

// returns true if move is valid, false otherwise
Board.prototype.validateMove = function (fromFile, fromRank, toFile, toRank) {
	return true;
};

/*
1. push state to the history
2. apply the move
*/
Board.prototype.move = function (fromFile, fromRank, toFile, toRank, promotionPiece) {
	var capturedPiece = this.pieceAt(toFile,toRank);

	// save state
	var state = 0;
	state =
		(fromFile) |
		(fromRank << 3) |
		(toFile << 6) |
		(toRank << 9) |
		(this.enPassant << 12) | 
		(this.whiteLongCastlingEnabled << 13) | 
		(this.whiteShortCastlingEnabled << 14) |
		(this.blackLongCastlingEnabled << 15) |
		(this.blackShortCastlingEnabled << 16) |
		(capturedPiece << 17);

	this.history.push(state);
	
	// apply move
	var piece = this.pieceAt(fromFile,fromRank);
	
	// if pawn 2 forward, enable enPassant
	this.enPassant = 1 & ((piece & 7) == PAWN && Math.abs(toRank - fromRank) == 2);
	// no special move
	if (true) {
		this.setPiece(toFile,toRank,piece);
		this.setPiece(fromFile,fromRank, EMPTY);
	}
	this.toggleTurn();
	this.redrawCallback();
};

/*
1. apply the inverse move
2. pop the state from the history
3. apply popped state
*/
Board.prototype.undo = function() {
	if (this.history.length == 0) return;
	var state = this.history.pop();
	var fromFile = state & 7;
	var fromRank = (state >> 3) & 7;
	var toFile = (state >> 6) & 7;
	var toRank = (state >> 9) & 7;
	var enPassant = (state >> 12) & 1;
	var whiteLongCastlingEnabled = (state >> 13) & 1;
	var whiteShortCastlingEnabled = (state >> 14) & 1;
	var blackLongCastlingEnabled = (state >> 15) & 1;
	var blackShortCastlingEnabled = (state >> 16) & 1;
	var capturedPiece = (state >> 17) & 15;

	var piece = this.pieceAt(toFile,toRank);

	// apply inverse move
	this.setPiece(fromFile,fromRank, piece);
	this.setPiece(toFile,toRank,capturedPiece);

	// apply popped state
	this.enPassant = enPassant;
	this.whiteLongCastlingEnabled = whiteLongCastlingEnabled;
	this.whiteShortCastlingEnabled = whiteShortCastlingEnabled;
	this.blackLongCastlingEnabled = blackLongCastlingEnabled;
	this.blackShortCastlingEnabled = blackShortCastlingEnabled;
	
	this.toggleTurn();
	this.redrawCallback();
};

/*
Board.prototype.move = function (fromFile, fromRank, toFile, toRank, promotionPiece){
	promotionPiece = promotionPiece || 0;
	var fromPiece = this.pieceAt(fromFile,fromRank);
	var fromPieceType = getPieceType(fromPiece);
	var toPiece = this.pieceAt(toFile,toRank);
    var enPassantOpened = fromPieceType == PAWN && Math.abs(toRank-fromRank) == 2 ? 1 : 0;
	var enPassantCapture = fromPieceType == PAWN && fromFile != toFile && toPiece == EMPTY && this.enPassant;
	var whiteShortCastling = fromPiece == (WHITE | KING) && fromFile == 4 && toFile == 6;
	var blackShortCastling = fromPiece == KING && fromFile == 4 && toFile == 6;
	var whiteLongCastling = fromPiece == (WHITE | KING) && fromFile == 4 && toFile == 2;
	var blackLongCastling = fromPiece == KING && fromFile == 4 && toFile == 2;
	var invalidatedWhiteShortCastling = fromPiece == ((WHITE | ROOK) && fromFile == 0 && fromRow == 0) || fromPiece == (WHITE | KING);
	var invalidatedBlackShortCastling = fromPiece == (ROOK && fromFile == 0 && fromRow == 7) || fromPiece == KING;
	var invalidatedWhiteLongCastling = fromPiece == ((WHITE | ROOK) && fromFile == 7 && fromRow == 0) || fromPiece == (WHITE | KING);
	var invalidatedBlackLongCastling = fromPiece == (ROOK && fromFile == 0 && fromRow == 7) || fromPiece == KING;

	this.addHistory(fromFile,fromRank,toFile,toRank,
					toPiece,
					enPassantOpened,
				    whiteShortCastling, blackShortCastling,
				    whiteLongCastling, blackLongCastling, 
					promotionPiece,
				    invalidatedWhiteShortCastling,
					invalidatedBlackShortCastling,
					invalidatedWhiteLongCastling,
				    invalidatedBlackLongCastling);
	
	this.setPiece(toFile,toRank,fromPiece);
	this.setPiece(fromFile,fromRank,EMPTY);
	if (enPassantCapture) {
		if (getColor(fromPiece) == WHITE) {
			this.setPiece(toFile,toRank-1, EMPTY);
		} else {
			this.setPiece(toFile,toRank+1, EMPTY);
		}
	} else if (whiteShortCastling){
		this.setPiece(5,0,WHITE|ROOK);
		this.setPiece(7,0,EMPTY);
	} else if (whiteLongCastling){
		this.setPiece(3,0,WHITE|ROOK);
		this.setPiece(0,0,EMPTY);
	} else if (blackShortCastling){
		this.setPiece(5,7,ROOK);
		this.setPiece(0,7,EMPTY);
	} else if (blackLongCastling){
		this.setPiece(3,7,WHITE|ROOK);
		this.setPiece(0,7,EMPTY);
	}
	
    this.toggleTurn();
    this.enPassant = enPassantOpened;
	this.whiteLongCastlingEnabled = this.whiteLongCastlingEnabled && !invalidatedWhiteLongCastling;
	this.blackLongCastlingEnabled = this.blackLongCastlingEnabled && !invalidatedBlackLongCastling;
	this.whiteShortCastlingEnabled = this.whiteShortCastlingEnabled && !invalidatedWhiteShortCastling;
	this.blackShortCastlingEnabled = this.blackShortCastlingEnabled && !invalidatedBlackShortCastling;
	
    this.redrawCallback();
};

Board.prototype.addHistory = function(fromFile,fromRank,toFile,toRank,pieceCaptured,enPassantOpened,enPassantCapture,whiteShortCastling,blackShortCastling,whiteLongCastling,blackLongCastling, isPromotion, invalidatedWhiteShortCastling, invalidatedBlackShortCastling, invalidatedWhiteLongCastling, invalidatedBlackLongCastling){
    // bit format:
    // 00000 p o n m l k j i h g f eeee ddd ccc bbb aaa
    // aaa: 3 bits, file from
    // bbb: 3 bits, rank from
    // ccc: 3 bits, file to
    // ddd: 3 bits, rank to
    // eeee: 4 bits, piece captured
    // f: en passant enabled (move was pawn 2 forward)
	// g: en passant capture (move was en passant)
	// h: white short castling
	// i: black short castling
	// j: white long castling
	// k: black long castling
	// l: promotion piece (if nonzero, move was promotion)
	// m: did move invalidate white short castling
	// n: did move invalidate black short castling
	// o: did move invalidate white long castling
	// p: did move invalidate black long castling
    var v = 
        fromFile | (fromRank<<3) | 
        (toFile<<6) | (toRank<<9) |
        (pieceCaptured<<12) | 
        (enPassantOpened<<16) |
		(enPassantCapture<<17) |
		(whiteShortCastling<<18) |
		(blackShortCastling<<19) |
		(whiteLongCastling<<20) |
		(blackLongCastling<<21) |
		(isPromotion<<22) |
		(invalidatedWhiteShortCastling << 23) |
		(invalidatedBlackShortCastling << 24) |
		(invalidatedWhiteLongCastling << 25) |
		(invalidatedBlackLongCastling << 26);
    this.history.push(v);
};

Board.prototype.undo = function () {
    if (this.history.length == 0) {
        return;
    }
    var m = this.history.pop();
    var fromFile = m & 7;
    var fromRank = (m>>3) & 7;
    var toFile = (m>>6) & 7;
    var toRank = (m>>9) & 7;
    var pieceCaptured = (m>>12) & 15;
    var enPassantOpened = (this.history[this.history.length-1]>>16) & 1;
	var enPassantCapture = (m>>17) & 1;
	var whiteShortCastling = (m>>18) & 1;
	var blackShortCastling = (m>>19) & 1;
	var whiteLongCastling = (m>>20) & 1;
	var blackLongCastling = (m>>21) & 1;
	var isPromotion = (m>>22) & 15;
	var invalidatedWhiteShortCastling = (m>>23) & 1;
	var invalidatedBlackShortCastling = (m>>24) & 1;
	var invalidatedWhiteLongCastling = (m>>25) & 1;
	var invalidatedBlackLongCastling = (m>>26) & 1;
	
	// castling
	if (whiteShortCastling || whiteLongCastling || blackShortCastling || blackLongCastling) {
		if (whiteShortCastling) {
			this.setPiece(6,0,WHITE|KING);
			this.setPiece(5,0,WHITE|ROOK);
			this.setPiece(4,0,EMPTY);
			this.setPiece(7,0,EMPTY);
		} else if (whiteLongCastling) {
			this.setPiece(2,0,WHITE|KING);
			this.setPiece(3,0,WHITE|ROOK);
			this.setPiece(0,0,EMPTY);
			this.setPiece(4,0,EMPTY);
		} else if (blackShortCastling) {
			this.setPiece(6,7,KING);
			this.setPiece(5,7,ROOK);
			this.setPiece(4,7,EMPTY);
			this.setPiece(7,7,EMPTY);
		} else if (blackLongCastling) {
			this.setPiece(2,7,KING);
			this.setPiece(3,7,ROOK);
			this.setPiece(0,7,EMPTY);
			this.setPiece(4,7,EMPTY);
		}
	} 
	// promotion
	else if (isPromotion != 0) {
		
	}
	// en passant capture
	else if (false) {
		
	}
	// plain old move
	else {
		this.setPiece(fromFile,fromRank, this.pieceAt(toFile,toRank));
		this.setPiece(toFile,toRank, pieceCaptured);
	}
    

    this.enPassant = enPassantOpened;
    this.toggleTurn();
    this.redrawCallback();
};
*/
Board.prototype.setPiece = function (file,rank,piece){
    this.array[idx(file,rank)] = piece;
};

Board.prototype.evaluate = function() { return evaluate(this); };

Board.prototype.toggleTurn = function() { 
    this.turn = this.turn == WHITE ? BLACK : WHITE;
    printDebug("turn is now "+(this.turn == WHITE ? "white's" : "black's"));
};



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

function getMovePatternsForPiece(pieceType){
    switch (pieceType) {
        case PAWN: 
            return {
                attacks: [[-1,1],[1,1]],
                movements: [/*if first move*/[0,2],/*otherwise*/[0,1]]
            };
        case ROOK: return [[-1,0],[0,1],[1,0],[0,-1]];
        case KNIGHT: return [[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1]];
        case BISHOP: return [[-1,1],[1,1],[1,-1],[-1,-1]];
        case QUEEN:
        case KING: [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
    }
}

// Returns an array of short move format (..000 rrr fff)
function getMovesAt(board,file,rank){
    var piece = board.pieceAt(file,rank);
    var pieceType = getPieceType(piece);
    var col = getColor(piece);
    var moves = [];

    if (pieceType == PAWN) {
        var dr = col == WHITE ? 1 : -1;
        var movesAndAttacks = getMovePatternsForPiece(pieceType);
        var m = movesAndAttacks.movements;
        var a = movesAndAttacks.attacks;
        // Add moves
        // first move
        if (rank == 1 && col == WHITE || rank == 6 && col == BLACK) {
            var dir = col == WHITE ? 1 : -1;
            if (board.pieceAt(file+dir*m[0],m[1]) == EMPTY) {
                moves.push(f);
            }
        }
        // Add attacks
    }
    else {

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

