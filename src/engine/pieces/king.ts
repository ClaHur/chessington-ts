import Piece, {PieceStatus} from './piece';
import Board from "../board";
import Player from "../player";
import GameSettings from "../gameSettings";

export default class King extends Piece {
    constructor(player: Player) {
        super(player);
    }

    getAvailableMoves(board: Board) {
        let status = new PieceStatus(board.findPiece(this));
        addKingMoves(this.player, board, status);
        return status.availableSquares;
    }
}

function addKingMoves(player: Player, board: Board, status: PieceStatus) {
    const x = status.currentCol;
    const y = status.currentRow;
    const squares = [[x+1,y],[x+1,y+1],[x+1,y-1],[x-1,y],[x-1,y+1],[x-1,y-1],[x,y+1],[x,y-1]];
    const validSquares : number[][]= status.returnExistingSquaresFromListOfCoordinates(squares,GameSettings.BOARD_SIZE)
    validSquares.forEach(square => status.addSquareToMoveList(square[1], square[0]));
}