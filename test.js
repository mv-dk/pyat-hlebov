
var tests = [

	function mustBeAbleToSetUpInitialPosition() {
		// Arrange
		var b = getBoard();

		// Act
		b.setUpInitialPosition();

		// Assert

		/* check all empty fields */
		for (var file = 0; file < 8; file++) {
			for (var rank = 2; rank < 6; rank++) {
				assertEquals(0, b.pieceAt(file,rank));
			}
		}
		/* check all pawns */
		for (file = 0; file < 8; file++) {
			assertEquals(WHITE|PAWN, b.pieceAt(file, 1));
			assertEquals(PAWN, b.pieceAt(file, 6));
		}

		/* check all other pieces */
		assertEquals(WHITE|ROOK, b.pieceAt(0,0));
		assertEquals(WHITE|ROOK, b.pieceAt(7,0));
		assertEquals(WHITE|KNIGHT, b.pieceAt(1,0));
		assertEquals(WHITE|KNIGHT, b.pieceAt(6,0));
		assertEquals(WHITE|BISHOP, b.pieceAt(2,0));
		assertEquals(WHITE|BISHOP, b.pieceAt(5,0));
		assertEquals(WHITE|QUEEN, b.pieceAt(3,0));
		assertEquals(WHITE|KING, b.pieceAt(4,0));

		assertEquals(ROOK,b.pieceAt(0,7));
		assertEquals(ROOK, b.pieceAt(7,7));
		assertEquals(KNIGHT, b.pieceAt(1,7));
		assertEquals(KNIGHT, b.pieceAt(6,7));
		assertEquals(BISHOP, b.pieceAt(2,7));
		assertEquals(BISHOP, b.pieceAt(5,7));
		assertEquals(QUEEN, b.pieceAt(3,7));
		assertEquals(KING, b.pieceAt(4,7));
	},

	function mustBeAbleToMovePawn() {
		// Arrange
		var b = new Board();
		b.setUpInitialPosition();

		// Act
		var fileFrom = 0, rankFrom = 1, fileTo = 0, rankTo = 2;
		b.move(fileFrom, rankFrom, fileTo, rankTo);

		// Assert
		assertEquals(EMPTY, b.pieceAt(fileFrom,rankFrom), "expected nothing at A2");
		assertEquals(WHITE|PAWN, b.pieceAt(fileTo, rankTo), "expected white pawn at A3");
	},

	function canUndoPawnMove(){
		// Arrange
		var b = new Board();
		b.setUpInitialPosition();
		var fileFrom = 0;
		var rankFrom = 1;
		var fileTo = 0;
		var rankTo = 2;
		b.move(fileFrom, rankFrom, fileTo, rankTo);
		
		// Act
		b.undo();

		// Assert
		assertEquals(EMPTY, b.pieceAt(fileTo, rankTo), "expected nothing at A3");
		assertEquals(WHITE|PAWN, b.pieceAt(fileFrom, rankFrom), "expected white pawn at A2");

	},

	function mustNotSetEnPassantStateTrueWhenMovingPawnOneForward() {
		// Arrange
		var b = new Board();
		b.setUpInitialPosition();
		
		// Act
		b.move(0,1,0,2); // pawn 1 forward

		// Assert
		assertEquals(0, b.enPassant, "enPassant was set true, when it shouldn't");
	},

	function mustSetEnPassantStateTrueWhenMovingPawnTwoForward() {
		// Arrange
		var b = new Board();
		b.setUpInitialPosition();
		
		// Act
		b.move(0,1,0,3); // pawn 2 forward

		// Assert
		assertEquals(1, b.enPassant, "enPassant was not set true, when it should");
	},

	function mustBeAbleToMakeEnPassantCapture(){
		// Arrange
		var b = new Board();
		b.setPiece(0,1, WHITE|PAWN);
		b.setPiece(1,3, PAWN);
		
		b.move(0,1, 0,3); // move white pawn 2 forward
		
		// Act
		b.move(1,3, 0,2); // move black pawn to behind the white pawn (en passant capture)

		// Assert
		assertEquals(EMPTY, b.pieceAt(0,3), "expected pawn captured by en passant move");
	},
	
	function mustBeAbleToUndoEnPassantCapture(){
		// Arrange
		var b = new Board();
		b.setPiece(0,1, WHITE|PAWN);
		b.setPiece(1,3, PAWN);
		
		b.move(0,1, 0,3); // move white pawn 2 forward
		b.move(1,3, 0,2); // move black pawn to behind the white pawn (en passant capture)
		
		// Act
		b.undo();

		// Assert
		assertEquals(WHITE|PAWN, b.pieceAt(0,3), "expected white pawn at A4");
		assertEquals(PAWN, b.pieceAt(1,3), "expected black pawn at B4");
	},

	function mustBeAbleToPromotePawn() {
		// Arrange
		var b = new Board();
		b.setPiece(0,6,WHITE|PAWN);

		// Act
		b.move(0,6, 0,7, WHITE|QUEEN);

		// Assert
		assertEquals(WHITE|QUEEN,b.pieceAt(0,7), "Expected pawn promoted to white queen");
	},
	
	function mustBeAbleToUndoPromotedPawn() {
		// Arrange
		var b = new Board();
		b.setPiece(0,6,WHITE|PAWN);
		b.move(0,6, 0,7, WHITE|QUEEN);

		// Act
		b.undo();

		// Assert
		assertEquals(WHITE|PAWN, b.pieceAt(0,6), "Expected pawn promotion was undone");
	},
	
	function testTemplate() {
		// Arrange
		
		// Act

		// Assert
	}
];

addTests(tests);
