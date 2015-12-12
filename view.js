var board;

window.onload = function(){
    board = new Board();
    board.redrawCallback = function() { redrawBoard(board); };
    board.setUpInitialPosition();
    createBoard(board, document.getElementById("boardArea"));
    printDebug("score: "+board.evaluate());
};

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
                    var isWhiteSquare = Number.parseInt(file+""+rank,9)%2 == 0;
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
                var piece = b.pieceAt(f,r)
                    d.innerHTML = pieceToString(piece);
            }
        }
    }
}

function undo() {
    board.undo();
}

function reevaluate() {
    var n = board.evaluate();
    printDebug("score: "+n);
}

function addClickListenerToSquare(square){
    square.onclick = function() {
        if (square.classList.contains("selected")) {
            square.classList.remove("selected");
            return;
        }
        var selectedOne = document.getElementsByClassName("selected")[0];

        if (selectedOne != undefined) {
            selectedOne.classList.remove("selected");

            board.move(
                    selectedOne.attributes["file"],
                    selectedOne.attributes["rank"],
                    square.attributes["file"],
                    square.attributes["rank"]);
        } else {
            square.classList.add("selected");
        }
    };
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
