import Piece, {PieceStatus} from './piece';
import Board from "../board";
import Player from "../player";
import GameSettings from "../gameSettings";
import Square from "../square";

export default class Knight extends Piece {
    constructor(player: Player) {
        super(player);
    }

    getAvailableMoves(board: Board) {
        let status = new PieceStatus(board.findPiece(this));
        addKnightMoves(board, status)
        return status.availableSquares;
    }
}

function addKnightMoves(board : Board, status : PieceStatus) {
    const x = status.currentCol;
    const y = status.currentRow;
    const max = GameSettings.BOARD_SIZE;
    const squares = [[x+1,y+2],[x+1,y-2],[x-1,y+2],[x-1,y-2],[x+2,y+1],[x+2,y-1],[x-2,y+1],[x-2,y-1]];
    const validSquares : number[][]= status.returnExistingSquaresFromListOfCoordinates(squares,GameSettings.BOARD_SIZE);
    validSquares.forEach(square => status.addSquareToMoveList(square[1], square[0]));
}