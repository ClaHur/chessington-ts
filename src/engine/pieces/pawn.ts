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
        const direction = player === Player.WHITE ? 1 : -1;
        let possibleChangeInRows = 1;
        let emptyNextRow = board.isEmpty(status.currentRow + 1 * direction, status.currentCol);
        let emptyNextTwoRows = board.isEmpty(status.currentRow + 2 * direction, status.currentCol);
        if (pawnInFirstPosition(status, player) && emptyNextRow && emptyNextTwoRows) {
            possibleChangeInRows = 2;
        }
        if (emptyNextRow) {
            for (let i = 1; i < possibleChangeInRows + 1; i++) {
                let rowIndex = status.currentRow + i * direction;
                let colIndex = status.currentCol;
                if (board.squareIsEmpty(Square.at(status.currentRow + 1, colIndex))) {
                    status.addSquareToMoveList(status.currentRow + i * direction, status.currentCol);
                }
            }
        }
    }
}

function pawnInFirstPosition(status: PieceStatus, player: Player) : boolean {
    return status.currentRow === 1 && player === Player.WHITE || status.currentRow === GameSettings.BOARD_SIZE - 2 && player === Player.BLACK;
}

function pawnAtEndOfBoard(status: PieceStatus, player: Player) : boolean {
    return status.currentRow === GameSettings.BOARD_SIZE - 1 && player === Player.WHITE || status.currentRow === 0 && player === Player.BLACK;
}

