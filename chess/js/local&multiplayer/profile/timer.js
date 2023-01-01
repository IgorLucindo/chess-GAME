import {finish_game} from "../../game/finishGame.js";

const timer_white_div = document.getElementById("timer_white");
const timer_black_div = document.getElementById("timer_black");
var toggle_timer_style = null;
export var initiate_timer_white = null;
export var initiate_timer_black = null;
export var time_white_ds = null;
export var time_black_ds = null;



// set time in timer container
export const set_time = function(time_ds, player_color){
    let time = Math.floor(time_ds.value/10);
    let string_aux = ":"
    if(time%60 < 10){string_aux = ":0"}
    if(player_color == "w"){timer_white_div.innerHTML = Math.floor(time/60) + string_aux + time%60;}
    if(player_color == "b"){timer_black_div.innerHTML = Math.floor(time/60) + string_aux + time%60;}
};



// counter for each player timer
const counter = function(time_ds, player_color, play_history, turn, load_piece, total_time){
    // display time
    if((player_color == "w" && turn.value%2 == 0) || (player_color == "b" && turn.value%2 == 1)){
        if(time_ds.value%10 == 9){
            set_time(time_ds, player_color);
        }
        if(time_ds.value <= 0){
            finish_game(play_history, turn, load_piece, total_time);
            clearInterval(initiate_timer_white);
            clearInterval(initiate_timer_black);
        }
        if(turn.value != 0){time_ds.value--;}
    }
    // timer style
    if(toggle_timer_style == "white" && turn.value%2 == 0){
        timer_black_div.style.backgroundColor = null;
        timer_white_div.style.backgroundColor = "rgb(80, 80, 80)";
        toggle_timer_style = "black";
    }
    if(toggle_timer_style == "black" && turn.value%2 == 1){
        timer_white_div.style.backgroundColor = null;
        timer_black_div.style.backgroundColor = "rgb(80, 80, 80)";
        toggle_timer_style = "white";
    }
};



// load timer
export const timer = function(play_history, turn, load_piece, total_time){
    // reset timer container style
    timer_black_div.style.backgroundColor = null;
    timer_white_div.style.backgroundColor = null;
    // timer for each player
    time_white_ds = {value: total_time * 10};
    time_black_ds = {value: total_time * 10};
    toggle_timer_style = "black";
    // displaying total time initialy
    set_time(time_white_ds, "w");
    set_time(time_black_ds, "b");
    // starting timer
    initiate_timer_white = setInterval(() =>{counter(time_white_ds, "w", play_history, turn, load_piece, total_time);}, 100);
    initiate_timer_black = setInterval(() =>{counter(time_black_ds, "b", play_history, turn, load_piece, total_time);}, 100);
};