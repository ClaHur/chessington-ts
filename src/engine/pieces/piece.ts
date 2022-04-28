import Board from "../board";
import Square from "../square";
import Player from "../player";
import GameSettings from "../gameSettings";

export default class Piece {
    constructor(public readonly player: Player) {
    }

    getAvailableMoves(board: Board) {
        throw new Error('This method must be implemented, and return a list of available moves');
    }

    moveTo(board: Board, newSquare: Square) {
        const currentSquare = board.findPiece(this);
        board.movePiece(currentSquare, newSquare);
    }
}

export class PieceStatus {
    availableSquares: Square[] = [];
    currentSquare: Square;
    currentRow: number;
    currentCol: number;

    constructor(currentSquare: Square) {
        this.currentSquare = currentSquare;
        this.currentRow = currentSquare.row;
        this.currentCol = currentSquare.col;
    }

    addSquareToMoveList(rowIndex: number, colIndex: number) {
        this.availableSquares.push(Square.at(rowIndex, colIndex));
    }

    returnExistingSquaresFromListOfCoordinates(squareList: number[][], max: number) {
        return squareList.filter(square => square.every(position => position >= 0 && position < max));
    }
}

export class MovementFromList {
    board: Board;
    status: PieceStatus;
    moveList: number[][];

    constructor(board: Board, status: PieceStatus, moveList: number[][]) {
        this.status = status;
        this.board = board;
        this.moveList = moveList
    }

    addMovesFromList() {
        const squares = this.moveList;
        const existingSquares: number[][] = this.status.returnExistingSquaresFromListOfCoordinates(squares, GameSettings.BOARD_SIZE)
        const validSquares = existingSquares.filter(squareCoord => this.validListSpace(squareCoord[1], squareCoord[0], this.board))
        validSquares.forEach(square => this.status.addSquareToMoveList(square[1], square[0]));
    }

    validListSpace(row: number, col: number, board: Board) {
        return !board.containsFriend(row, col) && !board.containsOpposingKing(row, col);
    }
}

export class Movement {
    board: Board;
    status: PieceStatus;

    constructor(board: Board, status: PieceStatus) {
        this.status = status;
        this.board = board;
    }

    addDiagonalMoves() {
        let currentCol = this.status.currentCol;
        let currentRow = this.status.currentRow;
        this.availableMovesNE(currentRow, currentCol);
        this.availableMovesSE(currentRow, currentCol);
        this.availableMovesNW(currentRow, currentCol);
        this.availableMovesSW(currentRow, currentCol);
    }

    addLateralMoves() {
        let currentCol = this.status.currentCol;
        let currentRow = this.status.currentRow;
        this.availableMovesN(currentRow, currentCol);
        this.availableMovesS(currentRow, currentCol);
        this.availableMovesE(currentRow, currentCol);
        this.availableMovesW(currentRow, currentCol);
    }

    //Lateral move checkers
    availableMovesN(currentRow: number, currentCol: number) {
        for (let y = currentRow + 1; y < GameSettings.BOARD_SIZE && this.spaceValid(y, currentCol, "N"); y++) {
            this.status.addSquareToMoveList(y, currentCol);
        }
    }


    availableMovesS(currentRow: number, currentCol: number) {
        for (let y = currentRow - 1; y >= 0 && this.spaceValid(y, currentCol, "S"); y--) {
            this.status.addSquareToMoveList(y, currentCol);
        }
    }

    availableMovesE(currentRow: number, currentCol: number) {
        for (let x = currentCol + 1; x < GameSettings.BOARD_SIZE && this.spaceValid(currentRow, x, "E"); x++) {
            this.status.addSquareToMoveList(currentRow, x);
        }
    }

    availableMovesW(currentRow: number, currentCol: number) {
        for (let x = currentCol - 1; x >= 0 && this.spaceValid(currentRow, x, "W"); x--) {
            this.status.addSquareToMoveList(currentRow, x);
        }
    }


    //Diagonal move checkers
    availableMovesNE(currentRow: number, currentCol: number) {
        for (let row = currentRow + 1, col = currentCol + 1; Math.max(col, row) < GameSettings.BOARD_SIZE && this.spaceValid(row, col, "NE"); row++, col++) {
            this.status.addSquareToMoveList(row, col);
        }
    }

    availableMovesSE(currentRow: number, currentCol: number) {
        for (let row = currentRow - 1, col = currentCol + 1; col < GameSettings.BOARD_SIZE && row >= 0 && this.spaceValid(row, col, "SE"); row--, col++) {
            this.status.addSquareToMoveList(row, col);
        }
    }

    availableMovesSW(currentRow: number, currentCol: number) {
        for (let row = currentRow - 1, col = currentCol - 1; Math.min(col, row) >= 0 && this.spaceValid(row, col, "SW"); row--, col--) {
            this.status.addSquareToMoveList(row, col);
        }
    }

    availableMovesNW(currentRow: number, currentCol: number) {
        for (let row = currentRow + 1, col = currentCol - 1; row < GameSettings.BOARD_SIZE && col >= 0 && this.spaceValid(row, col, "NW"); row++, col--) {
            this.status.addSquareToMoveList(row, col);
        }
    }


    spaceValid(row: number, col: number, direction: string) {
        //todo Direction class to get previous square from direction - use to remove 8 for loops
        let alteredRow = row;
        let alteredCol = col;
        switch (direction) {
            case "N":
                alteredRow = row - 1;
                break;
            case "S":
                alteredRow = row + 1;
                break;
            case "E":
                alteredCol = col - 1;
                break;
            case "W":
                alteredCol = col + 1;
                break;
            case "NE":
                alteredRow = row - 1;
                alteredCol = col - 1;
                break;
            case "SE":
                alteredRow = row + 1;
                alteredCol = col - 1;
                break;
            case "NW":
                alteredRow = row - 1;
                alteredCol = col + 1;
                break;
            case "SW":
                alteredRow = row + 1;
                alteredCol = col + 1;
                break;
        }
        return !this.board.containsFriend(row, col) && !this.board.containsFoe(alteredRow, alteredCol) && !this.board.containsOpposingKing(row, col);
        // Space is valid if current piece is not a friend or if the previous piece was not a foe
    }
}

/*
export class Movement {
    board: Board;
    status: PieceStatus;

    constructor(board: Board, status: PieceStatus) {
        this.status = status;
        this.board = board;
    }

    addDiagonalMoves() {
        let currentCol = this.status.currentCol;
        let currentRow = this.status.currentRow;
        const NE = new Direction("NE", this.board, this.status);
        const NW = new Direction("NW", this.board, this.status);
        const SE = new Direction("SE", this.board, this.status);
        const SW = new Direction("SW", this.board, this.status);
        NE.availableMovesInDirection(currentRow, currentCol)
        NW.availableMovesInDirection(currentRow, currentCol)
        SE.availableMovesInDirection(currentRow, currentCol)
        SW.availableMovesInDirection(currentRow, currentCol)
    }

    addLateralMoves() {
        let currentRow = this.status.currentRow;
        let currentCol = this.status.currentCol;
        const N = new Direction("N", this.board, this.status);
        const S = new Direction("S", this.board, this.status);
        const E = new Direction("E", this.board, this.status);
        const W = new Direction("W", this.board, this.status);
    }
}


export class Direction {
    board: Board;
    status: PieceStatus
    direction: string;
    directionArray: number[] = [];

    constructor(direction: string, board: Board, status: PieceStatus) {
        this.direction = direction;
        this.board = board;
        this.status = status;
        this.assignDirection();
    }

    assignDirection() {
        switch (this.direction) {
            case "N":
                this.directionArray = [1, 0]
                break;
            case "S":
                this.directionArray = [-1, 0]
                break;
            case "E":
                this.directionArray = [0, 1]
                break;
            case "W":
                this.directionArray = [0, -1]
                break;
            case "NE":
                this.directionArray = [1, 1]
                break;
            case "SE":
                this.directionArray = [-1, 1]
                break;
            case "NW":
                this.directionArray = [1, -1]
                break;
            case "SW":
                this.directionArray = [-1, -1]
                break;
        }
    }

    spaceValidInDirection(row: number, col: number) {
        const spaceIsOnBoard = Math.min(row,col) >= 0 && Math.max(row,col) < GameSettings.BOARD_SIZE;
        const spaceDoesntContainFriend = !this.board.containsFriend(row, col);
        const previousSpaceDoesntContainFoe = !this.board.containsFoe(row - this.directionArray[0], col - this.directionArray[1]);
        const spaceDoesntContainOpposingKing = !this.board.containsOpposingKing(row, col)
        return spaceIsOnBoard && spaceDoesntContainFriend && previousSpaceDoesntContainFoe && spaceDoesntContainOpposingKing
    }

    availableMovesInDirection(currentRow: number, currentCol: number) {
        let row = currentRow + this.directionArray[0];
        let col = currentCol + this.directionArray[1];
        while(this.spaceValidInDirection(row, col)) {
            this.status.addSquareToMoveList(row, col);
            row += this.directionArray[0]
            col += this.directionArray[1]
        }
    }
}
 */