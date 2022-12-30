import {chess_board_virtual, chess_board} from "./chessBoards.js";

export var number_of_pieces = [0,0,0,0,0,0,0,0,0,0,0,0];
export var pieces = null;

// set piece for a piece_template
export const set_piece_template = function(i, j, class_name, id_substr, flipped = false){
    let n = null;
    if(id_substr == "R_w"){n = 0;}
    if(id_substr == "R_b"){n = 1;}
    if(id_substr == "N_w"){n = 2;}
    if(id_substr == "N_b"){n = 3;}
    if(id_substr == "B_w"){n = 4;}
    if(id_substr == "B_b"){n = 5;}
    if(id_substr == "K_w"){n = 6;}
    if(id_substr == "K_b"){n = 7;}
    if(id_substr == "Q_w"){n = 8;}
    if(id_substr == "Q_b"){n = 9;}
    if(id_substr == "P_w"){n = 10;}
    if(id_substr == "P_b"){n = 11;}
    number_of_pieces[n]++;

    let piece_template = chess_board[i][j].getElementsByTagName("button")[0];
    piece_template.setAttribute("class", class_name);
    if(flipped){chess_board[i][j].firstChild.style.transform = "rotate(-180deg)";}

    let id_str = id_substr + number_of_pieces[n].toString();
    piece_template.setAttribute("id", id_str);
    chess_board_virtual[i][j] = id_str;
};

// spawn chess pieces
export const spawn_pieces = function(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(chess_board_virtual[i][j] != null){
                chess_board[i][j].innerHTML = `<div class="overlay" active="false"><button name="piece"></button></div>`;
                // spawning rooks
                if(chess_board_virtual[i][j] == "R_w"){set_piece_template(i, j, "rook_white", "R_w");}
                if(chess_board_virtual[i][j] == "R_b"){set_piece_template(i, j, "rook_black", "R_b");}
                // spawning knights
                if(chess_board_virtual[i][j] == "N_w"){set_piece_template(i, j, "knight_white", "N_w");}
                if(chess_board_virtual[i][j] == "N_b"){set_piece_template(i, j, "knight_black", "N_b");}
                // spawning bishops
                if(chess_board_virtual[i][j] == "B_w"){set_piece_template(i, j, "bishop_white", "B_w");}
                if(chess_board_virtual[i][j] == "B_b"){set_piece_template(i, j, "bishop_black", "B_b");}
                // spawning kings
                if(chess_board_virtual[i][j] == "K_w"){set_piece_template(i, j, "king_white", "K_w");}
                if(chess_board_virtual[i][j] == "K_b"){set_piece_template(i, j, "king_black", "K_b");}
                // spawning queens
                if(chess_board_virtual[i][j] == "Q_w"){set_piece_template(i, j, "queen_white", "Q_w");}
                if(chess_board_virtual[i][j] == "Q_b"){set_piece_template(i, j, "queen_black", "Q_b");}
                // spawning pawns
                if(chess_board_virtual[i][j] == "P_w"){set_piece_template(i, j, "pawn_white", "P_w");}
                if(chess_board_virtual[i][j] == "P_b"){set_piece_template(i, j, "pawn_black", "P_b");}
            }
        };
    };
    pieces = document.getElementsByName("piece");
}