
import {chess_board_virtual} from "../game/chessBoards.js";
import {finish_game} from "../game/finishGame.js";
import {white_attacking_map, black_attacking_map, checking_pieces, check_attacking_map,
        white_block_check_map, black_block_check_map, white_king_attacking_map, black_king_attacking_map} from "./chessMaps.js";

export var isCheckmate = {value: null};



// king horizontal, vertical or diagonal movement
const king_straight_possible_move = function(opponent_color, attacked_squares, i_func, j_func, condition){
    if(condition && isCheckmate.value){
        if(chess_board_virtual[i_func][j_func] == null){
            if(attacked_squares[i_func][j_func] == null){
                isCheckmate.value = false;
                return 0;
            }
        }
        else if((opponent_color == "w" && chess_board_virtual[i_func][j_func][2] == "b") ||
                (opponent_color == "b" && chess_board_virtual[i_func][j_func][2] == "w")){
            if(attacked_squares[i_func][j_func].slice(-1) != "X"){
                isCheckmate.value = false;
                return 0;
            }
        }
    }
};



// verify if a checkmate occurred
export const verify_checkmate = function(piece_color, play_history, turn, load_piece, total_time){
    // get opponent color
    let opponent_color = null;
    if(piece_color == "w"){opponent_color = "b";}
    if(piece_color == "b"){opponent_color = "w";}
    // get king position
    let pos = [];
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(chess_board_virtual[i][j] != null && chess_board_virtual[i][j].substring(0, 3) == "K_" + opponent_color){
                pos = [i, j];
                break;
            }
        };
    };
    // detect if king is checkmated
    if(checking_pieces.length != 0){
        // verify if king has anywhere to go
        isCheckmate.value = true;
        let attacked_squares = null;
        let opponent_block_check_squares = null;
        let opponent_attacked_squares = null;
        let opponent_king_attaked_squares = null;
        if(opponent_color == "w"){
            attacked_squares = black_attacking_map;
            opponent_attacked_squares = white_attacking_map;
            opponent_block_check_squares = white_block_check_map;
            opponent_king_attaked_squares = white_king_attacking_map;
        }
        if(opponent_color == "b"){
            attacked_squares = white_attacking_map;
            opponent_attacked_squares = black_attacking_map;
            opponent_block_check_squares = black_block_check_map;
            opponent_king_attaked_squares = black_king_attacking_map;
        }
        // up
        king_straight_possible_move(opponent_color, attacked_squares, pos[0]-1, pos[1], pos[0] > 0);
        // down
        king_straight_possible_move(opponent_color, attacked_squares, pos[0]+1, pos[1], 7 > pos[0]);
        // left
        king_straight_possible_move(opponent_color, attacked_squares, pos[0], pos[1]-1, pos[1] > 0);
        // right
        king_straight_possible_move(opponent_color, attacked_squares, pos[0], pos[1]+1, 7 > pos[1]);
        // diagonal 45° left
        king_straight_possible_move(opponent_color, attacked_squares, pos[0]+1, pos[1]-1, pos[0] < 7 && pos[1] > 0);
        // diagonal 45° right
        king_straight_possible_move(opponent_color, attacked_squares, pos[0]-1, pos[1]+1, pos[0] > 0 && pos[1] < 7);
        // diagonal -45° left
        king_straight_possible_move(opponent_color, attacked_squares, pos[0]-1, pos[1]-1, pos[0] > 0 && pos[1] > 0);
        // diagonal -45° right
        king_straight_possible_move(opponent_color, attacked_squares, pos[0]+1, pos[1]+1, pos[0] < 7 && pos[1] < 7);
        // verify if single checking piece is capturable or piece can get in front of checking piece
        if(checking_pieces.length == 1){
            if((opponent_attacked_squares[checking_pieces[0][0]][checking_pieces[0][1]].slice(-1) == "X" &&
            opponent_king_attaked_squares[checking_pieces[0][0]][checking_pieces[0][1]].slice(-1) != "X") ||
            (opponent_attacked_squares[checking_pieces[0][0]][checking_pieces[0][1]].slice(-2,-1) == "X")){isCheckmate.value = false;}

            if(opponent_king_attaked_squares[checking_pieces[0][0]][checking_pieces[0][1]].slice(-1) == "X" &&
            attacked_squares[checking_pieces[0][0]][checking_pieces[0][1]].slice(-1) != "X"){isCheckmate.value = false;}

            for(let i = 0; i < 8; i++){
                for(let j = 0; j < 8; j++){
                    if(opponent_block_check_squares[i][j] == "X" && check_attacking_map[i][j] == "X"){isCheckmate.value = false;}
                };
            };
        }
    }
    if(isCheckmate.value){finish_game(play_history, turn, load_piece, total_time);}
};