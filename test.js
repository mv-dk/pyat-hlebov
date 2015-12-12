function output(txt) {
	document.getElementById("testArea").innerHTML += txt;
}

function assertEquals(expected,actual,errMsg) {
	errMsg = errMsg || "error";
	if (expected != actual) {
//		output(arguments.callee.caller.name + " failed. Expected '" + expected + "', was '"+actual+"': "+ errMsg + "\n");
		throw arguments.callee.caller.name + " failed. Expected '" + expected + "', was '"+actual+"': "+ errMsg + "\n";
	}
}

var tests = [

	function setUpInitialPositionTest() {
		var b = new Board();
		b.setUpInitialPosition();

		// check all empty fields
		for (var file = 0; file < 8; file++) {
			for (var rank = 2; rank < 6; rank++) {
				assertEquals(b.pieceAt(file,rank), 0);
			}
		}
		// check all pawns
		for (file = 0; file < 8; file++) {
			assertEquals(b.pieceAt(file, 1), WHITE|PAWN);
			assertEquals(b.pieceAt(file, 6), PAWN);
		}

		// check all other pieces
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

	function otherTest(){
		assertEquals(1,2);
	}
];


// run all tests
for (var i = 0; i < tests.length; i++) { try { tests[i](); } catch (e) { output(e);	}}
