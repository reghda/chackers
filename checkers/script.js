function createBoard() {
    var board = document.getElementById("board");

    for (var y = 0; y < 8; y++) {
        var row = document.createElement("div");
        row.className = "row";
        board.appendChild(row);

        for (var x = 0; x < 8; x++) {
            var square = document.createElement("div");
            square.id = x.toFixed() + y.toString();
            if ((x + y) % 2) {
                square.className = "bblack";
            }
            else {
                square.className = "bwhite";
            }

            if ((x + y) % 2 != 0 && y != 3 && y != 4) {

                var img = document.createElement("img");
                if (y < 3) {
                    img.id = "w" + square.id;
                    img.src = "whitePiece.png";
                }
                else {
                    img.id = "b" + square.id;
                    img.src = "blackPiece.png";
                }
                img.className = "piece";
                img.setAttribute("draggable", "true");
                square.appendChild(img);
            }

            square.setAttribute("draggable", "false");
            row.appendChild(square);
        }
    }
}

function allowDrop() {

    var squares = document.querySelectorAll('.bblack');
    var i = 0;
    while (i < squares.length) {

        var s = squares[i++];
        s.addEventListener('dragover', dragOver, false);
        s.addEventListener('drop', drop, false);
        s.addEventListener('dragenter', dragEnter, false);
        s.addEventListener('dragleave', dragLeave, false);
    }
    i = 0;
    var pieces = document.querySelectorAll('img');
    while (i < pieces.length) {
        var p = pieces[i++];
        p.addEventListener('dragstart', dragStart, false);
        p.addEventListener('dragend', dragEnd, false);
    }
}

function dragOver(e) {

    e.preventDefault();
    var dragID = e.dataTransfer.getData("text");
    var dragPiece = document.getElementById(dragID);
    if (dragPiece) {
        if (e.target.tagName === "DIV" &&
            isValidMove(dragPiece, e.target, false)) {
            e.dataTransfer.dropEffect = "move";
        }
        else {
            e.dataTransfer.dropEffect = "none";
        }
    }
}
function dragStart(e) {

    if (e.target.draggable) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text", e.target.id);
        e.target.classList.add("selected");
        var dragIcon = document.createElement("img");
        dragIcon.src = "Images/smiley.jpg";
        e.dataTransfer.setDragImage(dragIcon, 0, 0);
    }
}
function dragEnd(e) {
    e.target.classList.remove("selected");
}

function dragEnter(e) {
    
    var dragID = e.dataTransfer.getData("text");
    var dragPiece = document.getElementById(dragID);
    if (dragPiece &&
        e.target.tagName === "DIV" &&
        isValidMove(dragPiece, e.target, false)) {
        e.target.classList.add('drop');
    }
}

function dragLeave(e) {
    e.target.classList.remove("drop");
}

function drop(e) {

    e.stopPropagation();
    e.preventDefault();
    var droppedID = e.dataTransfer.getData("text");
    var droppedPiece = document.getElementById(droppedID);
    if (droppedPiece &&
        e.target.tagName === "DIV" &&
        isValidMove(droppedPiece, e.target, true)) {

        var newPiece = document.createElement("img");
        newPiece.src = droppedPiece.src;
        newPiece.id = droppedPiece.id.substr(0, 1) + e.target.id;
        newPiece.draggable = droppedPiece.draggable;
        if (droppedPiece.draggable) {

            newPiece.classList.add("jumpOnly");
        }
        newPiece.classList.add("piece");
        newPiece.addEventListener("dragstart", dragStart, false);
        newPiece.addEventListener("dragend", dragEnd, false);
        e.target.appendChild(newPiece);
        droppedPiece.parentNode.removeChild(droppedPiece);
    }
    kingMe(newPiece);
}


function isValidMove(source, target, drop) {

    var startPos = source.id.substr(1, 2);
    var prefix = source.id.substr(0, 1);
    var endPos = target.id;

    if (endPos.length > 2) {
        endPos = endPos.substr(1, 2);
    }

    if (startPos === endPos) {
        return false;
    }

    if (target.childElementCount != 0) {
        return false;
    }

    var jumpOnly = false;
    if (source.classList.contains("jumpOnly")) {
        jumpOnly = true;
    }

    var xStart = parseInt(startPos.substr(0, 1));
    var yStart = parseInt(startPos.substr(1, 1));
    var xEnd = parseInt(endPos.substr(0, 1));
    var yEnd = parseInt(endPos.substr(1, 1));

    switch (prefix) {
        case "w":
            if (yEnd <= yStart)
                return false;
            break;
        case "b":
            if (yEnd >= yStart)
                return false;
            break;
    }
    if (yStart === yEnd || xStart === xEnd)
        return false;
    if (Math.abs(yEnd - yStart) > 2 || Math.abs(xEnd - xStart) > 2)
        return false;

    if (Math.abs(xEnd - xStart) === 1 && jumpOnly)
        return false;
    var jumped = false;
    if (Math.abs(xEnd - xStart) === 2) {
        var pos = ((xStart + xEnd) / 2).toString() +
            ((yStart + yEnd) / 2).toString();
        var div = document.getElementById(pos);
        if (div.childElementCount === 0)
            return false;
        var img = div.children[0];
        if (img.id.substr(0, 1).toLowerCase() === prefix.toLowerCase())
            return false;
        if (drop) {
            div.removeChild(img);
            jumped = true;
        }
    }
    if (drop) {
        enableNextPlayer(source);
        if (jumped) {
            source.draggable = true;
            source.classList.add("jumpOnly");
        }
    }
    return true;
}

function kingMe(piece) {

    if (piece.id.substr(0, 1) === "W" || piece.id.substr(0, 1) === "B")
        return;
    var newPiece;
    if (piece.id.substr(0, 1) === "w" && piece.id.substr(2, 1) === "7") {
        newPiece = document.createElement("img");
        newPiece.src = "WhiteKing.png";
        newPiece.id = "W" + piece.id.substr(1, 2);
    }

    if (piece.id.substr(0, 1) === "b" && piece.id.substr(2, 1) === "0") {
        var newPiece = document.createElement("img");
        newPiece.src = "BlackKing.png";
        newPiece.id = "B" + piece.id.substr(1, 2);
    }

    if (newPiece) {
        newPiece.draggable = true;
        newPiece.classList.add("piece");
        newPiece.addEventListener('dragstart', dragStart, false);
        newPiece.addEventListener('dragend', dragEnd, false);
        var parent = piece.parentNode;
        parent.removeChild(piece);
        parent.appendChild(newPiece);
    }
}

function enableNextPlayer(piece) {

    var pieces = document.querySelectorAll('img');
    var i = 0;
    while (i < pieces.length) {
        var p = pieces[i++];

        if (p.id.substr(0, 1).toUpperCase() ===
            piece.id.substr(0, 1).toUpperCase()) {
            p.draggable = false;
        }
        else {
            p.draggable = true;
        }
        p.classList.remove("jumpOnly");
    }
}

createBoard();
allowDrop();
