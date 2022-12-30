const eated_white_queens_div = document.getElementById("eated_white_queens");
const eated_white_rooks_div = document.getElementById("eated_white_rooks");
const eated_white_bishops_div = document.getElementById("eated_white_bishops");
const eated_white_knights_div = document.getElementById("eated_white_knights");
const eated_white_pawns_div = document.getElementById("eated_white_pawns");
const eated_black_queens_div = document.getElementById("eated_black_queens");
const eated_black_rooks_div = document.getElementById("eated_black_rooks");
const eated_black_bishops_div = document.getElementById("eated_black_bishops");
const eated_black_knights_div = document.getElementById("eated_black_knights");
const eated_black_pawns_div = document.getElementById("eated_black_pawns");
var number_of_eated_pieces = [0,0,0,0,0,0,0,0,0,0];



// update eated pieces container in profile
export const update_eated_pieces_container = function(id_str){
    // selecting piece class
    let class_name = null;
    let id_substr = id_str.substring(0, 3);
    if(id_substr == "R_w"){class_name = "rook_white";}
    if(id_substr == "R_b"){class_name = "rook_black";}
    if(id_substr == "N_w"){class_name = "knight_white";}
    if(id_substr == "N_b"){class_name = "knight_black";}
    if(id_substr == "B_w"){class_name = "bishop_white";}
    if(id_substr == "B_b"){class_name = "bishop_black";}
    if(id_substr == "Q_w"){class_name = "queen_white";}
    if(id_substr == "Q_b"){class_name = "queen_black";}
    if(id_substr == "P_w"){class_name = "pawn_white";}
    if(id_substr == "P_b"){class_name = "pawn_black";}
    // create piece
    let eated_piece = document.createElement("div");
    eated_piece.setAttribute("class", class_name);
    eated_piece.classList.add("eated_piece");
    if(id_str[2] == "w"){
        if(id_str[0] == "R"){
            eated_piece.style.transform = "translateX(" + number_of_eated_pieces[0]*7 + "px)";
            eated_white_rooks_div.appendChild(eated_piece);
            eated_white_rooks_div.style.marginRight = "20px";
            eated_white_rooks_div.style.width =  number_of_eated_pieces[0]*7 + "px";
            number_of_eated_pieces[0]++
        }
        if(id_str[0] == "N"){
            eated_piece.style.transform = "translateX(" + number_of_eated_pieces[2]*7 + "px)";
            eated_white_knights_div.appendChild(eated_piece);
            eated_white_knights_div.style.marginRight = "20px";
            eated_white_knights_div.style.width =  number_of_eated_pieces[2]*7 + "px";
            number_of_eated_pieces[2]++
        }
        if(id_str[0] == "B"){
            eated_piece.style.transform = "translateX(" + number_of_eated_pieces[4]*7 + "px)";
            eated_white_bishops_div.appendChild(eated_piece);
            eated_white_bishops_div.style.marginRight = "20px";
            eated_white_bishops_div.style.width =  number_of_eated_pieces[4]*7 + "px";
            number_of_eated_pieces[4]++
        }
        if(id_str[0] == "Q"){
            eated_piece.style.transform = "translateX(" + number_of_eated_pieces[6]*7 + "px)";
            eated_white_queens_div.appendChild(eated_piece);
            eated_white_queens_div.style.marginRight = "20px";
            eated_white_queens_div.style.width =  number_of_eated_pieces[6]*7 + "px";
            number_of_eated_pieces[6]++
        }
        if(id_str[0] == "P"){
            eated_piece.style.transform = "translateX(" + number_of_eated_pieces[8]*7 + "px)";
            eated_white_pawns_div.appendChild(eated_piece);
            eated_white_pawns_div.style.marginRight = "20px";
            eated_white_pawns_div.style.width =  number_of_eated_pieces[8]*7 + "px";
            number_of_eated_pieces[8]++
        }
    }
    if(id_str[2] == "b"){
        if(id_str[0] == "R"){
            eated_piece.style.transform = "translateX(" + number_of_eated_pieces[1]*7 + "px)";
            eated_black_rooks_div.appendChild(eated_piece);
            eated_black_rooks_div.style.marginRight = "20px";
            eated_black_rooks_div.style.width =  number_of_eated_pieces[1]*7 + "px";
            number_of_eated_pieces[1]++
        }
        if(id_str[0] == "N"){
            eated_piece.style.transform = "translateX(" + number_of_eated_pieces[3]*7 + "px)";
            eated_black_knights_div.appendChild(eated_piece);
            eated_black_knights_div.style.marginRight = "20px";
            eated_black_knights_div.style.width =  number_of_eated_pieces[3]*7 + "px";
            number_of_eated_pieces[3]++
        }
        if(id_str[0] == "B"){
            eated_piece.style.transform = "translateX(" + number_of_eated_pieces[5]*7 + "px)";
            eated_black_bishops_div.appendChild(eated_piece);
            eated_black_bishops_div.style.marginRight = "20px";
            eated_black_bishops_div.style.width =  number_of_eated_pieces[5]*7 + "px";
            number_of_eated_pieces[5]++
        }
        if(id_str[0] == "Q"){
            eated_piece.style.transform = "translateX(" + number_of_eated_pieces[7]*7 + "px)";
            eated_black_queens_div.appendChild(eated_piece);
            eated_black_queens_div.style.marginRight = "20px";
            eated_black_queens_div.style.width =  number_of_eated_pieces[7]*7 + "px";
            number_of_eated_pieces[7]++
        }
        if(id_str[0] == "P"){
            eated_piece.style.transform = "translateX(" + number_of_eated_pieces[9]*7 + "px)";
            eated_black_pawns_div.appendChild(eated_piece);
            eated_black_pawns_div.style.marginRight = "20px";
            eated_black_pawns_div.style.width =  number_of_eated_pieces[9]*7 + "px";
            number_of_eated_pieces[9]++
        }
    }
};



// clear eated pieces container in profile
export const clear_eated_pieces_container = function(){
    eated_white_queens_div.innerHTML = null;
    eated_white_rooks_div.innerHTML = null;
    eated_white_bishops_div.innerHTML = null;
    eated_white_knights_div.innerHTML = null;
    eated_white_pawns_div.innerHTML = null;
    eated_black_queens_div.innerHTML = null;
    eated_black_rooks_div.innerHTML = null;
    eated_black_bishops_div.innerHTML = null;
    eated_black_knights_div.innerHTML = null;
    eated_black_pawns_div.innerHTML = null;
};