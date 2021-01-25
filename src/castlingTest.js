
var castlingTests = [
	function whiteShortCastlingMustWork() {
		// Arrange
		var b = new Board();
		//b.redrawCallback = function(){redrawBoard(b);};
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);

		// Act
		b.move(4,0, 6,0);

		// Assert
		assertEquals(WHITE|KING, b.pieceAt(6,0), "expected white king at G1");
		assertEquals(WHITE|ROOK, b.pieceAt(5,0), "expected white rook at F1");
		assertEquals(EMPTY, b.pieceAt(4,0), "expected nothing at E1");
		assertEquals(EMPTY, b.pieceAt(7,0), "expected nothing at H1");
		assertEquals(0, b.whiteLongCastlingEnabled & 1, "expected white long castling not enabled");
		assertEquals(0, b.whiteShortCastlingEnabled & 1, "expected white short castling not enabled");
	},

	function whiteShortCastlingMustBeUndoable() {
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);
		b.move(4,0, 6,0);

		// Act
		b.undo();

		// Assert
		assertEquals(WHITE|KING, b.pieceAt(4,0), "expected white king at E1");
		assertEquals(WHITE|ROOK, b.pieceAt(7,0), "expected white rook at H1");
		assertEquals(EMPTY, b.pieceAt(5,0), "expected nothing at F1");
		assertEquals(EMPTY, b.pieceAt(6,0), "expected nothing at G1");
		assertEquals(1, b.whiteLongCastlingEnabled & 1, "expected white long castling enabled");
		assertEquals(1, b.whiteShortCastlingEnabled & 1, "expected white short castling enabled");
	},

	function blackShortCastlingMustWork() {
		// Arrange
		var b = new Board();
		b.turn = BLACK;
		//b.redrawCallback = function(){redrawBoard(b);};
		b.setPiece(4,7, KING);
		b.setPiece(7,7, ROOK);

		// Act
		b.move(4,7, 6,7);

		// Assert
		assertEquals(KING, b.pieceAt(6,7), "expected black king at G8");
		assertEquals(ROOK, b.pieceAt(5,7), "expected black rook at F8");
		assertEquals(EMPTY, b.pieceAt(4,7), "expected nothing at E8");
		assertEquals(EMPTY, b.pieceAt(7,7), "expected nothing at H8");
		assertEquals(0, b.blackLongCastlingEnabled & 1, "expected black long castling not enabled");
		assertEquals(0, b.blackShortCastlingEnabled & 1, "expected black short castling not enabled");
	},
	
	function blackShortCastlingMustBeUndoable() {
		// Arrange
		var b = new Board();
		b.setPiece(4,7, KING);
		b.setPiece(7,7, ROOK);
		b.move(4,7, 6,7);

		// Act
		b.undo();

		// Assert
		assertEquals(KING, b.pieceAt(4,7), "expected black king at E8");
		assertEquals(ROOK, b.pieceAt(7,7), "expected black rook at H8");
		assertEquals(EMPTY, b.pieceAt(5,7), "expected nothing at F8");
		assertEquals(EMPTY, b.pieceAt(6,7), "expecetd nothing at G8");
		assertEquals(1, b.blackLongCastlingEnabled & 1, "expected black long castling enabled");
		assertEquals(1, b.blackShortCastlingEnabled & 1, "expected black short castling enabled");
	},
	
	function movingWhiteQueenSideRookShouldInvalidateWhiteLongCastling() {
		// Arrange
		var b = new Board();
		b.setPiece(0,0, WHITE|ROOK);
		b.setPiece(4,0, WHITE|KING);
		assertEquals(1, b.whiteLongCastlingEnabled & 1);

		// Act
		b.move(0,0, 0,1); // move the rook 1 forward

		// Assert
		assertEquals(0, b.whiteLongCastlingEnabled & 1, "expected long castling not possible");
		assertEquals(1, b.whiteShortCastlingEnabled & 1, "expected short castling possible");
	},

	function movingWhiteKingSideRookShouldInvalidateWhiteShortCastling() {
		// Arrange
		var b = new Board();
		b.setPiece(7,0, WHITE|ROOK);
		b.setPiece(4,0, WHITE|KING);
		assertEquals(1, b.whiteShortCastlingEnabled & 1);

		// Act
		b.move(7,0, 7,1); // move the rook 1 forward

		// Assert
		assertEquals(0, b.whiteShortCastlingEnabled & 1, "expected short castling not possible");
		assertEquals(1, b.whiteLongCastlingEnabled & 1, "expected long castling possible");
	},

	function movingBlackQueenSideRookShouldInvalidateBlackLongCastling() {
		// Arrange
		var b = new Board();
		b.setPiece(0,7, ROOK);
		b.setPiece(4,7, KING);
		assertEquals(1, b.blackLongCastlingEnabled & 1);

		// Act
		b.move(0,7, 0,6); // move the rook 1 forward

		// Assert
		assertEquals(0, b.blackLongCastlingEnabled & 1, "expected long castling not possible");
		assertEquals(1, b.blackShortCastlingEnabled & 1, "expected short castling possible");
	},

	function movingBlackKingSideRookShouldInvalidateBlackShortCastling() {
		// Arrange
		var b = new Board();
		b.setPiece(7,7, ROOK);
		b.setPiece(4,7, KING);
		assertEquals(1, b.blackShortCastlingEnabled & 1);

		// Act
		b.move(7,7, 7,6); // move the rook 1 forward

		// Assert
		assertEquals(0, b.blackShortCastlingEnabled & 1, "expected short castling not possible");
		assertEquals(1, b.blackLongCastlingEnabled & 1, "expected long castling possible");
	},

	function movingWhiteKingShouldInvalidateWhiteCastling() {
		// Arrange
		var b = new Board();
		b.setPiece(7,0, WHITE|ROOK);
		b.setPiece(4,0, WHITE|KING);
		assertEquals(1, b.whiteShortCastlingEnabled & 1);
		assertEquals(1, b.whiteLongCastlingEnabled & 1);

		// Act
		b.move(4,0, 4,1); // move the king 1 forward

		// Assert
		assertEquals(0, b.whiteShortCastlingEnabled & 1, "expected short castling not possible");
		assertEquals(0, b.whiteLongCastlingEnabled & 1, "expected long castling not possible");
	},

	function movingBlackKingShouldInvalidateBlackCastling() {
		// Arrange
		var b = new Board();
		b.setPiece(7,7, ROOK);
		b.setPiece(4,7, KING);
		assertEquals(1, b.blackShortCastlingEnabled & 1);
		assertEquals(1, b.blackLongCastlingEnabled & 1);

		// Act
		b.move(4,7, 4,6); // move the king 1 forward

		// Assert
		assertEquals(0, b.blackShortCastlingEnabled & 1, "expected short castling not possible");
		assertEquals(0, b.blackLongCastlingEnabled & 1, "expected long castling not possible");
	},

	function mustUpdateWhiteCastlingStateWhenUndoingRookMove(){
		// Arrange
		var b = new Board();
		b.setPiece(0,0, WHITE|ROOK);
		b.setPiece(4,0, WHITE|KING);
		
		// Act/assert
		assertEquals(1, b.whiteLongCastlingEnabled & 1, "expected castling possible");
		b.move(0,0, 0,1); // move rook
		assertEquals(0, b.whiteLongCastlingEnabled & 1, "expected castling not possible");
		b.undo();
		assertEquals(1, b.whiteLongCastlingEnabled & 1, "expected castling possible after undo");
	},

	function mustUpdateWhiteCastlingStateWhenUndoingKingMove(){
		// Arrange
		var b = new Board();
		b.setPiece(0,0, WHITE|ROOK);
		b.setPiece(4,0, WHITE|KING);
		
		// Act/assert
		assertEquals(1, b.whiteLongCastlingEnabled & 1, "expected castling possible");
		b.move(4,0, 4,1); // move king
		assertEquals(0, b.whiteLongCastlingEnabled & 1, "expected castling not possible");
		b.undo();
		assertEquals(1, b.whiteLongCastlingEnabled & 1, "expected castling possible after undo");
	},

	function testTemplate() {
		// Arrange
		
		// Act

		// Assert
	}
];

addTests(castlingTests);
