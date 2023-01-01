import {chess_board_virtual, chess_board, chess_board_div} from "../game/chessBoards.js";
import {set_piece_template} from "../game/spawnPieces.js";
import {checking_pieces, update_attacking_map} from "./chessMaps.js";
import {update_play_history_container} from "../local&multiplayer/play_history.js";
import {update_eated_pieces_container} from "../local&multiplayer/profile/pieces.js";
import {get_opponent_play_database, update_player_play_database, update_player_time_database} from "../../server/firebase_realTimeDatabase/firebase_database_functions.js";
import {time_white_ds, time_black_ds} from "../local&multiplayer/profile/timer.js";
import { verify_checkmate } from "./checkmate.js";

var enPassant = null;
var castle = null;
var capture = null;



// return square_overlayed from the piece position
export const get_square_overlayed = function(pos){
    return chess_board[pos[0]][pos[1]].getElementsByClassName("overlay")[0];
};



// clear all circles
export const clear_all_circles = function(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(chess_board_virtual[i][j] == null){chess_board[i][j].innerHTML = "";}
            else if(chess_board[i][j].getElementsByClassName("circle_target")[0] != null){
                chess_board[i][j].removeChild(chess_board[i][j].getElementsByClassName("circle_target")[0]);
                chess_board[i][j].removeChild(chess_board[i][j].getElementsByClassName("obfuscate")[0]);
            }
        };
    };
};



// return piece position in virtual board
export const get_piece_position = function(piece){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(chess_board_virtual[i][j] == piece.getAttribute("id")){var pos = [i, j];}
        };
    };
    return pos;
};



// promote pawn
const promote = function(i, j, piece_color, load_piece, play_history, turn, flipped, total_time, multiplayer = false){
    // create promotion_container
    let promotion_container = document.createElement("div");
    promotion_container.classList.add("promotion_container");
    // horizontal position of promotion_container
    let reference_piece = chess_board[4][j].getBoundingClientRect();
    if(!flipped){promotion_container.style.left = reference_piece.left + "px";}
    if(flipped){promotion_container.style.left = 75*j + "px";}

    if(piece_color == "w"){
        promotion_container.innerHTML = `<button class="queen_white" id="Q_w" style="position:static; cursor: pointer;"></button>
                                         <button class="rook_white" id="R_w" style="position:static; cursor: pointer;"></button>
                                         <button class="bishop_white" id="B_w" style="position:static; cursor: pointer;"></button>
                                         <button class="knight_white" id="N_w" style="position:static; cursor: pointer;"></button>`;
    }
    if(piece_color == "b"){
        promotion_container.innerHTML = `<button class="knight_black" id="N_b" style="position:static; cursor: pointer;"></button>
                                         <button class="bishop_black" id="B_b" style="position:static; cursor: pointer;"></button>
                                         <button class="rook_black" id="R_b" style="position:static; cursor: pointer;"></button>
                                         <button class="queen_black" id="Q_b" style="position:static; cursor: pointer;"></button>`;
        // vertical position of black promotion_container
        if(!flipped){promotion_container.style.top = reference_piece.top - 1 + "px";}
        if(flipped){promotion_container.style.top = 300 + "px";}
    }
    chess_board_div.appendChild(promotion_container);
    // select piece on mousedown
    let piece_buttons = promotion_container.getElementsByTagName("button");
    for(let n = 0; n < 4; n++){
        if(flipped){piece_buttons[n].style.transform = "rotate(-180deg)";}
        piece_buttons[n].addEventListener("mousedown", () =>{
            // create piece
            chess_board[i][j].innerHTML = `<div class="overlay" active="false"><button name="piece"></button></div>`;
            set_piece_template(i, j, piece_buttons[n].getAttribute("class"), piece_buttons[n].getAttribute("id"), flipped);
            // load piece
            load_piece(chess_board[i][j].getElementsByTagName("button")[0]);
            // close container
            chess_board_div.removeChild(promotion_container);
            // update player properties in database
            if(multiplayer){
                update_player_play_database(i, j, pos, piece_color, enPassant, castle);
                update_player_time_database(piece_color, time_white_ds, time_black_ds);
            }
            // update attacking map
            update_attacking_map(play_history);
            // sound effects
            sound_effects();
            // pass turn
            turn.value++;
            // update play history container
            update_play_history_container(play_history, turn);
            // verify checkmate
            verify_checkmate(piece_color, play_history, turn, load_piece, total_time);
        });
    };
};



// sound effects
const sound_effects = function(){
    let movement_audio = new Audio();
    if(!capture){movement_audio.src = "../../static/audios/move-self.mp3";}
    if(castle != null){movement_audio.src = "../../static/audios/castle.mp3";}
    if(capture){movement_audio.src = "../../static/audios/capture.mp3";}
    if(checking_pieces.length != 0){movement_audio.src = "../../static/audios/move-check.mp3";}
    setTimeout(() =>{movement_audio.play();}, 100);
};



// animate piece when moved
const move_piece_animation = function(i, j, pos, square_overlayed, flipped){
    let piece = square_overlayed.getElementsByTagName("button")[0];
    let [x_translation, y_translation] = [];
    if(!flipped){[x_translation, y_translation] = [(pos[1]-j)*2, (pos[0]-i)*2];}
    if(flipped){[x_translation, y_translation] = [-(pos[1]-j)*2, -(pos[0]-i)*2];}
    piece.style.transform = "translate("+x_translation+"cm, "+ y_translation +"cm)";
    setTimeout(() =>{piece.style.transform = null;}, 0);
}



// change position of piece
const change_position = function(i, j, pos, square_overlayed){
    // update capture and eated piece
    if(chess_board_virtual[i][j] != null){
        capture = true;
        update_eated_pieces_container(chess_board_virtual[i][j]);
    }
    // change piece position in the board
    chess_board[i][j].innerHTML = null;
    chess_board[i][j].appendChild(square_overlayed);
    // change piece position in the virtual board
    chess_board_virtual[i][j] = chess_board_virtual[pos[0]][pos[1]];
    chess_board_virtual[pos[0]][pos[1]] = null;
}

// change position of enPassant related piece
const change_position_enPassant = function(i, j, enPassant_move){
    capture = true;
    enPassant = enPassant_move;
    // push eated piece
    update_eated_pieces_container(chess_board_virtual[i-enPassant_move][j]);
    // change piece position in the board
    chess_board[i-enPassant_move][j].innerHTML = null;
    // change piece position in the virtual board
    chess_board_virtual[i-enPassant_move][j] = null;
};

// change position of castle related piece
const change_position_castle = function(i, j, castle_move, square_overlayed){
    castle = castle_move;
    // change piece position in the board
    if(castle_move == -1){chess_board[i][j+castle_move].innerHTML = null;}
    if(castle_move == 1){chess_board[i][j+castle_move].innerHTML = null;}
    if(castle_move == -1){chess_board[i][j+castle_move].appendChild(get_square_overlayed([i, 7]));}
    if(castle_move == 1){chess_board[i][j+castle_move].appendChild(get_square_overlayed([i, 0]));}
    // change piece position in the virtual board
    if(castle_move == -1){chess_board_virtual[i][j+castle_move] = chess_board_virtual[i][7];}
    if(castle_move == 1){chess_board_virtual[i][j+castle_move] = chess_board_virtual[i][0];}
    if(castle_move == -1){chess_board_virtual[i][7] = null;}
    if(castle_move == 1){chess_board_virtual[i][0] = null;}
    // remove castle condition
    if((chess_board_virtual[i][j][0] == "K" || chess_board_virtual[i][j][0] == "R") &&
        square_overlayed.getAttribute("castle") == null){
        square_overlayed.setAttribute("castle", "false");
    }
};



// replace piece position in board and in virtual board
export const replace_piece = function(i, j, pos, play_history, isDragging, load_piece, turn, flipped, total_time, multiplayer = false){
    let circle = chess_board[i][j].getElementsByClassName("circle")[0];
    let circle_target = chess_board[i][j].getElementsByClassName("circle_target")[0];
    let square_overlayed = get_square_overlayed(pos);
    let piece_color = chess_board_virtual[pos[0]][pos[1]][2];
    enPassant = null;
    castle = null;
    capture = false;
    // change piece position
    change_position(i, j, pos, square_overlayed);
    if(circle_target != null && circle_target.getAttribute("enPassant") != null){
        change_position_enPassant(i, j, Number(circle_target.getAttribute("enPassant")));
    }
    if(circle != null && circle.getAttribute("castle") != null){
        change_position_castle(i, j, Number(circle.getAttribute("castle")), square_overlayed);
    }
    // movement animation
    if(!isDragging){move_piece_animation(i, j, pos, square_overlayed, flipped);}
    // update play history
    play_history.push([chess_board_virtual[i][j], pos, [i,j]]);
    // check promotion
    if(chess_board_virtual[i][j][0] == "P" && (i == 0 || i == 7)){
        promote(i, j, piece_color, load_piece, play_history, turn, flipped, total_time, multiplayer);
    }
    else{
        // update player properties in database
        if(multiplayer){
            update_player_play_database(i, j, pos, piece_color, enPassant, castle);
            update_player_time_database(piece_color, time_white_ds, time_black_ds);
        }
        // update attacking map
        update_attacking_map(play_history);
        // sound effects
        sound_effects();
        // pass turn
        turn.value++;
        // update play history container
        update_play_history_container(play_history, turn);
        // verify checkmate
        verify_checkmate(piece_color, play_history, turn, load_piece, total_time);
    }
};



// replace piece position in board and in virtual board
export const replace_piece_database = function(play_history, load_piece, turn, flipped, total_time, player_color){
    get_opponent_play_database(player_color, (i, j, pos, enPassant_move, castle_move) =>{
        let square_overlayed = get_square_overlayed(pos);
        let piece_color = chess_board_virtual[pos[0]][pos[1]][2];
        enPassant = null;
        castle = null;
        capture = false;
        // change piece position
        change_position(i, j, pos, square_overlayed);
        if(enPassant_move != null){change_position_enPassant(i, j, enPassant_move);}
        if(castle_move != null){change_position_castle(i, j, castle_move, square_overlayed);}
        // movement animation
        move_piece_animation(i, j, pos, square_overlayed, flipped);
        // update play history
        play_history.push([chess_board_virtual[i][j], pos, [i,j]]);
        // check promotion
        if(chess_board_virtual[i][j][0] == "P" && (i == 0 || i == 7)){
            promote(i, j, piece_color, load_piece, play_history, turn, flipped, total_time);
        }
        else{
            // update attacking map
            update_attacking_map(play_history);
            // sound effects
            sound_effects();
            // pass turn
            turn.value++;
            // update play history container
            update_play_history_container(play_history, turn);
            // verify checkmate
            verify_checkmate(piece_color, play_history, turn, load_piece, total_time);
        }
    });
};