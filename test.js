
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
	
	function testTemplate() {
		// Arrange
		
		// Act

		// Assert
	}
];

addTests(tests);
