const canvas = document.getElementById("canvas") as HTMLCanvasElement
canvas.width = 300
canvas.height = 300
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

const CANVAS_SIZE = {
    x: 300,
    y: 300
}

enum CellElement {
    Sand,
    Fire,
    Ember,
    Wood,
    Wall,
    Empty
}



type ComputeState = (x: number, y: number, neighbours: CellElement[]) => CellElement

const inbounds = (x: number, y: number) => x < BOARD_SIZE.x && x >= 0 && y < BOARD_SIZE.y && y >= x

const ruleSet: Record<any, ComputeState> = {
    [CellElement.Sand]: (_, __, neighbours) => {
        switch(neighbours[6]) {
            case CellElement.Sand:
                return neighbours[7] == CellElement.Empty || neighbours[5] == CellElement.Empty ? CellElement.Empty : CellElement.Sand
            
            case CellElement.Wood:
            case CellElement.Wall:
                return CellElement.Sand

            case CellElement.Empty:
            case CellElement.Fire:
                return CellElement.Empty    
            default: return CellElement.Sand
        }
    },
    [CellElement.Wall]: () => CellElement.Wall,
    [CellElement.Empty]: (x, y, neighbours) => {
        switch(neighbours[1]) {
            case CellElement.Sand:
                return CellElement.Sand
        }
        let rand = Math.random() > .5
        if (rand) {
            if (neighbours[0] == CellElement.Sand && neighbours[3] == CellElement.Sand) {
                BOARD[x-1][y-1] = CellElement.Empty
                return CellElement.Sand
            }
            if (neighbours[2] == CellElement.Sand && neighbours[4] == CellElement.Sand) {
                BOARD[x+1][y-1] = CellElement.Empty
                return CellElement.Sand
            }
        } else {
            if (neighbours[2] == CellElement.Sand && neighbours[4] == CellElement.Sand) {
                BOARD[x+1][y-1] = CellElement.Empty
                return CellElement.Sand
            }
            if (neighbours[0] == CellElement.Sand && neighbours[3] == CellElement.Sand) {
                BOARD[x-1][y-1] = CellElement.Empty
                return CellElement.Sand
            }
        }
        return CellElement.Empty
    },
    [CellElement.Fire]: () => CellElement.Ember,
    [CellElement.Ember]: (x,y) => {
        const rDir = Math.round(Math.random()*2-1)
        const nx = x+rDir
        const ny = y-1
        if (inbounds(nx, ny) && BOARD[nx][ny] == CellElement.Empty && Math.random() > 0.05) {
            NEXT_BOARD[nx][ny] = CellElement.Ember
        }
        
        return CellElement.Empty
    },
    [CellElement.Wood]: (_, __, neighbours) => {
        if (neighbours.includes(CellElement.Fire) || (neighbours.includes(CellElement.Ember) && Math.random() > .5)) {
            return CellElement.Fire
        }
        return CellElement.Wood
    }
}

const BOARD_SIZE = {
    x: 300,
    y: 300
}

const Colors: Record<CellElement, string> = {
    [CellElement.Sand]: "#e7d86e",
    [CellElement.Wall]: "#888888",
    [CellElement.Empty]: "#202020",
    [CellElement.Fire]: "#ff790c",
    [CellElement.Wood]: "#362601",
    [CellElement.Ember]: "#E94B00"
}

type Board = CellElement[][]

function createBoard(): Board {
    return Array(BOARD_SIZE.x).fill([])
        .map(
            _ => Array(BOARD_SIZE.y).fill(CellElement.Empty)
        )
}

var BOARD: Board = createBoard()
var NEXT_BOARD: Board = createBoard()

const factor = {
    x: CANVAS_SIZE.x / BOARD_SIZE.x,
    y: CANVAS_SIZE.y / BOARD_SIZE.y
}

function collectNeighbours(board: Board, x: number, y: number) : CellElement[] {
    const neighbours: CellElement[] = []
    let index = 0;
    for (let oy = -1; oy <= 1; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
            const ax = x+ox
            const ay = y+oy
            if (ax == x && ay == y) continue;
            if (ax >= BOARD_SIZE.x || ax < 0 || ay >= BOARD_SIZE.y || ay < 0) {
                neighbours[index] = CellElement.Wall
            } else {
                neighbours[index] = board[ax][ay] 
            }
            index++;
        }
    }
    return neighbours
}


function computeNextState() {
    for (let x = 0; x<BOARD_SIZE.x; x++) {
        for (let y = 0; y<BOARD_SIZE.y; y++) {
            const neighbours = collectNeighbours(BOARD, x, y)
            NEXT_BOARD[x][y] = ruleSet[BOARD[x][y]](x,y,neighbours)
        }
    }
    [BOARD, NEXT_BOARD] = [NEXT_BOARD, BOARD]
}

function render() {
    computeNextState()
    for (let x = 0; x<BOARD_SIZE.x; x++) {
        for (let y = 0; y<BOARD_SIZE.y; y++) {
            let cell = BOARD[x][y]
            ctx.fillStyle = Colors[cell]
            ctx.fillRect(x * factor.x, y * factor.y, factor.x, factor.y)
        }
    }
}

for (let x = 0; x < BOARD_SIZE.x; x++) {
    for (let y = 0; y < BOARD_SIZE.y; y++) {
        BOARD[x][y] = Math.random() > .5 ? CellElement.Empty : CellElement.Wood
    }
}

BOARD[Math.floor(BOARD_SIZE.x/2)][Math.floor(BOARD_SIZE.y/2)] = CellElement.Fire

setInterval(render, 100)
