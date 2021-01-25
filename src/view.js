
var board;

DEPTH = 3;

var autoMoveFunction = undefined;

(function () {
	var oldonload = window.onload;
	window.onload = function(){
		if (oldonload != undefined) { oldonload(); }
		board = new Board();
		board.redrawCallback = function() { redrawBoard(board); };
		board.setUpInitialPosition();
		createBoard(board, document.getElementById("boardArea"));
		printDebug("score: "+evaluate(board));

		gebi("autoMoveCheckbox").onchange = function(){
			if (this.checked)
				autoMoveFunction = applyBestMove;
		};
	}
}
)();

function printDebugLabel(str){
	document.getElementById("debugLabel").innerHTML = str;
}

function printDebug(str) {
    document.getElementById("debugArea").innerHTML += str + "<br />";
}

function clearBoard(b) { 
    var file = 0, rank = 0;
    for (file; file < 8; file++){
        for (rank; rank < 8; rank++){
            b.setPiece(file,rank, EMPTY);
        }
    }
}

function createBoard(board, boardAreaDiv) {
    var sz = 64;
    var b = 0;
    var bb = b+b;
    var be = boardAreaDiv;
    for (var rank = 7; rank >= -1; rank--){
        var div = document.createElement("div");
        div.style.width = 8*(sz) + sz/3;
        for (var file = -1; file < 8; file++) {
            var span = document.createElement("span");
            span.className = "square";
            span.style.textAlign = "center";
            span.style.cssFloat = "left";
            if (rank >= 0) {
                span.style.height = (sz-bb)+"px";
                span.style.lineHeight = (sz-bb)+"px";
                if (file >= 0) {
                    var piece = board.pieceAt(file,rank);
                    var isWhiteSquare = Number.parseInt(file+""+rank,9)%2 == 1;
                    var bgColor = isWhiteSquare ? "white" : "#cacaca";
                    span.classList.add(file+""+rank);
                    span.classList.add(isWhiteSquare ? "white" : "black");
                    span.innerHTML = pieceToString(piece);
                    span.style.fontSize = (sz*2/3)+"px";
                    span.style.border = b+"px black solid";
                    span.style.width = (sz-bb)+"px";
                    span.id = file + "" + rank;
                    span.attributes["file"]=file;
                    span.attributes["rank"]=rank;
                    addClickListenerToSquare(span);
                } else {
                    span.style.width = (sz/3) + "px";
                    span.innerHTML = 1+rank;
                }
            } else {
                if (file >= 0) {
                    span.style.width = (sz)+"px";
                    span.style.borderLeft = span.style.borderRight = b;
                    span.innerHTML = String.fromCharCode(65+file);
                } else {
                    span.style.width = sz/3 + "px";
                    span.innerHTML = "&nbsp;";
                }
            }
            div.appendChild(span);
            be.appendChild(div);
        }
    }
}

function redrawBoard(b) {
    for (var f = 0; f <= 7; f++) {
        for (var r = 0; r <= 7; r++){
            var d = document.getElementById(f+""+r);
            if (d != null) {
                var piece = b.pieceAt(f,r);
                d.innerHTML = pieceToString(piece);
            }
        }
    }
}

function profile(func) {
	var d0 = new Date();
	var res = func();
	var d = new Date() - d0;
	printDebug("time: "+ d + " ms");
	return res;
}

function blackEvalChange(e){
	evalChange(e, BLACK);
}

function whiteEvalChange(e){
	evalChange(e, WHITE);
}

function evalChange(e, color){
	var evaluationFactors = e.attributes["data-evaluationFactors"];
	var elements = [];
	if (evaluationFactors != undefined) {
		elements = evaluationFactors.value.split(",");
	}
	var options = document.getElementsByClassName((color == WHITE ? "white" : "black") +"EvalOption");
	for (var i = 0; i < options.length; i++) {
		options[i].disabled = elements.indexOf(options[i].id) == -1;
	}
}

function getEvaluationForCurrentPlayer(board) {
	if (board.turn == WHITE) {
		return getChosenWhiteEvaluationFunction();
	} else {
		return getChosenBlackEvaluationFunction();
	}
}

function getChosenWhiteEvaluationFunction(){
	var pieceValFac = Number(gebi("white_pieceValueFactor").value);
	var threatValFac = Number(gebi("white_threatValueFactor").value);
	var moveValFac = Number(gebi("white_moveValueFactor").value);
	var functions = getEvaluationFunctions(pieceValFac, threatValFac, moveValFac);
	var checkedEvaluation = getChosenRadioButtonValue("white_eval");
	return functions[checkedEvaluation];
}

function getChosenBlackEvaluationFunction(){
	var pieceValFac = gebi("black_pieceValueFactor").value;
	var threatValFac = gebi("black_threatValueFactor").value;
	var moveValFac = gebi("black_moveValueFactor").value;
	var functions = getEvaluationFunctions(pieceValFac, threatValFac, moveValFac);
	var checkedEvaluation = getChosenRadioButtonValue("black_eval");
	return functions[checkedEvaluation];
}

function getChosenRadioButtonValue(name){
	var elements = document.getElementsByName(name);
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].checked) {
			return elements[i].value;
		}
	}
	return undefined;
}

var AIVSAI_IDLE = 0;
var AIVSAI_RUNNING = 1;
var aiVsAiState = AIVSAI_IDLE;
function aiVsAi(){
	var button = document.getElementById("aiVsAiButton");
	if (aiVsAiState == AIVSAI_IDLE){
		button.value = "stop";
		aiVsAiState = AIVSAI_RUNNING;

		var whiteEvaluationFunc = getChosenWhiteEvaluationFunction();
		var blackEvaluationFunc = getChosenBlackEvaluationFunction();
		
		var runFunc = function () {
			if (aiVsAiState == AIVSAI_RUNNING) {
				var f = board.turn == WHITE
					? whiteEvaluationFunc
					: blackEvaluationFunc;
				var bestMove = getBestMove(
					board,
					getBestMoveAlphaBetaIterativeDeepening,
					f,
					DEPTH);
				if (bestMove.move != undefined) {
					board.move(bestMove.move);
					updateMarkings(bestMove.move);

					var scoreAccordingToWhite = whiteEvaluationFunc(board);
					var scoreAccordingToBlack = blackEvaluationFunc(board);
					replot(scoreAccordingToWhite, scoreAccordingToBlack);
				} else {
					if (board.isKingThreatened(WHITE)) {
						alert("white is check mate");
					} else if (board.isKingThreatened(BLACK)) {
						alert("black is check mate");
					} else {
						alert("stalemate");
					}
					aiVsAi(); // stop -- the same as pressing the button again
				}
			}
		};
		setTimeout(function () {
			runFunc();
			setTimeout(arguments.callee, 10);
		}, 10);
	} else {
		button.value = "ai vs ai";
		aiVsAiState = AIVSAI_IDLE;
	}
}

//////////////////// plot ///////////////////////
///// move this to separate file some time //////

var whiteEvaluations = [0];
var blackEvaluations = [0];

function addEvaluationToPlot(color){
	var c = document.getElementById("evaluationPlot");
	
	var ctx = c.getContext("2d");
	ctx.moveTo(0,0);
	ctx.lineTo(200,100);
	ctx.stroke();
}

function replot(scoreAccordingToWhite, scoreAccordingToBlack) {
	whiteEvaluations.push(scoreAccordingToWhite);
	blackEvaluations.push(scoreAccordingToBlack);
	var c = document.getElementById("evaluationPlot");
	var ctx = c.getContext("2d");
	var cw = c.width;
	var ch = c.height;
	ctx.clearRect(0,0,cw,ch);
	var numPoints = Math.max(whiteEvaluations.length, blackEvaluations.length);
	var maxScore = Math.max(arrayMax(whiteEvaluations), arrayMax(blackEvaluations));
	var minScore = Math.min(arrayMin(whiteEvaluations), arrayMin(blackEvaluations));
	var heightSpan = (maxScore - minScore);

/*
___
3
2
1
0 
-1
----
*/
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.fillStyle = "#cacaca";
	ctx.rect(0,0, cw, ch);
	ctx.fill();	
	ctx.stroke();


	// draw the x axis
	ctx.beginPath();
	ctx.lineWidth = 1;
	var yAxis = Math.floor(c.height * maxScore / heightSpan) + 0.5;
	ctx.moveTo(0, yAxis);
	ctx.lineTo(c.width, yAxis);
	ctx.stroke();

	// draw the white player's evaluations
	ctx.beginPath();
	ctx.moveTo(0, yAxis);
	ctx.strokeStyle = "white";
	for (var i = 0; i < numPoints; i++) {
		ctx.lineTo((c.width/numPoints) * i,
				   yAxis - Math.floor(whiteEvaluations[i] * ch / heightSpan));
		ctx.stroke();
	}

	// draw the black player's evaluations
	ctx.beginPath();
	ctx.moveTo(0, yAxis);
	ctx.strokeStyle = "black";
	for (var i = 0; i < numPoints; i++) {
		ctx.lineTo((c.width/numPoints) * i,
				   yAxis - Math.floor(blackEvaluations[i] * ch / heightSpan));
		ctx.stroke();
	}
}

function arrayMax(arr) {
	var m = undefined;
	for (var i = 0; i < arr.length; i++) {
		if (m == undefined || m < arr[i]) {
			m = arr[i];
		}
	}
	return m;
}

function arrayMin(arr){
	var m = undefined;
	for (var i = 0; i < arr.length; i++) {
		if (m == undefined || m > arr[i]) {
			m = arr[i];
		}
	}
	return m;
}

replot(0,0);

//////////////// end of plot ////////////////////
/////////////////////////////////////////////////

function applyBestMove(){
	var body = document.body;
	var oldBgColor = body.style.backgroundColor;
	body.style.backgroundColor = "#ccccff";

	setTimeout(function () {
		var m = profile(function () {
			//return getBestMove(board, getBestMoveAlphaBetaIterativeDeepening, evaluateWithCenterValuationAndAvoidCastling, DEPTH);
			return getBestMove(board, getBestMoveAlphaBetaIterativeDeepening, getEvaluationForCurrentPlayer(board), DEPTH);
			//return getBestMove(board, getBestMoveAlphaBetaIterativeDeepening, evaluateWithCenterValuation, DEPTH);
		});
		//var m = getBestMove(board, alphaBetaIterativeDeepening, evaluate, DEPTH);
		if (m.move == undefined) { 
			if (board.isKingThreatened(WHITE)) {
				alert("white is check mate");
			} else if (board.isKingThreatened(BLACK)) {
				alert("black is check mate");
			} else {
				alert("stalemate");
			}
		}
		else {
			board.move(m.move);
			updateMarkings(m.move);
		}
		body.style.backgroundColor = oldBgColor;
		printDebug("nodes evaluated: "+DEBUG_nodesEvaluated);
		printDebug("used transposition table: "+DEBUG_usedTranspositionTable+" times");
		//printDebug("nodes cut off: "+DEBUG_cutoffs);
		//printDebug("getMovesAt called: "+DEBUG_getMovesAtCalled);
	}, 10);
}

function undo() {
    board.undo();
	updateMarkings(board.history[board.history.length-1]);
}

function changeDepth(clickedElement) {
	var d = prompt()|0;
	DEPTH = d;
	clickedElement.value = "Depth: "+DEPTH;
}

function reevaluate() {
    var n = evaluate(board);
    printDebug("score: "+n);
}

function clearMarkedSquares(marking){
	marking = marking || "marked";
	var marked = document.getElementsByClassName(marking);
	while (marked.length > 0) {
		marked[0].classList.remove(marking);
	}
}

function updateMarkings(move) {
	clearMarkedSquares("moved");
	markSquareForMove(getFileFrom(move), getRankFrom(move));
	markSquareForMove(getFileTo(move), getRankTo(move));
}

function markSquareForMove(file,rank){
	document.getElementById(file+""+rank).classList.toggle("moved");
}

function addClickListenerToSquare(square){
    square.onclick = function() {
        if (square.classList.contains("selected")) {
            square.classList.remove("selected");
			clearMarkedSquares();
            return;
        }
        var selectedOne = document.getElementsByClassName("selected")[0];

        if (selectedOne != undefined) {
			clearMarkedSquares();			
            selectedOne.classList.remove("selected");

			var fileFrom = selectedOne.attributes["file"];
			var rankFrom = selectedOne.attributes["rank"];
			var fileTo = square.attributes["file"];
			var rankTo = square.attributes["rank"];
			var promotionPiece = 0;
			
			var whitePromotion = rankTo == 7 && board.pieceAt(fileFrom,rankFrom) == (WHITE|PAWN);
			var blackPromotion = rankTo == 0 && board.pieceAt(fileFrom,rankFrom) == PAWN;
			if (whitePromotion || blackPromotion) {
				var isWhite = WHITE == getColor(board.pieceAt(fileFrom,rankFrom));
				choosePromotionPiece(isWhite, function (promotionPiece) {
					if (!board.validateMove(fileFrom,rankFrom,fileTo,rankTo, promotionPiece)) { return; }
					board.move(fileFrom, rankFrom, fileTo, rankTo, promotionPiece);
					if (autoMoveFunction != undefined) {
						autoMoveFunction();
					}
				});
			} else {
				if (!board.validateMove(fileFrom,rankFrom,fileTo,rankTo, promotionPiece)) { return; }
				board.move(fileFrom, rankFrom, fileTo, rankTo, promotionPiece);
				if (autoMoveFunction != undefined) {
					autoMoveFunction();
				}
			}
			updateMarkings(createMove(fileFrom,rankFrom,fileTo,rankTo));
        } else {
            square.classList.add("selected");
			var file = square.attributes["file"];
			var rank = square.attributes["rank"];
			var moves = board.getMovesAt(file,rank);
			for (var i = 0; i < moves.length; i++) {
				var moveFile = getFileTo(moves[i]);
				var moveRank = getRankTo(moves[i]);
				document.getElementById(moveFile + "" + moveRank).classList.add("marked");
			}
        }
    };
}

function choosePromotionPiece(isWhite, callback) {
	var promotionBox = document.createElement("div");
	var boardArea = document.getElementById("boardArea");
	var sz = 64;
	promotionBox.id = "promotionBox";
	promotionBox.style.width = sz * 4;
	promotionBox.style.height = sz;
	promotionBox.style.border = "7px black double";
	promotionBox.style.float = "left";
	
	function getPieceButton(piece) {
		var p = document.createElement("span");
		p.style.width = p.style.height = sz;
		p.style.cssFloat = "left";
		p.style.textAlign = "center";
		p.style.fontSize = sz*2/3+"px";
		p.style.lineHeight = sz + "px";
		p.innerHTML = pieceToString(piece);
		p.onclick = function() {
			boardArea.removeChild(promotionBox);
			callback(piece);
		};
		return p;
	}

	var p1 = getPieceButton(isWhite ? WHITE|KNIGHT : KNIGHT);
	var p2 = getPieceButton(isWhite ? WHITE|ROOK : ROOK);
	var p3 = getPieceButton(isWhite ? WHITE|BISHOP : BISHOP);
	var p4 = getPieceButton(isWhite ? WHITE|QUEEN : QUEEN);

	promotionBox.appendChild(p1);
	promotionBox.appendChild(p2);
	promotionBox.appendChild(p3);
	promotionBox.appendChild(p4);

	
	boardArea.appendChild(promotionBox);
}

function pieceToString(piece) {
    if (piece == 0) return "";/*
                                 var str = isWhite(piece) ? "W" : "B";
                                 var p = piece & 7;
                                 if (p == PAWN) str += "P";
                                 else if (p == ROOK) str += "R";
                                 else if (p == KNIGHT) str += "N";
                                 else if (p == BISHOP) str += "B";
                                 else if (p == QUEEN) str += "Q";
                                 else if (p == KING) str += "K";
                                 else str += "?";
                                 return str;*/

    var a = "&#98";
    var b = ";";
    if (isWhite(piece)) 
        return a + (26-piece) + b;
    return a + (24-piece) + b;
}

function gebi(x) {
	return document.getElementById(x);
}

