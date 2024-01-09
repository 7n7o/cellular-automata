"use strict";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const CANVAS_SIZE = {
    x: 300,
    y: 300
};
var CellElement;
(function (CellElement) {
    CellElement[CellElement["Sand"] = 0] = "Sand";
    CellElement[CellElement["Wall"] = 1] = "Wall";
    CellElement[CellElement["Empty"] = 2] = "Empty";
})(CellElement || (CellElement = {}));
const ruleSet = {
    [CellElement.Sand]: (_, __, neighbours) => {
        switch (neighbours[6]) {
            case CellElement.Wall:
                return CellElement.Sand;
            case CellElement.Empty:
                return CellElement.Empty;
            case CellElement.Sand:
                return neighbours[7] == CellElement.Empty || neighbours[5] == CellElement.Empty ? CellElement.Empty : CellElement.Sand;
        }
    },
    [CellElement.Wall]: () => CellElement.Wall,
    [CellElement.Empty]: (x, y, neighbours) => {
        switch (neighbours[1]) {
            case CellElement.Sand:
                return CellElement.Sand;
        }
        let rand = Math.random() > .5;
        if (rand) {
            if (neighbours[0] == CellElement.Sand && neighbours[3] == CellElement.Sand) {
                BOARD[x - 1][y - 1] = CellElement.Empty;
                return CellElement.Sand;
            }
            if (neighbours[2] == CellElement.Sand && neighbours[4] == CellElement.Sand) {
                BOARD[x + 1][y - 1] = CellElement.Empty;
                return CellElement.Sand;
            }
        }
        else {
            if (neighbours[2] == CellElement.Sand && neighbours[4] == CellElement.Sand) {
                BOARD[x + 1][y - 1] = CellElement.Empty;
                return CellElement.Sand;
            }
            if (neighbours[0] == CellElement.Sand && neighbours[3] == CellElement.Sand) {
                BOARD[x - 1][y - 1] = CellElement.Empty;
                return CellElement.Sand;
            }
        }
        return CellElement.Empty;
    }
};
const BOARD_SIZE = {
    x: 30,
    y: 30
};
const Colors = {
    [CellElement.Sand]: "#e7d86e",
    [CellElement.Wall]: "#888888",
    [CellElement.Empty]: "#202020"
};
function createBoard() {
    return Array(BOARD_SIZE.x).fill([])
        .map(_ => Array(BOARD_SIZE.y).fill(CellElement.Empty));
}
var BOARD = createBoard();
const factor = {
    x: CANVAS_SIZE.x / BOARD_SIZE.x,
    y: CANVAS_SIZE.y / BOARD_SIZE.y / 2
};
function collectNeighbours(board, x, y) {
    const neighbours = [];
    let index = 0;
    for (let oy = -1; oy <= 1; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
            const ax = x + ox;
            const ay = y + oy;
            if (ax == x && ay == y)
                continue;
            if (ax >= BOARD_SIZE.x || ax < 0 || ay >= BOARD_SIZE.y || ay < 0) {
                neighbours[index] = CellElement.Wall;
            }
            else {
                neighbours[index] = board[ax][ay];
            }
            index++;
        }
    }
    return neighbours;
}
function computeNextState(board) {
    const nextBoard = createBoard();
    for (let x = 0; x < BOARD_SIZE.x; x++) {
        for (let y = 0; y < BOARD_SIZE.y; y++) {
            const neighbours = collectNeighbours(board, x, y);
            nextBoard[x][y] = ruleSet[board[x][y]](x, y, neighbours);
        }
    }
    return nextBoard;
}
function render() {
    BOARD = computeNextState(BOARD);
    for (let x = 0; x < BOARD_SIZE.x; x++) {
        for (let y = 0; y < BOARD_SIZE.y; y++) {
            let cell = BOARD[x][y];
            ctx.fillStyle = Colors[cell];
            ctx.fillRect(x * factor.x, y * factor.y, factor.x, factor.y);
        }
    }
}
setInterval(() => {
    BOARD[Math.round(BOARD_SIZE.x / 2)][0] = CellElement.Sand;
}, 200);
setInterval(render, 100);
