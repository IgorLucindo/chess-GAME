import {chess_board_virtual_initial, chess_board_virtual, chess_board} from "./chessBoards.js";
import {update_attacking_map} from "../libraries/chessMaps.js";
import {number_of_pieces, spawn_pieces} from "./spawnPieces.js";
import {restart_game_database} from "../../server/firebase_realTimeDatabase/firebase_database_functions.js";
import {initiate_timer_white, initiate_timer_black, timer} from "../local&multiplayer/profile/timer.js";
import {clear_eated_pieces_container} from "../local&multiplayer/profile/pieces.js";
import {clear_play_history_container} from "../local&multiplayer/play_history.js";



// restart game
const rematch = function(play_history, turn, load_piece, total_time, multiplayer = false){
    // reset game 
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){chess_board_virtual[i][j] = chess_board_virtual_initial[i][j];};
    };
    for(let i = 0; i < 12; i++){number_of_pieces[i] = 0;};
    play_history.length = 0;
    play_history.push(["piece", "from", "to"]);
    turn.value = 0;
    if(multiplayer){restart_game_database();}
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            chess_board[i][j].innerHTML = null;
        };
    };
    clearInterval(initiate_timer_white);
    clearInterval(initiate_timer_black);
    clear_eated_pieces_container();
    clear_play_history_container();
    // start game
    spawn_pieces();
    update_attacking_map(turn);
    timer(total_time, turn);
    let pieces = document.getElementsByName("piece");
    pieces.forEach((piece) =>{
        load_piece(piece);
    });
};



// open finish game container
export const finish_game = function(play_history, turn, load_piece, total_time, multiplayer = false){
    let finish_game_container = document.createElement("div");
    finish_game_container.classList.add("finish_game_container");
    finish_game_container.innerHTML = `<button class="rematch_button">rematch</button>`;
    document.body.appendChild(finish_game_container);

    const rematch_button = finish_game_container.getElementsByClassName("rematch_button")[0];
    rematch_button.addEventListener("click", () =>{
        rematch(play_history, turn, load_piece, total_time, multiplayer);
        document.body.removeChild(finish_game_container);
    });
};