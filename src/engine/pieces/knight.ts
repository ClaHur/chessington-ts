import Piece, {MovementFromList, PieceStatus} from './piece';
import Board from "../board";
import Player from "../player";

export default class Knight extends Piece {
    constructor(player: Player) {
        super(player);
    }

    getAvailableMoves(board: Board) {
        let status = new PieceStatus(board.findPiece(this));
        const col = status.currentCol;
        const row = status.currentRow;
        const possibleMoveList = [[col+1,row+2],[col+1,row-2],[col-1,row+2],[col-1,row-2],[col+2,row+1],[col+2,row-1],[col-2,row+1],[col-2,row-1]];
        let moveGenerator = new MovementFromList(board, status, possibleMoveList);
        moveGenerator.addMovesFromList();
        return status.availableSquares;
    }
}