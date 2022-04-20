const board = document.getElementById("table");
var freq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var array = [];
var matrix = [];
let fillValue = 0;

function generateArray() {
    if (array.length == 9) {
        return false;
    } else {
        let randomNumber = Math.floor(Math.random() * 9) + 1;
        if (freq[randomNumber] == 0) {
            array.push(randomNumber);
            freq[randomNumber] = 1;
        }
        generateArray();
    }
}

function generateBoard() {
    generateArray();
    for (let line = 0; line < 9; ++line) {
        var row = board.insertRow(line);
        for (let column = 0; column < 10; ++column) {
            var cell = row.insertCell(column);
            if (column == 9) {
                cell.style.backgroundColor = "#2ba4a9";
                board.rows[line].cells[column].textContent = line + 1;
                cell.onclick =
                    function() {
                        changeValue(line, column);
                    }
            }
            cell.width = 75;
            cell.height = 75;
            if (column != 9) {
                cell.style.backgroundColor = "#7B68EE";
            }
            cell.style.borderWidth = "2px";
            cell.style.fontSize = "xx-large";
            if (column != 9) {
                cell.onclick =
                    function() {
                        game(line, column);
                    }
            }
            board.rows[line].cells[column].addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
                if (board.rows[line].cells[column].textContent !== "" && board.rows[line].cells[column].getAttribute("empty") === "true") {
                    board.rows[line].cells[column].textContent = "";
                    if (board.rows[line].cells[column].getAttribute("isWrong1") === "true" || board.rows[line].cells[column].getAttribute("isWrong2") == "true" ||
                        board.rows[line].cells[column].getAttribute("isWrong3") === "true") {
                        fading(line, column);
                    }
                }
                return false;
            }, false);
            if (column == 2 || column == 5 && column != 9) {
                cell.style.borderRight = "thick solid black";
            }
            if ((line == 2 || line == 5) && column != 9) {
                cell.style.borderBottom = "thick solid black";
            }
        }
    }
    generateMatrixGame();
}

function fading(line, column) {
    let cell = board.rows[line].cells[column];
    if (cell.getAttribute("isWrong1") === "true") {
        for (let cnt = 0; cnt < 9; ++cnt) {
            board.rows[line].cells[cnt].style.backgroundColor = "#7B68EE";
        }
        cell.style.backgroundColor = "#7B68EE";
    } else if (cell.getAttribute("isWrong2") === "true") {
        for (let cnt = 0; cnt < 9; ++cnt) {
            board.rows[cnt].cells[column].style.backgroundColor = "#7B68EE";
        }
        board.rows[line].cells[column].style.backgroundColor = "#7B68EE";
    } else if (cell.getAttribute("isWrong3") === "true") {
        for (let cnt = 0; cnt < 9; ++cnt) {
            board.rows[line].cells[cnt].style.backgroundColor = "#7B68EE";
            board.rows[cnt].cells[column].style.backgroundColor = "#7B68EE";
        }
        board.rows[line].cells[column].style.backgroundColor = "#7B68EE";
    }
}

function changeValue(line, column) {
    fillValue = board.rows[line].cells[column].textContent;
    console.log(fillValue);
}

function generateMatrixGame() {
    for (let cnt = 0; cnt < 9; ++cnt) {
        matrix[cnt] = [];
    }
    for (let cnt = 0; cnt < 9; ++cnt) {
        matrix[0][cnt] = array[cnt];
    }
    for (let line = 1; line < 9; ++line) {
        if (line == 3 || line == 6) {
            makePermutWith1Position();
        } else {
            makePermutWith3Position();
        }
        for (let column = 0; column < 9; ++column) {
            matrix[line][column] = array[column];
        }
    }
    fill();
}

function makePermutWith3Position() {
    for (let cnt = 0; cnt < 3; ++cnt) {
        let retainValue = array[0];
        for (let position = 1; position < 9; ++position) {
            array[position - 1] = array[position];
        }
        array[8] = retainValue;
    }
}

function makePermutWith1Position() {
    let retainValue = array[0];
    for (let position = 1; position < 9; ++position) {
        array[position - 1] = array[position];
    }
    array[8] = retainValue;
}

function deletPositionValue() {
    let randomLine = Math.floor(Math.random() * 9);
    let randomColumn = Math.floor(Math.random() * 9);
    if (board.rows[randomLine].cells[randomColumn].textContent !== "") {
        board.rows[randomLine].cells[randomColumn].textContent = "";
        board.rows[randomLine].cells[randomColumn].setAttribute("empty", "true");
    } else {
        deletPositionValue();
    }
}

function fill() {
    for (let line = 0; line < 9; ++line) {
        for (let column = 0; column < 9; ++column) {
            board.rows[line].cells[column].textContent = matrix[line][column];
        }
    }
    for (let cnt = 0; cnt < 40; ++cnt) {
        deletPositionValue();
    }
}

function game(line, column) {
    if (fillValue != 0) {
        if (board.rows[line].cells[column].textContent == "") {
            board.rows[line].cells[column].textContent = fillValue;
            checkIfIsCorect(line, column);
            chackWin();
        } else {
            alert("TRY OTHER FILD");
        }
    } else if (fillValue == 0) {
        alert("SET VALUE");
    }
}

function checkIfIsCorect(line, column) {
    let lineIsCorect = 1;
    let columnIsCorect = 1;
    for (let cnt = 0; cnt < 9; ++cnt) {
        if (board.rows[cnt].cells[column].textContent == fillValue && cnt != line) {
            columnIsCorect = 0;
        }
        if (board.rows[line].cells[cnt].textContent == fillValue && cnt != column) {
            lineIsCorect = 0;
        }
    }
    if (lineIsCorect == 0 && columnIsCorect == 1) {
        colorTheWrongFields(line, column, 1);
    } else if (lineIsCorect == 1 && columnIsCorect == 0) {
        colorTheWrongFields(line, column, 2);
    } else if (lineIsCorect == 0 && columnIsCorect == 0) {
        colorTheWrongFields(line, column, 3);
    }

}

function colorTheWrongFields(line, column, cases) {
    if (cases == 1) {
        board.rows[line].cells[column].setAttribute("isWrong" + cases, "true");
        for (let cnt = 0; cnt < 9; ++cnt) {
            board.rows[line].cells[cnt].style.backgroundColor = "red";
        }
    } else if (cases == 2) {
        board.rows[line].cells[column].setAttribute("isWrong" + cases, "true");
        for (let cnt = 0; cnt < 9; ++cnt) {
            board.rows[cnt].cells[column].style.backgroundColor = "red";
        }
    } else if (cases == 3) {
        board.rows[line].cells[column].setAttribute("isWrong" + cases, "true");
        for (let cnt = 0; cnt < 9; ++cnt) {
            board.rows[cnt].cells[column].style.backgroundColor = "red";
            board.rows[line].cells[cnt].style.backgroundColor = "red";
        }
    }
}

function chackWin() {
    var check = 1;
    for (let line = 0; line < 9; ++line) {
        for (let column = 0; column < 9; ++column) {
            if (board.rows[line].cells[column].textContent != matrix[line][column]) {
                check = 0;
            }
        }
    }
    console.log(check);
    if (check == 1) {
        document.getElementById("winFild").textContent = "YOU WIN";
        return false;
    }
}

function showSolution() {
    for (let line = 0; line < 9; ++line) {
        for (let column = 0; column < 9; ++column) {
            if (board.rows[line].cells[column].textContent === "") {
                board.rows[line].cells[column].textContent = matrix[line][column];
                board.rows[line].cells[column].style.color = "red";
            }
        }
    }
}
