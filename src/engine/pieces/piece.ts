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

    addSquareToMoveList(rowIndex : number, colIndex : number) {
        this.availableSquares.push(Square.at(rowIndex, colIndex));
    }

    returnExistingSquaresFromListOfCoordinates(squareList : number[][], max : number) {
        return squareList.filter(square => square.every(position => position >=0 && position < max));
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
        let x = this.status.currentCol;
        let y = this.status.currentRow;
        let maxAddRow = GameSettings.BOARD_SIZE - y;
        let maxAddCol = GameSettings.BOARD_SIZE - x;
        for (let i = 1; i < Math.max(x, y, maxAddRow, maxAddCol); i++) {
            if (x - i >= 0 && y - i >= 0) {
                this.status.addSquareToMoveList(y - i, x - i);
            }
            if (x + i < GameSettings.BOARD_SIZE && y + i < GameSettings.BOARD_SIZE) {
                this.status.addSquareToMoveList(y + i, x + i);
            }
            if (x + i < GameSettings.BOARD_SIZE && y - i >= 0) {
                this.status.addSquareToMoveList(y - i, x + i);
            }
            if (x - i >= 0 && y + i < GameSettings.BOARD_SIZE) {
                this.status.addSquareToMoveList(y + i, x - i);
            }
        }
    }


    addLateralMoves() {
        for (let i = 0; i < GameSettings.BOARD_SIZE; i++) {
            if (i !== this.status.currentCol) {
                this.status.addSquareToMoveList(this.status.currentRow, i);
            }
            if (i !== this.status.currentRow) {
                this.status.addSquareToMoveList(i, this.status.currentCol);
            }
        }
    }
}