
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

	function mustGenerateWhiteEnPassantAttack(){
		// Arrange
		var b = new Board();
		b.setPiece(3,6, PAWN);
		b.setPiece(2,4, WHITE|PAWN);
		b.toggleTurn();
		b.move(3,6,3,4); // move pawn 2 forward

		// Act
		var moves = b.getMovesAt(2,4);
		
		// Assert
		assertContains(move(2,4, 3,5), moves, "Expected possible white en passant attack");
	},

	function mustGenerateBlackEnPassantAttack(){
		// Arrange
		var b = new Board();
		b.setPiece(3,1, WHITE|PAWN);
		b.setPiece(4,3, PAWN);
		b.move(3,1,3,3); // move pawn 2 forward

		// Act
		var moves = b.getMovesAt(4,3);
		
		// Assert
		assertContains(move(4,3, 3,2), moves, "Expected possible black en passant attack");
	},

	function mustGeneratePawnPromotion() {
		// Arrange
		var b = new Board();
		b.setPiece(3,6, (WHITE|PAWN));

		// Act
		var moves = b.getMovesAt(3,6);

		// Assert
		var e = "Must be able to generate pawn promotion move";
		assertContains(move(3,6, 3,7, (WHITE|QUEEN)), moves, e);
		assertContains(move(3,6, 3,7, (WHITE|KNIGHT)), moves, e);
		assertContains(move(3,6, 3,7, (WHITE|BISHOP)), moves, e);
		assertContains(move(3,6, 3,7, (WHITE|ROOK)), moves, e);
	},

	function mustUndoPawnPromotion() {
		// Arrange
		var b = new Board();
		b.setPiece(3,6, (WHITE|PAWN));
		b.move(3,6, 3,7, (WHITE|QUEEN));

		// Act
		b.undo();

		// Assert
		assertEquals((WHITE|PAWN), b.pieceAt(3,6), "Expected pawn at D7");
		assertEquals(EMPTY, b.pieceAt(3,7), "Expected nothing at D8");
	},

	function mustGenerateRookMoves() {
		_mustGenerateRookMoves(WHITE|ROOK);
	},
	
	function mustGenerateRookAttacks() {
		_mustGenerateRookAttacks(WHITE|ROOK);
	},
	
	function rookMustNotCaptureOwnPieces(){
		_rookMustNotCaptureOwnPieces(WHITE|ROOK);
	},
	
	function rookMustNotPassOwnPieces(){
		_rookMustNotPassOwnPieces(WHITE|ROOK);
	},

	function mustGenerateBishopMoves() {
		_mustGenerateBishopMoves(WHITE|BISHOP);
	},
	
	function mustGenerateBishopAttacks(){
		_mustGenerateBishopAttacks(WHITE|BISHOP);
	},

	function bishopMustNotCaptureOwnPieces(){
		_bishopMustNotCaptureOwnPieces(WHITE|BISHOP);
	},

	function bishopMustNotPassOwnPieces(){
		_bishopMustNotPassOwnPieces(WHITE|BISHOP);
	},

	function mustGenerateQueenMoves() {
		_mustGenerateRookMoves(WHITE|QUEEN);
		_mustGenerateBishopMoves(WHITE|QUEEN);
	},
	
	function mustGenerateQueenAttacks(){
		_mustGenerateRookMoves(WHITE|QUEEN);
		_mustGenerateBishopMoves(WHITE|QUEEN);
	},

	function queenMustNotCaptureOwnPieces(){
		_rookMustNotCaptureOwnPieces(WHITE|QUEEN);
		_bishopMustNotCaptureOwnPieces(WHITE|QUEEN);
	},

	function queenMustNotPassOwnPieces(){
		_rookMustNotPassOwnPieces(WHITE|QUEEN);
		_bishopMustNotPassOwnPieces(WHITE|QUEEN);
	},

	function mustGenerateKingMoves() {
		// Arrange
		var b = new Board();
		b.setPiece(3,3,WHITE|KING);
		
		// Act
		var moves = b.getMovesAt(3,3);

		// Assert
		var e = "Expected possible king move";
		assertContains(move(3,3, 2,4), moves, e);
		assertContains(move(3,3, 3,4), moves, e);
		assertContains(move(3,3, 4,4), moves, e);
		assertContains(move(3,3, 4,3), moves, e);
		assertContains(move(3,3, 4,2), moves, e);
		assertContains(move(3,3, 3,2), moves, e);
		assertContains(move(3,3, 2,2), moves, e);
		assertContains(move(3,3, 2,3), moves, e);
	},

	function mustGenerateKingMoves2() {
		// Arrange
		var b = new Board();
		b.setPiece(4,3, WHITE|KING);
		
		b.setPiece(4,1, PAWN);
		b.setPiece(4,0, ROOK);

		// Act
		var moves = b.getMovesAt(4,3);

		// Assert
		var e = "Expected possible king move";
		assertContains(move(4,3, 4,2), moves, e);
		
	},
	
	function mustGenerateKingAttacks(){
		// Arrange
		var b = new Board();
		b.setPiece(3,3,WHITE|KING);
		b.setPiece(4,2, PAWN);
		b.setPiece(3,2, PAWN);
		b.setPiece(2,2, PAWN);
		
		// Act
		var moves = b.getMovesAt(3,3);

		// Assert
		var e = "Expected possible king move";
		assertContains(move(3,3, 4,2), moves, e);
		assertContains(move(3,3, 3,2), moves, e);
		assertContains(move(3,3, 2,2), moves, e);
	},

	function kingMustNotCaptureOwnPieces(){
		// Arrange
		var b = new Board();
		b.setPiece(3,3,WHITE|KING);
		b.setPiece(2,4, WHITE|PAWN);
		b.setPiece(3,4, WHITE|PAWN);
		b.setPiece(4,4, WHITE|PAWN);
		b.setPiece(4,3, WHITE|PAWN);
		b.setPiece(4,2, WHITE|PAWN);
		b.setPiece(3,2, WHITE|PAWN);
		b.setPiece(2,2, WHITE|PAWN);
		b.setPiece(2,3, WHITE|PAWN);
		
		// Act
		var moves = b.getMovesAt(3,3);

		// Assert
		var e = "Expected impossible king move";
		assertNotContains(move(3,3, 2,4), moves, e);
		assertNotContains(move(3,3, 3,4), moves, e);
		assertNotContains(move(3,3, 4,4), moves, e);
		assertNotContains(move(3,3, 4,3), moves, e);
		assertNotContains(move(3,3, 4,2), moves, e);
		assertNotContains(move(3,3, 3,2), moves, e);
		assertNotContains(move(3,3, 2,2), moves, e);
		assertNotContains(move(3,3, 2,3), moves, e);
	},

	function kingMustNotMoveTwoFields(){
		// Arrange
		var b = new Board();
		b.setPiece(3,3, WHITE|KING);
		
		// Act
		var moves = b.getMovesAt(3,3);
		
		// Assert
		var e = "Expected impossible king move";
		assertNotContains(move(3,3, 1,5), moves, e);
		assertNotContains(move(3,3, 3,5), moves, e);
		assertNotContains(move(3,3, 5,5), moves, e);
		assertNotContains(move(3,3, 5,3), moves, e);
		assertNotContains(move(3,3, 5,1), moves, e);
		assertNotContains(move(3,3, 3,1), moves, e);
		assertNotContains(move(3,3, 1,1), moves, e);
		assertNotContains(move(3,3, 1,3), moves, e);
	},

	function kingMustNotMoveIntoCheck(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(3,7, ROOK);

		// Act
		var moves = b.getMovesAt(4,0);

		// Assert
		assertNotContains(move(4,0, 3,0), moves);
	},

	function mustNotLongCastleIfLongCastlingDisabled() {
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(0,0, WHITE|ROOK);
		b.whiteLongCastlingEnabled = false;

		// Act
		var moves = b.getMovesAt(4,0);

		// Assert
		var e = "Expected impossible castling";
		assertNotContains(move(4,0, 2,0), moves, e);
	},

	function mustNotShortCastleIfShortCastlingDisabled() {
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);
		b.whiteShortCastlingEnabled = false;

		// Act
		var moves = b.getMovesAt(4,0);

		// Assert
		var e = "Expected impossible castling";
		assertNotContains(move(4,0, 6,0), moves, e);
	},

	function mustNotLongCastleIfKingIsThreatened(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(0,0, WHITE|ROOK);
		b.setPiece(4,7, ROOK);
		
		// Act
		var moves = b.getMovesAt(4,0);
		
		// Assert
		var e = "Expected impossible castling";
		assertNotContains(move(4,0, 2,0), moves, e);
	},

	function mustNotShortCastleIfKingIsThreatened(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);
		b.setPiece(4,7, ROOK);
		
		// Act
		var moves = b.getMovesAt(4,0);
		
		// Assert
		var e = "Expected impossible castling";
		assertNotContains(move(4,0, 6,0), moves, e);
	},

	function mustNotLongCastleIfCrossedFieldsAreThreatened(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(0,0, WHITE|ROOK);
		b.setPiece(3,7, ROOK);
		
		// Act
		var moves = b.getMovesAt(4,0);
		
		// Assert
		var e = "Expected impossible castling";
		assertNotContains(move(4,0, 2,0), moves, e);
	},

	function mustNotShortCastleIfCrossedFieldsAreThreatened(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);
		b.setPiece(5,7, ROOK);
		
		// Act
		var moves = b.getMovesAt(4,0);

		// Assert
		var e = "Expected impossible castling";
		assertNotContains(move(4,0,6,0), moves, e);
	},

	function mustNotShortCastleIfCrossedFieldsAreThreatenedByPawn(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);
		b.setPiece(3,1, PAWN);
		
		// Act
		var moves = b.getMovesAt(4,0);

		// Assert
		var e = "Expected impossible castling";
		assertNotContains(move(4,0,6,0), moves, e);
	},

	function mustNotShortCastleIfCrossedFieldsAreThreatenedByBishop(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);
		b.setPiece(3,2, BISHOP);
		
		// Act
		var moves = b.getMovesAt(4,0);

		// Assert
		var e = "Expected impossible castling";
		assertNotContains(move(4,0,6,0), moves, e);
	},

	function mustNotShortCastleIfCrossedFieldsAreThreatenedByKnight(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);
		b.setPiece(3,2, KNIGHT);
		
		// Act
		var moves = b.getMovesAt(4,0);

		// Assert
		var e = "Expected impossible castling";
		assertNotContains(move(4,0,6,0), moves, e);
	},

	function mustNotShortCastleIfCrossedFieldsAreOccupied(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);
		b.setPiece(5,0, WHITE|BISHOP);
		
		// Act
		var moves = b.getMovesAt(4,0);

		// Assert
		var e = "Expected impossible castling";
		assertNotContains(move(4,0,6,0), moves, e);
	},

	function mustGenerateLongCastlingMove(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(0,0, WHITE|ROOK);
		
		// Act
		var moves = b.getMovesAt(4,0);
		
		// Assert
		var e = "Expected possible castling move";
		assertContains(move(4,0, 2,0), moves, e);
	},

	function mustGenerateShortCastlingMove(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(7,0, WHITE|ROOK);
		
		// Act
		var moves = b.getMovesAt(4,0);
		
		// Assert
		var e = "Expected possible castling move";
		assertContains(move(4,0, 6,0), moves, e);
	},

	function mustNotBringWhiteKingInChessByMovingBishop(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(3,0, WHITE|BISHOP);
		b.setPiece(0,0, ROOK);
		
		// Act
		var moves = b.getMovesAt(3,0);

		// Assert
		assertNotContains(move(3,0, 4,1), moves);
	},
	
	function mustNotBringBlackKingInChessByMovingBishop(){
		// Arrange
		var b = new Board();
		b.setPiece(4,7, KING);
		b.setPiece(3,7, BISHOP);
		b.setPiece(0,7, WHITE|ROOK);
		
		// Act
		var moves = b.getMovesAt(3,7);

		// Assert
		assertNotContains(move(3,7, 4,6), moves);
	},

	function mustNotMoveKingInCheckFromOppositeKing(){
		// Arrange
		var b = new Board();
		b.setPiece(3,3, WHITE|KING);
		b.setPiece(3,1, KING);

		// Act
		var moves = b.getMovesAt(3,3);

		// Assert
		assertNotContains(move(3,3, 3,2), moves, "King may not move close to other king");
	},

	function mustNotMoveKingInCheckFromOppositeBishop(){
		// Arrange
		var b = new Board();
		b.setPiece(4,0, WHITE|KING);
		b.setPiece(1,2, BISHOP);

		// Act
		var moves = b.getMovesAt(4,0);

		// Assert
		assertNotContains(move(4,0, 3,0), moves, "King must not move into check");
	},

	function testTemplate() {
		// Arrange
		
		// Act

		// Assert
	}
];

function _mustGenerateRookMoves(piece) {
	// Arrange
	var b = new Board();
	b.setPiece(0,0, WHITE|piece);
	b.setPiece(7,7, ROOK);
	
	// Act
	var whiteMoves = b.getMovesAt(0,0);
	var blackMoves = b.getMovesAt(7,7);

	// Assert
	var e = "Expected possible rook move";
	for (var i = 1; i < 7; i++) {
		assertContains(move(0,0, 0,i), whiteMoves, e);
		assertContains(move(0,0, i,0), whiteMoves, e);

		assertContains(move(7,7, 7,i), blackMoves, e);
		assertContains(move(7,7, i,7), blackMoves, e);
	}
}

function _mustGenerateBishopMoves(piece) {
	// Arrange
	var b = new Board();
	b.setPiece(3,0, WHITE|BISHOP);
	b.setPiece(3,7, BISHOP);
	
	// Act
	var whiteMoves = b.getMovesAt(3,0);
	var blackMoves = b.getMovesAt(3,7);

	// Assert
	var e = "Expected possible bishop move";
	assertContains(move(3,0, 2,1), whiteMoves, e);
	assertContains(move(3,0, 1,2), whiteMoves, e);
	assertContains(move(3,0, 0,3), whiteMoves, e);
	assertContains(move(3,0, 4,1), whiteMoves, e);
	assertContains(move(3,0, 5,2), whiteMoves, e);
	assertContains(move(3,0, 6,3), whiteMoves, e);
	assertContains(move(3,0, 7,4), whiteMoves, e);
	
	assertContains(move(3,7, 2,6), blackMoves, e);
	assertContains(move(3,7, 1,5), blackMoves, e);
	assertContains(move(3,7, 0,4), blackMoves, e);
	assertContains(move(3,7, 4,6), blackMoves, e);
	assertContains(move(3,7, 5,5), blackMoves, e);
	assertContains(move(3,7, 6,4), blackMoves, e);
	assertContains(move(3,7, 7,3), blackMoves, e);
}

function _mustGenerateRookAttacks(piece){
	// Arrange
	var b = new Board();
	b.setPiece(3,3, WHITE|piece);
	b.setPiece(3,1, PAWN);
	b.setPiece(3,6, PAWN);
	b.setPiece(2,3, PAWN);
	b.setPiece(7,3, PAWN);

	// Act
	var moves = b.getMovesAt(3,3);

	// Assert
	var e = "Expected possible rook attack";
	assertContains(move(3,3, 3,1), moves);
	assertContains(move(3,3, 3,6), moves);
	assertContains(move(3,3, 2,3), moves);
	assertContains(move(3,3, 7,3), moves);
}

function _rookMustNotCaptureOwnPieces(piece){
	// Arrange
	var b = new Board();
	b.setPiece(3,3, WHITE|piece);
	b.setPiece(3,1, WHITE|PAWN);
	b.setPiece(3,6, WHITE|PAWN);
	b.setPiece(2,3, WHITE|PAWN);
	b.setPiece(7,3, WHITE|PAWN);

	// Act
	var moves = b.getMovesAt(3,3);

	// Assert
	var e = "Must not be able to capture own pieces"
	assertNotContains(move(3,3, 3,1), moves, e);
	assertNotContains(move(3,3, 3,6), moves, e);
	assertNotContains(move(3,3, 2,3), moves, e);
	assertNotContains(move(3,3, 7,3), moves, e);
}

function _rookMustNotPassOwnPieces(piece){
	// Arrange
	var b = new Board();
	b.setPiece(3,3, WHITE|piece);
	b.setPiece(3,2, WHITE|PAWN);
	b.setPiece(3,4, WHITE|PAWN);
	b.setPiece(2,3, WHITE|PAWN);
	b.setPiece(4,3, WHITE|PAWN);

	// Act
	var moves = b.getMovesAt(3,3);

	// Assert
	var e = "Must not be able to pass own pieces"
	assertNotContains(move(3,3, 3,1), moves, e);
	assertNotContains(move(3,3, 3,5), moves, e);
	assertNotContains(move(3,3, 1,3), moves, e);
	assertNotContains(move(3,3, 5,3), moves, e);
}

function _mustGenerateBishopAttacks(piece){
	// Arrange
	var b = new Board();
	b.setPiece(3,3, WHITE|piece);
	b.setPiece(2,2, PAWN);
	b.setPiece(4,4, PAWN);
	b.setPiece(2,4, PAWN);
	b.setPiece(4,2, PAWN);

	// Act
	var moves = b.getMovesAt(3,3);

	// Assert
	var e = "Expected possible bishop attack";
	assertContains(move(3,3, 2,2), moves);
	assertContains(move(3,3, 4,4), moves);
	assertContains(move(3,3, 2,4), moves);
	assertContains(move(3,3, 4,2), moves);
}

function _bishopMustNotCaptureOwnPieces(piece){
	// Arrange
	var b = new Board();
	b.setPiece(3,3, WHITE|piece);
	b.setPiece(2,2, WHITE|PAWN);
	b.setPiece(4,4, WHITE|PAWN);
	b.setPiece(2,4, WHITE|PAWN);
	b.setPiece(4,2, WHITE|PAWN);

	// Act
	var moves = b.getMovesAt(3,3);

	// Assert
	var e = "Bishop must not be able to capture own pieces"
	assertNotContains(move(3,3, 2,2), moves, e);
	assertNotContains(move(3,3, 4,4), moves, e);
	assertNotContains(move(3,3, 2,4), moves, e);
	assertNotContains(move(3,3, 4,2), moves, e);
}

function _bishopMustNotPassOwnPieces(piece){
	// Arrange
	var b = new Board();
	b.setPiece(3,3, WHITE|piece);
	b.setPiece(2,2, WHITE|PAWN);
	b.setPiece(4,4, WHITE|PAWN);
	b.setPiece(2,4, WHITE|PAWN);
	b.setPiece(4,2, WHITE|PAWN);

	// Act
	var moves = b.getMovesAt(3,3);

	// Assert
	var e = "Must not be able to pass own pieces"
	assertNotContains(move(3,3, 1,1), moves, e);
	assertNotContains(move(3,3, 5,5), moves, e);
	assertNotContains(move(3,3, 1,5), moves, e);
	assertNotContains(move(3,3, 5,1), moves, e);
}

addTests(moveGenerationTests);
