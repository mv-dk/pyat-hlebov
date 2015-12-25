var board;

(function () {
	var oldonload = window.onload;
	window.onload = function(){
		if (oldonload != undefined) { oldonload(); }
		board = new Board();
		board.redrawCallback = function() { redrawBoard(board); };
		board.setUpInitialPosition();
		createBoard(board, document.getElementById("boardArea"));
		printDebug("score: "+board.evaluate());
	}
}
)();

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

function applyBestMove(){
	var m = getBestMove(board);
	board.move(m);
}

function undo() {
    board.undo();
}

function reevaluate() {
    var n = board.evaluate();
    printDebug("score: "+n);
}

function clearMarkedSquares(){
	var marked = document.getElementsByClassName("marked");
	while (marked.length > 0) {
		marked[0].classList.remove("marked");
	}
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

			if (!board.validateMove(fileFrom,rankFrom,fileTo,rankTo)) { return; }
			
			var whitePromotion = rankTo == 7 && board.pieceAt(fileFrom,rankFrom) == (WHITE|PAWN);
			var blackPromotion = rankTo == 0 && board.pieceAt(fileFrom,rankFrom) == PAWN;
			if (whitePromotion || blackPromotion) {
				var isWhite = WHITE == getColor(board.pieceAt(fileFrom,rankFrom));
				choosePromotionPiece(isWhite, function (promotionPiece) {
					board.move(fileFrom, rankFrom, fileTo, rankTo, promotionPiece);
				});
			} else {
				board.move(fileFrom, rankFrom, fileTo, rankTo, promotionPiece);
			}
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
