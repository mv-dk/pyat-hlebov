
function runGames(numGames, depth1, depth2, evaluationFunction1, evaluationFunction2) {
	var whiteWins = 0, draws = 0, whiteLosses = 0;
	var f = function() {};
	for (var i = 0; i < numGames; i++) {
		var board = new Board();
		board.setUpInitialPosition();
		//board.redrawCallback = function(){redrawBoard(board)};
		board.redrawCallback = f;
		
		var movesApplied = 0;
		while (movesApplied <= 200) {
			var d = board.turn == WHITE
				? depth1
				: depth2;

			var e = board.turn == WHITE 
				? evaluationFunction1
				: evaluationFunction2;
			
			var move = getBestMove(board,getBestMoveMinmax,e,d);
			if (move.move == undefined) {
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
			movesApplied++;
			board.move(move);
		}
	}
	return {whiteWins:whiteWins, whiteLosses:whiteLosses, draws: draws};
}

function getBest(eval1,eval2,depth){
	var result1 = runGames(1, depth, depth, eval1.func, eval2.func);
	var result2 = runGames(1, depth, depth, eval2.func, eval1.func);

	if (result1.whiteWins > result2.whiteWins){
		return eval1;
	}
	if (result2.whiteWins > result2.whiteWins) {
		return eval2;
	}
	return eval1;
}

var STOP = false;
function getBestWithPieceThreatMoveFactors(depth, evalFunc){
	STOP = false;
	var best = undefined;
	for (var i = 5; i <= 5 && !STOP; i++) {
		for (var j = 5; j <= 5 && !STOP; j++) {
			for (var k = 5; k <= 5 && !STOP; k++) {
				var f = {
					func:function(board) { return evalFunc.func(board,i,j,k)},
					name: evalFunc.name+"("+i+","+j+","+k+")"
				};
				
				if (best == undefined) { best = f; }
				
				best = getBest(best,f,depth);
			}
		}
	}
	return best;
}

function getBestEvaluationFunction(depth){
	console.log("starting...");
	var f1 = getBestWithPieceThreatMoveFactors(
		depth, 
		{
			func: evaluateWithCenterValuation,
			name: "evaluateWithCenterValuation"
		});
	console.log("got f1");
	
	var f2 = getBestWithPieceThreatMoveFactors(
		depth,
		{
			func: evaluateWithEstimatedMoves,
			name: "evaluateWithEstimatedMoves"
		});
	console.log("got f2");
	
	var f3 = 
		{
			func: function(board){ return evaluateWithRealMoves(board)},
			name: "evaluateWithRealMoves"
		};
	console.log("got f3");
	
	var functions = [f1,f2,f3];
	var best;
	for (var i = 0; i < functions.length-1; i++) {
		if (functions[i].name == "draw" || functions[i+1].name == "draw") continue;
		best = getBest(functions[i], functions[i+1], depth);
	}

	console.log(best.name + " is best");
	return best.func;
}
