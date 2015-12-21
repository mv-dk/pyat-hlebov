
function move(fromFile,fromRank,toFile,toRank,promotionPiece) {
	promotionPiece = promotionPiece | 0;
	return (fromFile) | (fromRank << 3) | (toFile << 6) | (toRank << 9) | (promotionPiece << 12);
}

var moveGenerationTests = [
	
	function mustGeneratePawnMoves() {
		// Arrange
		var b = new Board();
		b.setPiece(0, 1, WHITE|PAWN);
		
		// Act
		var moves = b.getMovesAt(0,1);

		// Assert
		assertEquals(2, moves.length);
		assertContains(move(0,1,0,2), moves);
		assertContains(move(0,1,0,3), moves);
	},

	function mustNotGeneratePawnMoveTwoForwardIfNotOnHomeRow(){
		// Arrange
		var b = new Board();
		b.setPiece(0, 2, WHITE|PAWN);
		
		// Act
		var moves = b.getMovesAt(0,2);

		// Assert
		assertEquals(1, moves.length);
		assertContains(move(0,2,0,3), moves);
	},

	function mustGenerateWhitePawnAttackRight() {
		// Arrange
		var b = new Board();
		var f = 3;
		var r = 3;
		b.setPiece(f, r, WHITE|PAWN);
		b.setPiece(f+1, r+1, PAWN);
		
		// Act
		var moves = b.getMovesAt(f,r);

		// Assert
		assertEquals(2, moves.length);
		assertContains(move(f,r, f+1,r+1), moves);
		assertContains(move(f,r, f,r+1), moves);
	},

	function mustGenerateWhitePawnAttackLeft() {
		// Arrange
		var b = new Board();
		var f = 3;
		var r = 3;
		b.setPiece(f, r, WHITE|PAWN);
		b.setPiece(f-1, r+1, PAWN);
		
		// Act
		var moves = b.getMovesAt(f,r);

		// Assert
		assertEquals(2, moves.length);
		assertContains(move(f,r, f-1,r+1), moves);
		assertContains(move(f,r, f,r+1), moves);
	},

	

	function testTemplate() {
		// Arrange
		
		// Act

		// Assert
	}
];

addTests(moveGenerationTests);
