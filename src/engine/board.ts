import Player from './player';
import GameSettings from './gameSettings';
import Square from './square';
import Piece from "./pieces/piece";

export default class Board {
    private readonly board: (Piece | undefined)[][];
    private currentPlayer: Player;

    constructor(currentPlayer?: Player) {
        this.currentPlayer = currentPlayer ? currentPlayer : Player.WHITE;
        this.board = this.createBoard();
    }

    createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board;
    }

    setPiece(square: Square, piece: Piece | undefined) {
        this.board[square.row][square.col] = piece;
    }

    getPiece(square: Square) {
        return this.board[square.row][square.col];
    }

    squareIsEmpty(square: Square) {
        return typeof this.getPiece(square) === "undefined";
    }

    isEmpty(row: number, col: number) {
        return this.squareIsEmpty(Square.at(row, col));
    }

    squareContainsFriend(square: Square) {
        const piece = this.getPiece(square);
        if (!(typeof piece === "undefined")) {
                return piece.player === this.currentPlayer;
            }
        return false;
    }

    containsFriend(row: number, col: number) {
        return this.squareContainsFriend(Square.at(row, col));
    }

    squareContainsFoe(square: Square) {
        const piece = this.getPiece(square);
        if (!(typeof piece === "undefined")) {
            return piece.player !== this.currentPlayer;
        }
        return false;
    }

    containsFoe(row: number, col: number) {
        return this.squareContainsFoe(Square.at(row, col));
    }

    squareContainsOpposingKing(square: Square) {
        const piece = this.getPiece(square);
        if (!(typeof piece === "undefined")) {
            if(piece.constructor.name === "King") {
                return piece.player !== this.currentPlayer;
            }
        }
        return false;
    }

    containsOpposingKing(row: number, col: number) {
        return this.squareContainsOpposingKing(Square.at(row, col));
    }

    findPiece(pieceToFind: Piece) {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] === pieceToFind) {
                    return Square.at(row, col);
                }
            }
        }
        throw new Error('The supplied piece is not on the board');
    }

    movePiece(fromSquare: Square, toSquare: Square) {
        const movingPiece = this.getPiece(fromSquare);
        if (!!movingPiece && movingPiece.player === this.currentPlayer) {
            this.setPiece(toSquare, movingPiece);
            this.setPiece(fromSquare, undefined);
            this.currentPlayer = (this.currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE);
        }
    }
}
