import {chess_board_virtual, chess_board} from "../game/chessBoards.js";
import {checking_pieces, white_attacking_map, black_attacking_map,
        check_attacking_map, pinning_piece, pinned_piece, pin_attacking_map} from "./chessMaps.js";



// create highlighting circle target
const create_one_circle_target = function(i, j){
    let circle_target = document.createElement("div");
    let piece_target_obfuscate = document.createElement("div");

    circle_target.classList.add("circle_target");
    piece_target_obfuscate.classList.add("obfuscate");

    chess_board[i][j].prepend(circle_target);
    chess_board[i][j].appendChild(piece_target_obfuscate);
};

// horizontal, vertical or diagonal movement
const straight_move = function(piece_color, pos, i_func, j_func, condition){
    for(let i = 1; condition(i); i++){
        if(pinned_piece == null ||
        (pos[0] != pinned_piece[0] || pos[1] != pinned_piece[1]) ||
        (pos[0] == pinned_piece[0] && pos[1] == pinned_piece[1] && (pin_attacking_map[i_func(i)][j_func(i)] == "X" ||
        (i_func(i) == pinning_piece[0] && j_func(i) == pinning_piece[1])))){
            if(chess_board_virtual[i_func(i)][j_func(i)] == null){
                if(checking_pieces.length == 0 ||
                   (checking_pieces.length == 1 && check_attacking_map[i_func(i)][j_func(i)] == "X")){
                    chess_board[i_func(i)][j_func(i)].innerHTML = `<div class="circle"></div>`;
                }
            }
            else if((piece_color == "w" && chess_board_virtual[i_func(i)][j_func(i)][2] == "b") ||
            (piece_color == "b" && chess_board_virtual[i_func(i)][j_func(i)][2] == "w")){
                if(checking_pieces.length == 0 ||
                (checking_pieces.length == 1 && i_func(i) == checking_pieces[0][0] && j_func(i) == checking_pieces[0][1])){
                    create_one_circle_target(i_func(i), j_func(i));
                }
                break;
            }
            else{break;}
        }
    };
};

// L movement
const L_move = function(piece_color, pos, i_func, j_func){
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < 2; j++){
            if((pinned_piece == null || (pos[0] != pinned_piece[0] || pos[1] != pinned_piece[1])) &&
            (0 <= i_func(i,j) && i_func(i,j) <= 7 && 0 <= j_func(i,j) && j_func(i,j) <= 7)){
                if(chess_board_virtual[i_func(i,j)][j_func(i,j)] == null){
                    if(checking_pieces.length == 0 ||
                    (checking_pieces.length == 1 && check_attacking_map[i_func(i,j)][j_func(i,j)] == "X")){
                        chess_board[i_func(i,j)][j_func(i,j)].innerHTML = `<div class="circle"></div>`;
                    }
                }
                else if((piece_color == "w" && chess_board_virtual[i_func(i,j)][j_func(i,j)][2] == "b") ||
                (piece_color == "b" && chess_board_virtual[i_func(i,j)][j_func(i,j)][2] == "w")){
                    if(checking_pieces.length == 0 ||
                    (checking_pieces.length == 1 && i_func(i,j) == checking_pieces[0][0] && j_func(i,j) == checking_pieces[0][1])){
                        create_one_circle_target(i_func(i,j), j_func(i,j));
                    }
                }
            }
        };
    };
};

// king horizontal, vertical or diagonal movement
const king_straight_move = function(piece_color, attacked_squares, i_func, j_func, condition){
    if(condition){
        if(chess_board_virtual[i_func][j_func] == null){
            if(attacked_squares[i_func][j_func] == null){
                chess_board[i_func][j_func].innerHTML = `<div class="circle"></div>`;
            }
        }
        else if((piece_color == "w" && chess_board_virtual[i_func][j_func][2] == "b") ||
                (piece_color == "b" && chess_board_virtual[i_func][j_func][2] == "w")){
            if(attacked_squares[i_func][j_func].slice(-1) != "X"){
                create_one_circle_target(i_func, j_func);
            }
        }
    }
};

// pawn forward movement
const pawn_forward_move = function(piece_color, pos){
    let forward = null;
    let start = null;
    if(piece_color == "w"){
        forward = -1;
        start = 6;
    }
    if(piece_color == "b"){
        forward = 1;
        start = 1;
    }
    if(pinned_piece == null ||
    (pos[0] != pinned_piece[0] || pos[1] != pinned_piece[1]) ||
    (pos[0] == pinned_piece[0] && pos[1] == pinned_piece[1] && pin_attacking_map[pos[0]+forward][pos[1]] == "X")){
        if(chess_board_virtual[pos[0]+forward][pos[1]] == null){
            if(checking_pieces.length == 0 ||
            (checking_pieces.length == 1 && check_attacking_map[pos[0]+forward][pos[1]] == "X")){
                chess_board[pos[0]+forward][pos[1]].innerHTML = `<div class="circle"></div>`;
            }
            if((checking_pieces.length == 0 ||
            (checking_pieces.length == 1 && check_attacking_map[pos[0]+forward*2][pos[1]] == "X")) &&
                pos[0] == start && chess_board_virtual[pos[0]+forward*2][pos[1]] == null){
                chess_board[pos[0]+forward*2][pos[1]].innerHTML = `<div class="circle"></div>`;
            }
        }
    }
};

// pawn diagonal movement
const pawn_diagonal_move = function(piece_color, pos, direction){
    let forward = null;
    if(piece_color == "w"){forward = -1;}
    if(piece_color == "b"){forward = 1;}
    if(pinned_piece == null ||
    (pos[0] != pinned_piece[0] || pos[1] != pinned_piece[1]) ||
    (pos[0] == pinned_piece[0] && pos[1] == pinned_piece[1] && (pin_attacking_map[pos[0]+forward][pos[1]+direction] == "X" ||
    (pos[0]+forward == pinning_piece[0] && pos[1]+direction == pinning_piece[1])))){
        if(chess_board_virtual[pos[0]+forward][pos[1]+direction] != null){
            if((piece_color == "w" && chess_board_virtual[pos[0]+forward][pos[1]+direction][2] == "b") ||
            (piece_color == "b" && chess_board_virtual[pos[0]+forward][pos[1]+direction][2] == "w")){
                if(checking_pieces.length == 0 ||
                (checking_pieces.length == 1 && pos[0]+forward == checking_pieces[0][0] && pos[1]+direction == checking_pieces[0][1])){
                    create_one_circle_target(pos[0]+forward, pos[1]+direction);
                }
            }
        }
    }
};

// pawn en passant movement
const pawn_enPassant_move = function(piece_color, pos, direction, last_play){
    let forward = null;
    if(piece_color == "w"){forward = -1;}
    if(piece_color == "b"){forward = 1;}
    if(chess_board_virtual[pos[0]][pos[1]+direction] != null && chess_board_virtual[pos[0]][pos[1]+direction][0] == "P" &&
    chess_board_virtual[pos[0]][pos[1]+direction] == last_play[0] && Math.abs(last_play[1][0]-last_play[2][0]) == 2){
        if(checking_pieces.length == 0 ||
        (checking_pieces.length == 1 && pos[0] == checking_pieces[0][0] && pos[1]+direction == checking_pieces[0][1])){
            create_one_circle_target(pos[0]+forward, pos[1]+direction);
            chess_board[pos[0]+forward][pos[1]+direction].getElementsByClassName("circle_target")[0].setAttribute("enPassant", forward);
        }
    }
}


// create highlighting circle for each piece
export const create_circles = function(pos, play_history){
    let piece_color = chess_board_virtual[pos[0]][pos[1]][2];
    let piece_type = chess_board_virtual[pos[0]][pos[1]][0];

    // rook
    if(piece_type == "R"){
        // up
        straight_move(piece_color, pos, (i)=>{return pos[0]-i;}, (i)=>{return pos[1];}, (i)=>{return i < pos[0]+1;});
        // down
        straight_move(piece_color, pos, (i)=>{return pos[0]+i;}, (i)=>{return pos[1];}, (i)=>{return i < 8-pos[0];});
        // left
        straight_move(piece_color, pos, (i)=>{return pos[0];}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1;});
        // right
        straight_move(piece_color, pos, (i)=>{return pos[0];}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1];});
    }

    // bishop
    if(piece_type == "B"){
        // diagonal 45° left
        straight_move(piece_color, pos, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < 8-pos[0];});
        // diagonal 45° right
        straight_move(piece_color, pos, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < pos[0]+1;});
        // diagonal -45° left
        straight_move(piece_color, pos, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < pos[0]+1;});
        // diagonal -45° right
        straight_move(piece_color, pos, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < 8-pos[0];});
    }

    // knight
    if(piece_type == "N"){
        // L movement
        L_move(piece_color, pos, (i,j)=>{return pos[0]-2+4*i;}, (i,j)=>{return pos[1]-1+2*j;});
        L_move(piece_color, pos, (i,j)=>{return pos[0]-1+2*j;}, (i,j)=>{return pos[1]-2+4*i;});
    }

    //king
    if(piece_type == "K"){
        let attacked_squares = null;
        if(piece_color == "w"){attacked_squares = black_attacking_map}
        if(piece_color == "b"){attacked_squares = white_attacking_map}
        // up
        king_straight_move(piece_color, attacked_squares, pos[0]-1, pos[1], pos[0] > 0);
        // down
        king_straight_move(piece_color, attacked_squares, pos[0]+1, pos[1], 7 > pos[0]);
        // left
        king_straight_move(piece_color, attacked_squares, pos[0], pos[1]-1, pos[1] > 0);
        // right
        king_straight_move(piece_color, attacked_squares, pos[0], pos[1]+1, 7 > pos[1]);
        // diagonal 45° left
        king_straight_move(piece_color, attacked_squares, pos[0]+1, pos[1]-1, pos[0] < 7 && pos[1] > 0);
        // diagonal 45° right
        king_straight_move(piece_color, attacked_squares, pos[0]-1, pos[1]+1, pos[0] > 0 && pos[1] < 7);
        // diagonal -45° left
        king_straight_move(piece_color, attacked_squares, pos[0]-1, pos[1]-1, pos[0] > 0 && pos[1] > 0);
        // diagonal -45° right
        king_straight_move(piece_color, attacked_squares, pos[0]+1, pos[1]+1, pos[0] < 7 && pos[1] < 7);
        // castle
        if(chess_board[pos[0]][pos[1]].getElementsByClassName("overlay")[0].getAttribute("castle") == null){
            // king side right
            let castle = true;
            for(let i = 1; i < 3; i++){
                if(piece_color == "w" && black_attacking_map[pos[0]][pos[1]+i] != null){castle = false;}
                if(piece_color == "b" && white_attacking_map[pos[0]][pos[1]+i] != null){castle = false;}
            };
            if(piece_color == "w" && black_attacking_map[pos[0]][pos[1]+3] != null &&
               black_attacking_map[pos[0]][pos[1]+3].slice(-1) == "X"){castle = false;}
            if(piece_color == "b" && white_attacking_map[pos[0]][pos[1]+3] != null &&
               white_attacking_map[pos[0]][pos[1]+3].slice(-1) == "X"){castle = false;}

            if(castle && chess_board_virtual[pos[0]][7] != null && chess_board_virtual[pos[0]][7][0] == "R" &&
               chess_board[pos[0]][7].getElementsByClassName("overlay")[0].getAttribute("castle") == null){
                chess_board[pos[0]][pos[1]+2].innerHTML = `<div class="circle"></div>`;
                chess_board[pos[0]][pos[1]+2].getElementsByClassName("circle")[0].setAttribute("castle", "-1");
            }
            // queen side left
            castle = true;
            for(let i = 1; i < 4; i++){
                if(piece_color == "w" && black_attacking_map[pos[0]][pos[1]-i] != null){castle = false;}
                if(piece_color == "b" && white_attacking_map[pos[0]][pos[1]-i] != null){castle = false;}
            };
            if(piece_color == "w" && black_attacking_map[pos[0]][pos[1]-4] != null &&
               black_attacking_map[pos[0]][pos[1]-4].slice(-1) == "X"){castle = false;}
            if(piece_color == "b" && white_attacking_map[pos[0]][pos[1]-4] != null &&
               white_attacking_map[pos[0]][pos[1]-4].slice(-1) == "X"){castle = false;}

            if(castle && chess_board_virtual[pos[0]][0] != null && chess_board_virtual[pos[0]][0][0] == "R" &&
               chess_board[pos[0]][0].getElementsByClassName("overlay")[0].getAttribute("castle") == null){
                chess_board[pos[0]][pos[1]-2].innerHTML = `<div class="circle"></div>`;
                chess_board[pos[0]][pos[1]-2].getElementsByClassName("circle")[0].setAttribute("castle", "+1");
            }
        }
    }

    //queen
    if(piece_type == "Q"){
        // up
        straight_move(piece_color, pos, (i)=>{return pos[0]-i;}, (i)=>{return pos[1];}, (i)=>{return i < pos[0]+1;});
        // down
        straight_move(piece_color, pos, (i)=>{return pos[0]+i;}, (i)=>{return pos[1];}, (i)=>{return i < 8-pos[0];});
        // left
        straight_move(piece_color, pos, (i)=>{return pos[0];}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1;});
        // right
        straight_move(piece_color, pos, (i)=>{return pos[0];}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1];});
        // diagonal 45° left
        straight_move(piece_color, pos, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < 8-pos[0];});
        // diagonal 45° right
        straight_move(piece_color, pos, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < pos[0]+1;});
        // diagonal -45° left
        straight_move(piece_color, pos, (i)=>{return pos[0]-i;}, (i)=>{return pos[1]-i;}, (i)=>{return i < pos[1]+1 && i < pos[0]+1;});
        // diagonal -45° right
        straight_move(piece_color, pos, (i)=>{return pos[0]+i;}, (i)=>{return pos[1]+i;}, (i)=>{return i < 8-pos[1] && i < 8-pos[0];});
    }

    // pawn
    if(piece_type == "P"){
        let last_play =  play_history.slice(-1)[0];
        // forward
        pawn_forward_move(piece_color, pos);
        // diagonal right
        pawn_diagonal_move(piece_color, pos, 1);
        // diagonal left
        pawn_diagonal_move(piece_color, pos, -1);
        // en passant right
        pawn_enPassant_move(piece_color, pos, 1, last_play);
        // en passant left
        pawn_enPassant_move(piece_color, pos, -1, last_play);
    }
};