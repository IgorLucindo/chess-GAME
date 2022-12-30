const play_history_div = document.getElementById("play_history");



// update play history container
export const update_play_history_container = function(play_history, turn){
    let play_history_text = document.createElement("span");
    play_history_text.innerHTML = play_history[turn.value];
    play_history_div.appendChild(play_history_text);
};

export const clear_play_history_container = function(){
    play_history_div.innerHTML = null;
};