import Piece, {PieceStatus} from './piece';
import Board from "../board";
import Player from "../player";
import Square from "../square";
import GameSettings from "../gameSettings";

export default class Pawn extends Piece {
    constructor(player: Player) {
        super(player);
    }

    getAvailableMoves(board: Board) {
        let status = new PieceStatus(board.findPiece(this));
        addPawnMoves(this.player, board, status);
        return status.availableSquares;
    }
}


function addPawnMoves(player: Player, board: Board, status: PieceStatus) {
    if (!pawnAtEndOfBoard(status, player)) {
        const col = status.currentCol;
        const row = status.currentRow;
        const direction = player === Player.WHITE ? 1 : -1;
        forwardMoves(row, col, direction, status, player, board);
        diagonalCaptureMoves(row, col, direction, status, board);
    }
}

function pawnInFirstPosition(status: PieceStatus, player: Player): boolean {
    return status.currentRow === 1 && player === Player.WHITE || status.currentRow === GameSettings.BOARD_SIZE - 2 && player === Player.BLACK;
}

function pawnAtEndOfBoard(status: PieceStatus, player: Player): boolean {
    return status.currentRow === GameSettings.BOARD_SIZE - 1 && player === Player.WHITE || status.currentRow === 0 && player === Player.BLACK;
}

function forwardMoves(row: number, col: number, direction: number, status: PieceStatus, player: Player, board: Board) {
    let possibleChangeInRows = 1;
    let emptyNextRow = board.isEmpty(row + direction, col);
    let emptyNextTwoRows = board.isEmpty(row + 2 * direction, col);
    if (pawnInFirstPosition(status, player) && emptyNextRow && emptyNextTwoRows) {
        possibleChangeInRows = 2;
    }
    if (emptyNextRow) {
        for (let i = 1; i < possibleChangeInRows + 1; i++) {
            status.addSquareToMoveList(row + i * direction, col);
        }
    }
}

function diagonalCaptureMoves(row: number, col: number, direction: number, status: PieceStatus, board: Board) {
    if (col < GameSettings.BOARD_SIZE - 1) {
        if (board.containsFoe(row + direction, col + 1) && !board.containsOpposingKing(row + direction, col + 1)) {
            status.addSquareToMoveList(row + direction, col + 1)
        }
    }
    if (col > 0) {
        if (board.containsFoe(row + direction, col - 1) && !board.containsOpposingKing(row + direction, col - 1)) {
            status.addSquareToMoveList(row + direction, col - 1)
        }
    }
}
