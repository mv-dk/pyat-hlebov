function output(txt) {
	document.getElementById("testArea").innerHTML += txt;
}

function assertEquals(expected,actual,errMsg) {
	errMsg = errMsg || "error";
	if (expected != actual) {
//		output(arguments.callee.caller.name + " failed. Expected '" + expected + "', was '"+actual+"': "+ errMsg + "\n");
		throw "Test failed. Expected '" + expected + "', was '"+actual+"': "+ errMsg + "\n";
	}
}

function emptyFunc() { }

function getBoard() {
	var b = new Board();
	b.setUpInitialPosition();
	b.redrawCallback = emptyFunc;
	return b;
}

var tests = [

	function setUpInitialPositionTest() {
		// Arrange
		var b = getBoard();

		// Act
		b.setUpInitialPosition();

		// Assert

		/* check all empty fields */
		for (var file = 0; file < 8; file++) {
			for (var rank = 2; rank < 6; rank++) {
				assertEquals(b.pieceAt(file,rank), 0);
			}
		}
		/* check all pawns */
		for (file = 0; file < 8; file++) {
			assertEquals(b.pieceAt(file, 1), WHITE|PAWN);
			assertEquals(b.pieceAt(file, 6), PAWN);
		}

		/* check all other pieces */
		assertEquals(b.pieceAt(0,0), WHITE|ROOK);
		assertEquals(b.pieceAt(7,0), WHITE|ROOK);
		assertEquals(b.pieceAt(1,0), WHITE|KNIGHT);
		assertEquals(b.pieceAt(6,0), WHITE|KNIGHT);
		assertEquals(b.pieceAt(2,0), WHITE|BISHOP);
		assertEquals(b.pieceAt(5,0), WHITE|BISHOP);
		assertEquals(b.pieceAt(3,0), WHITE|QUEEN);
		assertEquals(b.pieceAt(4,0), WHITE|KING);

		assertEquals(b.pieceAt(0,7), ROOK);
		assertEquals(b.pieceAt(7,7), ROOK);
		assertEquals(b.pieceAt(1,7), KNIGHT);
		assertEquals(b.pieceAt(6,7), KNIGHT);
		assertEquals(b.pieceAt(2,7), BISHOP);
		assertEquals(b.pieceAt(5,7), BISHOP);
		assertEquals(b.pieceAt(3,7), QUEEN);
		assertEquals(b.pieceAt(4,7), KING);
	},

	function movePawnOneForwardTest() {
		// Arrange
		var b = new Board();
		b.setUpInitialPosition();

		// Act
		var fileFrom = 0, rankFrom = 1, fileTo = 0, rankTo = 2;
		b.move(fileFrom, rankFrom, fileTo, rankTo);

		// Assert
		assertEquals(b.pieceAt(fileFrom,rankFrom), EMPTY);
		assertEquals(b.pieceAt(fileTo, rankTo), WHITE|PAWN);
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
		assertEquals(b.pieceAt(fileTo, rankTo), EMPTY);
		assertEquals(b.pieceAt(fileFrom, rankFrom), WHITE|PAWN);

	},

	function setEnPassantStateFalseTest() {
		// Arrange
		var b = new Board();
		b.setUpInitialPosition();
		
		// Act
		b.move(0,1,0,2); // pawn 1 forward

		// Assert
		assertEquals(0, b.enPassant, "enPassant was set true, when it shouldn't");
	},

	function setEnPassantStateTrueTest() {
		// Arrange
		var b = new Board();
		b.setUpInitialPosition();
		
		// Act
		b.move(0,1,0,3); // pawn 2 forward

		// Assert
		assertEquals(1, b.enPassant, "enPassant was not set true, when it should");
	},

	function whiteShortCastlingMustWork() {
		// Arrange
		var b = new Board();
		//b.redrawCallback = function(){redrawBoard(b);};
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);

		// Act
		b.move(4,0, 6,0);

		// Assert
		assertEquals(b.pieceAt(6,0), WHITE|KING);
		assertEquals(b.pieceAt(5,0), WHITE|ROOK);
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
		assertEquals(b.pieceAt(4,0), WHITE|KING);
		assertEquals(b.pieceAt(7,0), WHITE|ROOK);
		assertEquals(b.pieceAt(5,0), EMPTY);
		assertEquals(b.pieceAt(6,0), EMPTY);
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
		assertEquals(b.pieceAt(6,7), KING);
		assertEquals(b.pieceAt(5,7), ROOK);
	},
	
	function whiteShortCastlingMustBeUndoable() {
		// Arrange
		var b = new Board();
		b.setPiece(4,7, KING);
		b.setPiece(7,7, ROOK);
		b.move(4,7, 6,7);

		// Act
		b.undo();

		// Assert
		assertEquals(b.pieceAt(4,7), KING);
		assertEquals(b.pieceAt(7,7), ROOK);
		assertEquals(b.pieceAt(5,7), EMPTY);
		assertEquals(b.pieceAt(6,7), EMPTY);
	},


	function testTemplate() {
		// Arrange
		
		// Act

		// Assert
	}
];


(function () {
	var oldonload = window.onload;
	window.onload = function() {
		if (oldonload != undefined) { oldonload(); }
		// run all tests
		for (var i = 0; i < tests.length; i++) { 
			var funcName = "";
			try { 
				funcName = tests[i].name;
				tests[i](); 
			} catch (e) {
				output(funcName + ": " + e);
			}
		}
	}
})();
