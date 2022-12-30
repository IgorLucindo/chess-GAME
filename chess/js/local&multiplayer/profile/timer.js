const timer_white_div = document.getElementById("timer_white");
const timer_black_div = document.getElementById("timer_black");
const timer_white_container_div = document.getElementById("timer_white_container");
const timer_black_container_div = document.getElementById("timer_black_container");
export var initiate_timer_white = null;
export var initiate_timer_black = null;



// load timer
export const timer = function(total_time_num, turn){
    // reset timer container style
    timer_black_container_div.style.backgroundColor = null;
    timer_white_container_div.style.backgroundColor = null;
    // timer for each player
    var total_time = {value: total_time_num};
    var time_white_ds = {value: total_time.value * 10};
    var time_black_ds = {value: total_time.value * 10};
    var toggle_timer_style = "black";
    // counter for each player timer
    const counter = function(time_ds, timer_div, piece_color){
        // display time
        if((piece_color == "w" && turn.value%2 == 0) || (piece_color == "b" && turn.value%2 == 1)){
            if(time_ds.value%10 == 9){
                let time = Math.floor(time_ds.value/10);
                let string_aux = ":"
                if(time%60 < 10){string_aux = ":0"}
                timer_div.innerHTML = Math.floor(time/60) + string_aux + time%60;
            }
            if(time_ds.time_ds <= 0){
                console.log("win");
                clearInterval(initiate_timer_white);
                clearInterval(initiate_timer_black);
            }
            if(turn.value != 0){time_ds.value--;}
        }
        // timer style
        if(toggle_timer_style == "white" && turn.value%2 == 0){
            timer_black_container_div.style.backgroundColor = null;
            timer_white_container_div.style.backgroundColor = "rgb(80, 80, 80)";
            toggle_timer_style = "black";
        }
        if(toggle_timer_style == "black" && turn.value%2 == 1){
            timer_white_container_div.style.backgroundColor = null;
            timer_black_container_div.style.backgroundColor = "rgb(80, 80, 80)";
            toggle_timer_style = "white";
        }
    };
    // displaying total time initialy
    let time_white = Math.floor(time_white_ds.value/10);
    timer_white_div.innerHTML = Math.floor(time_white/60) + ":0" + time_white%60;
    let time_black = Math.floor(time_black_ds.value/10);
    timer_black_div.innerHTML = Math.floor(time_black/60) + ":0" + time_black%60;
    // starting timer
    initiate_timer_white = setInterval(() =>{counter(time_white_ds ,timer_white_div, "w");}, 100);
    initiate_timer_black = setInterval(() =>{counter(time_black_ds ,timer_black_div, "b");}, 100);
};
