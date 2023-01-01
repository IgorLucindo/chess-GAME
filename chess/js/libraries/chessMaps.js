import {chess_board_virtual} from "../game/chessBoards.js";

export var white_attacking_map = [[],[],[],[],[],[],[],[]];
export var white_block_check_map = [[],[],[],[],[],[],[],[]];
export var white_king_attacking_map = [[],[],[],[],[],[],[],[]];
export var black_attacking_map = [[],[],[],[],[],[],[],[]];
export var black_block_check_map = [[],[],[],[],[],[],[],[]];
export var black_king_attacking_map = [[],[],[],[],[],[],[],[]];
export var check_attacking_map = [[],[],[],[],[],[],[],[]];
export var pin_attacking_map = [[],[],[],[],[],[],[],[]];

export var checking_pieces = [];
export var pinning_piece = null;
export var pinned_piece = null;



// adds checked squares to check_attacking_map when there is a check
const add_checked_squares = function(piece_color, i_func, j_func, condition){
    for(let i = 1; condition(i); i++){
        if(chess_board_virtual[i_func(i)][j_func(i)] == null){check_attacking_map[i_func(i)][j_func(i)] = "X";}
        else if((piece_color == "w" && chess_board_virtual[i_func(i)][j_func(i)].substring(0, 3) == "K_b") ||
        (piece_color == "b" && chess_board_virtual[i_func(i)][j_func(i)].substring(0, 3) == "K_w")){
            break;
        }
    };
};

// adds pinned squares to pin_attacking_map when there is a pin
const add_pinned_squares = function(piece_color, pos, i_0, j_0, i_func, j_func, condition){
    let pinned = false;
    let saw_a_piece = false;
    if((piece_color == "w" && chess_board_virtual[i_0][j_0][2] == "b") ||
       (piece_color == "b" && chess_board_virtual[i_0][j_0][2] == "w")){
        for(let i = i_0+1; condition(i); i++){
            if(chess_board_virtual[i_func(i)][j_func(i)] != null){
                if((piece_color == "w" && chess_board_virtual[i_func(i)][j_func(i)].substring(0, 3) == "K_b") ||
                (piece_color == "b" && chess_board_virtual[i_func(i)][j_func(i)].substring(0, 3) == "K_w")){
                    pinned = true;
                }
                if(saw_a_piece){break;}
                saw_a_piece = true;
            }
        };
    }
    if(pinned){
        for(let i = 1; condition(i); i++){
            if(chess_board_virtual[i_func(i)][j_func(i)] == null){pin_attacking_map[i_func(i)][j_func(i)] = "X";}
        };
        pinning_piece = [pos[0], pos[1]];
        pinned_piece = [i_0, j_0];
    }
};

// horizontal, vertical or diagonal attacked squares
const straight_attacked_squares = function(map, block_check_map, pos, piece_color, i_func, j_func, condition){
    for(let i = 1; condition(i); i++){
        if(chess_board_virtual[i_func(i)][j_func(i)] == null){
            map[i_func(i)][j_func(i)] = "X";
            block_check_map[i_func(i)][j_func(i)] = "X";
        }
        else if((piece_color == "w" && chess_board_virtual[i_func(i)][j_func(i)].substring(0, 3) == "K_b") ||
        (piece_color == "b" && chess_board_virtual[i_func(i)][j_func(i)].substring(0, 3) == "K_w")){
            checking_pieces.push([pos[0], pos[1]]);
            if(checking_pieces.length != 0){add_checked_squares(piece_color, i_func, j_func, condition);}
        }
        else{
            map[i_func(i)][j_func(i)] += "X";
            block_check_map[i_func(i)][j_func(i)] += "X";
            add_pinned_squares(piece_color, pos, i_func(i), j_func(i), i_func, j_func, condition);
            break;
        }
    };
};

// L attacked squares
const L_attacked_squares = function(map, block_check_map, pos, piece_color, i_func, j_func){
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < 2; j++){
            if(0 <= i_func(i,j) && i_func(i,j) <= 7 && 0 <= j_func(i,j) && j_func(i,j) <= 7){
                if(chess_board_virtual[i_func(i,j)][j_func(i,j)] == null ){
                    map[i_func(i,j)][j_func(i,j)] = "X";
                    block_check_map[i_func(i,j)][j_func(i,j)] = "X";
                }
                else if((piece_color == "w" && chess_board_virtual[i_func(i,j)][j_func(i,j)].substring(0, 3) == "K_b") ||
                (piece_color == "b" && chess_board_virtual[i_func(i,j)][j_func(i,j)].substring(0, 3) == "K_w")){ 
                    checking_pieces.push([pos[0], pos[1]]);
                }
                else{
                    map[i_func(i,j)][j_func(i,j)] += "X";
                    block_check_map[i_func(i,j)][j_func(i,j)] += "X";
                }
            }
        };
    };
};

// king horizontal, vertical or diagonal attacked squares
const king_straight_attacked_squares = function(map, king_map, i_func, j_func, condition){
    if(condition){
        if(chess_board_virtual[i_func][j_func] == null){
            map[i_func][j_func] = "X";
            king_map[i_func][j_func] = "X";
        }
        else{
            map[i_func][j_func] += "X";
            king_map[i_func][j_func] += "X";
        }
    };
};

// pawn en passant movement
const pawn_enPassant_attacked_squares = function(map, pos, direction, last_play){
    if(chess_board_virtual[pos[0]][pos[1]+direction] != null && chess_board_virtual[pos[0]][pos[1]+direction][0] == "P" &&
    chess_board_virtual[pos[0]][pos[1]+direction] == last_play[0] && Math.abs(last_play[1][0]-last_play[2][0]) == 2){
        map[pos[0]][pos[1]+direction] += "X";
    }
}



// add attacked squares by a piece to a board array
const add_attacked_squares = function(pos, map, block_check_map, king_map, play_history){
    let piece_color = map[pos[0]][pos[1]][2];
    let piece_type = map[pos[0]][pos[1]][0];

    // rook
    if(piece_type == "R"){
        // up
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1];}, (i)=>{return i < pos[0]+1;});
        // down
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1];}, (i)=>{return i < 8-pos[0];});
        // left
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0];}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1;});
        // right
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0];}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1];});
    }

    // bishop
    if(piece_type == "B"){
        // diagonal 45° left
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < 8-pos[0];});
        // diagonal 45° right
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < pos[0]+1;});
        // diagonal -45° left
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < pos[0]+1;});
        // diagonal -45° right
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < 8-pos[0];});
    }

    // knight
    if(piece_type == "N"){
        // L movement
        L_attacked_squares(map, block_check_map, pos, piece_color, (i,j)=>{return pos[0]-2+4*i;}, (i,j)=>{return pos[1]-1+2*j;});
        L_attacked_squares(map, block_check_map, pos, piece_color, (i,j)=>{return pos[0]-1+2*j;}, (i,j)=>{return pos[1]-2+4*i;});
    }

    //king
    if(piece_type == "K"){
        // up
        king_straight_attacked_squares(map, king_map, pos[0]-1, pos[1], pos[0] > 0);
        // down
        king_straight_attacked_squares(map, king_map, pos[0]+1, pos[1], 7 > pos[0]);
        // left
        king_straight_attacked_squares(map, king_map, pos[0], pos[1]-1, pos[1] > 0);
        // right
        king_straight_attacked_squares(map, king_map, pos[0], pos[1]+1, 7 > pos[1]);
        // diagonal 45° left
        king_straight_attacked_squares(map, king_map, pos[0]+1, pos[1]-1, pos[0] < 7 && pos[1] > 0);
        // diagonal 45° right
        king_straight_attacked_squares(map, king_map, pos[0]-1, pos[1]+1, pos[0] > 0 && pos[1] < 7);
        // diagonal -45° left
        king_straight_attacked_squares(map, king_map, pos[0]-1, pos[1]-1, pos[0] > 0 && pos[1] > 0);
        // diagonal -45° right
        king_straight_attacked_squares(map, king_map, pos[0]+1, pos[1]+1, pos[0] < 7 && pos[1] < 7);
    }

    //queen
    if(piece_type == "Q"){
        // up
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1];}, (i)=>{return i < pos[0]+1;});
        // down
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1];}, (i)=>{return i < 8-pos[0];});
        // left
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0];}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1;});
        // right
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0];}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1];});
        // diagonal 45° left
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < 8-pos[0];});
        // diagonal 45° right
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < pos[0]+1;});
        // diagonal -45° left
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < pos[0]+1;});
        // diagonal -45° right
        straight_attacked_squares(map, block_check_map, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < 8-pos[0];});
    }

    // pawn
    if(piece_type == "P"){
        let last_play =  play_history.slice(-1)[0];
        // white
        if(piece_color == "w" && pos[0] > 0){
            // forward
            if(chess_board_virtual[pos[0]-1][pos[1]] == null){
                block_check_map[pos[0]-1][pos[1]] = "X";
                if(pos[0] == 6 && chess_board_virtual[pos[0]-2][pos[1]] == null){block_check_map[pos[0]-2][pos[1]] = "X";}
            }
            // diagonal
            if(pos[1] < 7){
                if(chess_board_virtual[pos[0]-1][pos[1]+1] == null){map[pos[0]-1][pos[1]+1] = "X";}
                else if(chess_board_virtual[pos[0]-1][pos[1]+1].substring(0, 3) == "K_b"){checking_pieces.push([pos[0], pos[1]]);}
                else{map[pos[0]-1][pos[1]+1] += "X";}
            }
            if(pos[1] > 0){
                if(chess_board_virtual[pos[0]-1][pos[1]-1] == null){map[pos[0]-1][pos[1]-1] = "X";}
                else if(chess_board_virtual[pos[0]-1][pos[1]-1].substring(0, 3) == "K_b"){checking_pieces.push([pos[0], pos[1]]);}
                else{map[pos[0]-1][pos[1]-1] += "X";}
            }
            // en passant right
            pawn_enPassant_attacked_squares(map, pos, 1, last_play);
            // en passant left
            pawn_enPassant_attacked_squares(map, pos, -1, last_play);
        }
        // black
        if(piece_color == "b" && pos[0] < 7){
            // forward
            if(chess_board_virtual[pos[0]+1][pos[1]] == null){
                block_check_map[pos[0]+1][pos[1]] = "X";
                if(pos[0] == 1 && chess_board_virtual[pos[0]+2][pos[1]] == null){block_check_map[pos[0]+2][pos[1]] = "X";}
            }
            // diagonal
            if(pos[1] < 7){
                if(chess_board_virtual[pos[0]+1][pos[1]+1] == null){map[pos[0]+1][pos[1]+1] = "X";}
                else if(chess_board_virtual[pos[0]+1][pos[1]+1].substring(0, 3) == "K_w"){checking_pieces.push([pos[0], pos[1]]);}
                else{map[pos[0]+1][pos[1]+1] += "X";}
            }
            if(pos[1] > 0){
                if(chess_board_virtual[pos[0]+1][pos[1]-1] == null){map[pos[0]+1][pos[1]-1] = "X";}
                else if(chess_board_virtual[pos[0]+1][pos[1]-1].substring(0, 3) == "K_w"){checking_pieces.push([pos[0], pos[1]]);}
                else{map[pos[0]+1][pos[1]-1] += "X";}
            }
            // en passant right
            pawn_enPassant_attacked_squares(map, pos, 1, last_play);
            // en passant left
            pawn_enPassant_attacked_squares(map, pos, -1, last_play);
        }
    }
}



// set attacking_map arrays
export const update_attacking_map = function(play_history){
    // reset properties
    pinning_piece = null;
    pinned_piece = null;
    checking_pieces = [];
    // reset attacking_map arrays
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            white_attacking_map[i][j] = chess_board_virtual[i][j];
            white_block_check_map[i][j] = chess_board_virtual[i][j];
            white_king_attacking_map[i][j] = chess_board_virtual[i][j];
            black_attacking_map[i][j] = chess_board_virtual[i][j];
            black_block_check_map[i][j] = chess_board_virtual[i][j];
            black_king_attacking_map[i][j] = chess_board_virtual[i][j];
            check_attacking_map[i][j] = chess_board_virtual[i][j];
            pin_attacking_map[i][j] = chess_board_virtual[i][j];
        };
    };
    // create attacking_map arrays
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(chess_board_virtual[i][j] != null){
                if(chess_board_virtual[i][j][2] == "w"){
                    add_attacked_squares([i, j], white_attacking_map, white_block_check_map, white_king_attacking_map, play_history);
                }
                if(chess_board_virtual[i][j][2] == "b"){
                    add_attacked_squares([i, j], black_attacking_map, black_block_check_map, black_king_attacking_map, play_history);
                }
            }
        };
    };
};