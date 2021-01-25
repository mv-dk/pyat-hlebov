function runGamesWithSearchAlgorithms(numGames, alg1, alg2, depth) {
	var whiteWins = 0, draws = 0, whiteLosses = 0;
	var f = function() {};

	for (var i = 0; i < numGames; i++) {
		var board = new Board();
		board.redrawCallback = f;
		board.setUpInitialPosition();
		
		var movesApplied = 0;
		while (movesApplied++ <= 200) {
			var alg = board.turn == WHITE ?	alg1 : alg2;
			var result = getBestMove(board, alg, evaluate, depth);
			if (result.move == undefined) {
				if (board.isKingThreatened(WHITE)) {
					whiteLosses++;
				} else if (board.isKingThreatened(BLACK)) {
					whiteWins++;
				} else {
					draws++;
				}
				break;
			}
			if (movesApplied == 200) {
				draws++;
				break;
			}
			board.move(result.move);
		}
	}
	return {whiteWins:whiteWins, whiteLosses:whiteLosses, draws:draws};
}

function getBestSearchAlgorithm(numGames, alg1, alg2, depth){
	var f1, f2;
	if (typeof(alg1) == "function") { f1 = alg1; }
	else { f1 = alg1.func; }
	if (typeof(alg2) == "function") { f2 = alg2; }
	else { f2 = alg2.func; }
	
	var result1 = runGamesWithSearchAlgorithms(numGames, f1, f2, depth);
	var result2 = runGamesWithSearchAlgorithms(numGames, f2, f1, depth);
	
	if (result1.whiteWins > result2.whiteWins){
		return [alg1,result1,result2];
	}
	if (result2.whiteWins > result1.whiteWins) {
		return [alg2,result1,result2];
	}
	return [alg1,result1,result2];
}

function ensureAreEqual(alg1, alg2, depth) {
	var board = new Board();
	board.setUpInitialPosition();
	
	var escape = 0;
	while (escape++ <= 200) {
		var m1 = getBestMove(board, depth, alg1, evaluate);
		var m2 = getBestMove(board, depth, alg2, evaluate);
		if (m1.move != m2.move) {
			console.log("Error at move "+escape + " (m1: "+m1.move+", m2: "+m2.move+")");
			console.log(board.array);
			throw "search alrogithms are not equal";
		}
		board.move(m1.move);
	}
}

function testMinmaxAndAlphaBetaAreEqual(depth){
	ensureAreEqual(getBestMoveMinmax, getBestMoveAlphaBeta, depth);
	console.log("Minmax and alphabeta are pretty much equal");
}

function testAlphaBetaAndIterativeAlphaBetaAreEqual(depth){
	ensureAreEqual(getBestMoveAlphaBeta, getBestMoveAlphaBetaIterativeDeepening, depth);
	console.log("Minmax and alphabeta with iterative deepening are pretty much equal");
}

function alphaBetaVsIterativeDeepening(depth){
	var alg1 = {func: getBestMoveAlphaBeta, name:"alpha beta"};
	var alg2 = {func: getBestMoveAlphaBetaIterativeDeepening, name:"alpha beta with iterative deepening"};
	var best = getBestSearchAlgorithm(1, alg2, alg1, depth);
	console.log("best is "+ best[0].name + " (result1: "+
				JSON.stringify(best[1])+", result2:"+
				JSON.stringify(best[2])+")");
}

function alphaBetaVsRandom(depth){
	var alg1 = {func: getBestMoveAlphaBeta, name:"alpha beta"};
	var alg2 = {func: randomSearchFunction, name:"random"};
	var best = getBestSearchAlgorithm(10, alg2, alg1, depth);
	console.log("best is "+ best[0].name + " (result1: "+
				JSON.stringify(best[1])+", result2:"+
				JSON.stringify(best[2])+")");
}

function alphaBetaIterativeDeepeningVsRandom(depth){
	var alg1 = {func: getBestMoveAlphaBetaIterativeDeepening, name:"alpha beta iterative deepening"};
	var alg2 = {func: randomSearchFunction, name:"random"};
	var best = getBestSearchAlgorithm(10, alg2, alg1, depth);
	console.log("best is "+ best[0].name + " (result1: "+
				JSON.stringify(best[1])+", result2:"+
				JSON.stringify(best[2])+")");
}
