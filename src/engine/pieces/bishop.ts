import Piece, {Movement, PieceStatus} from './piece';
import Board from "../board";
import Player from "../player";

export default class Bishop extends Piece {
    constructor(player: Player) {
        super(player);
    }

    getAvailableMoves(board: Board) {
        let status = new PieceStatus(board.findPiece(this));
        let moveGenerator = new Movement(board, status);
        moveGenerator.addDiagonalMoves();
        return status.availableSquares;
    }
}
