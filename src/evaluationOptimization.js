
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
			//printDebugLabel(movesApplied + "/"+200 + " moves applied");
			//console.log(movesApplied + "/"+200 + " moves applied");
			var d = board.turn == WHITE
				? depth1
				: depth2;

			var e = board.turn == WHITE 
				? evaluationFunction1
				: evaluationFunction2;
			
			//var move = getBestMove(board,getBestMoveMinmax,e,d);
			var move = getBestMove(board,getBestMoveAlphaBetaIterativeDeepening,e,d);
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
				var ev1 = evaluationFunction1(board);
				var ev2 = evaluationFunction2(board);
				if (ev1 > 0 && ev2 > 0) {
					whiteWins++;
				} else if (ev1 < 0 && ev2 < 0) {
					whiteLosses++;
				} else {
					draws++;
				}
				break;
			}
			if (board.history.length > 6) {
				if (board.history[board.history.length-1] == board.history[board.history.length-5] &&
					board.history[board.history.length-1] == board.history[board.history.length-9] &&
					board.history[board.history.length-2] == board.history[board.history.length-6] &&
					board.history[board.history.length-2] == board.history[board.history.length-10]) {
					var ev1 = evaluationFunction1(board);
					var ev2 = evaluationFunction2(board);
					if (ev1 > 0 && ev2 > 0) {
						whiteWins++;
					} else if (ev1 < 0 && ev2 < 0) {
						whiteLosses++;
					} else {
						draws++;
					}
					break;
				}
			}
			movesApplied++;
			board.move(move.move);
			redrawBoard(board);
		}
	}
	return {whiteWins:whiteWins, whiteLosses:whiteLosses, draws: draws};
}

function getBest(eval1,eval2,depth){
	var result1 = runGames(1, depth, depth, eval1.func, eval2.func);
	var result2 = runGames(1, depth, depth, eval2.func, eval1.func);

	if (result1.whiteWins > result2.whiteWins){
		return [eval1, result1, result2];
	}
	if (result2.whiteWins > result2.whiteWins) {
		return [eval2, result1, result2];
	}
	
	return [eval2, result1, result2];
}

var STOP = false;
function getBestWithPieceThreatMoveFactors(depth, evalFunc){
	STOP = false;
	var best = undefined;
	for (var i = 0; i <= 9 && !STOP; i+=3) {
		for (var j = 0; j <= 9 && !STOP; j+=3) {
			for (var k = 0; k <= 9 && !STOP; k+=3) {
				var f = {
					func:function(board) { return evalFunc.func(board,i,j,k)},
					name: evalFunc.name+"("+i+","+j+","+k+")"
				};
				
				if (best == undefined) { best = f; }
				console.log("running "+f.name+" vs "+best.name);
				best = getBest(best,f,depth)[0];
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

	var f4 = getBestWithPieceThreatMoveFactors(
		depth,
		{
			func: evaluateWithEstimatedMovesAndAvoidCastling,
			name: "evaluateWithEstimatedMovesAndAvoidCastling"
		});
	console.log("got f4");
	
	var functions = [f1,f2,f3,f4];
	var best = functions[0];
	for (var i = 0; i < functions.length-1; i++) {
		best = getBest(functions[i], best, depth)[0];
	}

	console.log(best.name + " is best");
	return best.func;
}
