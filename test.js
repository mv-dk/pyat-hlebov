function output(txt) {
	document.getElementById("testArea").innerHTML += txt;
}

function assertEquals(expected,actual,errMsg) {
	errMsg = errMsg || "";
	if (expected != actual) {
//		output(arguments.callee.caller.name + " failed. Expected '" + expected + "', was '"+actual+"': "+ errMsg + "\n");
		throw "\n\tExpected '" + expected + "', was '"+actual+"':\n\t"+ errMsg + "\n\n";
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

	function movePawnOneForwardTest() {
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
		assertEquals(WHITE|KING, b.pieceAt(6,0), "expected white king at G1");
		assertEquals(WHITE|ROOK, b.pieceAt(5,0), "expected white rook at F1");
		assertEquals(EMPTY, b.pieceAt(4,0), "expected nothing at E1");
		assertEquals(EMPTY, b.pieceAt(7,0), "expected nothing at H1");
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
		var passedTests = 0;
		// run all tests
		for (var i = 0; i < tests.length; i++) { 
			var funcName = "";
			try { 
				funcName = tests[i].name;
				tests[i](); 
				++passedTests;
			} catch (e) {
				output(funcName + ": " + e);
			}
		}
		output("passed "+passedTests+"/"+tests.length+" tests.");
	}
})();
