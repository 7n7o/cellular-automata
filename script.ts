const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

const CANVAS_SIZE = {
    x: 300,
    y: 300
}

enum CellElement {
    Sand,
    Wall,
    Empty
}

type ComputeState = (neighbours: CellElement[]) => CellElement

const ruleSet: Record<CellElement, ComputeState> = {
    [CellElement.Sand]: (neighbours) => {
        switch(neighbours[6]) {
            case CellElement.Wall:
                return CellElement.Sand
            case CellElement.Empty:
                return CellElement.Empty
            case CellElement.Sand:
                return CellElement.Sand
        }
    },
    [CellElement.Wall]: () => CellElement.Wall,
    [CellElement.Empty]: (neighbours) => {
        switch(neighbours[1]) {
            case CellElement.Sand:
                return CellElement.Sand
        }
        return CellElement.Empty
    }
}

const BOARD_SIZE = {
    x: 30,
    y: 30
}

const Colors: Record<CellElement, string> = {
    [CellElement.Sand]: "#e7d86e",
    [CellElement.Wall]: "#888888",
    [CellElement.Empty]: "#202020"
}

type Board = CellElement[][]

const BOARD: Board = Array(BOARD_SIZE.x).fill([]).map(_ => Array(BOARD_SIZE.y).fill(CellElement.Empty))

const factor = {
    x: CANVAS_SIZE.x / BOARD_SIZE.x,
    y: CANVAS_SIZE.y / BOARD_SIZE.y
}

for (let x = 0; x<BOARD_SIZE.x; x++) {
    for (let y = 0; y<BOARD_SIZE.y; y++) {
        let cell = BOARD[x][y]
        ctx.fillStyle = Colors[cell]
        ctx.fillRect(x * factor.x, y * factor.y, factor.x, factor.y)
    }
}