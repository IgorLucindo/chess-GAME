import {chess_board_virtual} from "../game/chessBoards.js";

export var white_attacking_map = [[],[],[],[],[],[],[],[]];
export var black_attacking_map = [[],[],[],[],[],[],[],[]];
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
const straight_attacked_squares = function(board, pos, piece_color, i_func, j_func, condition){
    for(let i = 1; condition(i); i++){
        if(chess_board_virtual[i_func(i)][j_func(i)] == null){board[i_func(i)][j_func(i)] = "X";}
        else if((piece_color == "w" && chess_board_virtual[i_func(i)][j_func(i)].substring(0, 3) == "K_b") ||
                (piece_color == "b" && chess_board_virtual[i_func(i)][j_func(i)].substring(0, 3) == "K_w")){
            checking_pieces.push([pos[0], pos[1]]);
            if(checking_pieces.length != 0){add_checked_squares(piece_color, i_func, j_func, condition);}
        }
        else{
            board[i_func(i)][j_func(i)] += "X";
            add_pinned_squares(piece_color, pos, i_func(i), j_func(i), i_func, j_func, condition);
            break;
        }
    };
};

// L attacked squares
const L_attacked_squares = function(board, pos, piece_color, i_func, j_func){
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < 2; j++){
            if(0 <= i_func(i,j) && i_func(i,j) <= 7 && 0 <= j_func(i,j) && j_func(i,j) <= 7){
                if(chess_board_virtual[i_func(i,j)][j_func(i,j)] == null ){board[i_func(i,j)][j_func(i,j)] = "X";}
                else if((piece_color == "w" && chess_board_virtual[i_func(i,j)][j_func(i,j)].substring(0, 3) == "K_b") ||
                        (piece_color == "b" && chess_board_virtual[i_func(i,j)][j_func(i,j)].substring(0, 3) == "K_w")){ 
                    checking_pieces.push([pos[0], pos[1]]);
                }
                else{board[i_func(i,j)][j_func(i,j)] += "X";}
            }
        };
    };
};

// king horizontal, vertical or diagonal attacked squares
const king_straight_attacked_squares = function(board, i_func, j_func, condition){
    if(condition){
        if(chess_board_virtual[i_func][j_func] == null){board[i_func][j_func] = "X";}
        else{board[i_func][j_func] += "X";}
    };
};



// add attacked squares by a piece to a board array
const add_attacked_squares = function(pos, board){
    let piece_color = board[pos[0]][pos[1]][2];
    let piece_type = board[pos[0]][pos[1]][0];

    // rook
    if(piece_type == "R"){
        // up
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1];}, (i)=>{return i < pos[0]+1;});
        // down
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1];}, (i)=>{return i < 8-pos[0];});
        // left
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0];}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1;});
        // right
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0];}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1];});
    }

    // bishop
    if(piece_type == "B"){
        // diagonal 45° left
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < 8-pos[0];});
        // diagonal 45° right
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < pos[0]+1;});
        // diagonal -45° left
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < pos[0]+1;});
        // diagonal -45° right
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < 8-pos[0];});
    }

    // knight
    if(piece_type == "N"){
        // L movement
        L_attacked_squares(board, pos, piece_color, (i,j)=>{return pos[0]-2+4*i;}, (i,j)=>{return pos[1]-1+2*j;});
        L_attacked_squares(board, pos, piece_color, (i,j)=>{return pos[0]-1+2*j;}, (i,j)=>{return pos[1]-2+4*i;});
    }

    //king
    if(piece_type == "K"){
        // up
        king_straight_attacked_squares(board, pos[0]-1, pos[1], pos[0] > 0);
        // down
        king_straight_attacked_squares(board, pos[0]+1, pos[1], 7 > pos[0]);
        // left
        king_straight_attacked_squares(board, pos[0], pos[1]-1, pos[1] > 0);
        // right
        king_straight_attacked_squares(board, pos[0], pos[1]+1, 7 > pos[1]);
        // diagonal 45° left
        king_straight_attacked_squares(board, pos[0]+1, pos[1]-1, pos[0] < 7 && pos[1] > 0);
        // diagonal 45° right
        king_straight_attacked_squares(board, pos[0]-1, pos[1]+1, pos[0] > 0 && pos[1] < 7);
        // diagonal -45° left
        king_straight_attacked_squares(board, pos[0]-1, pos[1]-1, pos[0] > 0 && pos[1] > 0);
        // diagonal -45° right
        king_straight_attacked_squares(board, pos[0]+1, pos[1]+1, pos[0] < 7 && pos[1] < 7);
    }

    //queen
    if(piece_type == "Q"){
        // up
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1];}, (i)=>{return i < pos[0]+1;});
        // down
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1];}, (i)=>{return i < 8-pos[0];});
        // left
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0];}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1;});
        // right
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0];}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1];});
        // diagonal 45° left
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < 8-pos[0];});
        // diagonal 45° right
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < pos[0]+1;});
        // diagonal -45° left
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < pos[0]+1;});
        // diagonal -45° right
        straight_attacked_squares(board, pos, piece_color, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < 8-pos[0];});
    }

    // pawn
    if(piece_type == "P"){
        // white
        if(piece_color == "w" && pos[0] > 0){
            // diagonal
            if(pos[1] < 7){
                if(chess_board_virtual[pos[0]-1][pos[1]+1] == null){board[pos[0]-1][pos[1]+1] = "X";}
                else if(chess_board_virtual[pos[0]-1][pos[1]+1].substring(0, 3) == "K_b"){checking_pieces.push([pos[0], pos[1]]);}
                else{board[pos[0]-1][pos[1]+1] += "X";}
            }
            if(pos[1] > 0){
                if(chess_board_virtual[pos[0]-1][pos[1]-1] == null){board[pos[0]-1][pos[1]-1] = "X";}
                else if(chess_board_virtual[pos[0]-1][pos[1]-1].substring(0, 3) == "K_b"){checking_pieces.push([pos[0], pos[1]]);}
                else{board[pos[0]-1][pos[1]-1] += "X";}
            }
        }
        // black
        if(piece_color == "b" && pos[0] < 7){
            // diagonal
            if(pos[1] < 7){
                if(chess_board_virtual[pos[0]+1][pos[1]+1] == null){board[pos[0]+1][pos[1]+1] = "X";}
                else if(chess_board_virtual[pos[0]+1][pos[1]+1].substring(0, 3) == "K_w"){checking_pieces.push([pos[0], pos[1]]);}
                else{board[pos[0]+1][pos[1]+1] += "X";}
            }
            if(pos[1] > 0){
                if(chess_board_virtual[pos[0]+1][pos[1]-1] == null){board[pos[0]+1][pos[1]-1] = "X";}
                else if(chess_board_virtual[pos[0]+1][pos[1]-1].substring(0, 3) == "K_w"){checking_pieces.push([pos[0], pos[1]]);}
                else{board[pos[0]+1][pos[1]-1] += "X";}
            }
        }
    }
}



// set attacking_map arrays
export const update_attacking_map = function(turn){
    // reset properties
    pinning_piece = null;
    pinned_piece = null;
    checking_pieces = [];
    // reset attacking_map arrays
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            white_attacking_map[i][j] = chess_board_virtual[i][j];
            black_attacking_map[i][j] = chess_board_virtual[i][j];
            check_attacking_map[i][j] = chess_board_virtual[i][j];
            pin_attacking_map[i][j] = chess_board_virtual[i][j];
        };
    };
    // create attacking_map arrays
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(chess_board_virtual[i][j] != null && chess_board_virtual[i][j][2] == "w" && turn.value%2 == 0){
                add_attacked_squares([i, j], white_attacking_map);
            }
            if(chess_board_virtual[i][j] != null && chess_board_virtual[i][j][2] == "b" && (turn.value%2 == 1 || turn.value == 0)){
                add_attacked_squares([i, j], black_attacking_map);
            }
        };
    };
};