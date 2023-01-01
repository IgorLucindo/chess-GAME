import {ref, set, get, onChildAdded, onChildChanged, update, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import {db} from "./firebase.js";



// chose host color
const sort_color = function(){
    const number_0_or_1 = Math.floor(2 * Math.random());
    if(number_0_or_1){return "white";}
    else{return "black";}
};

// send code to database so a ghest can join the game
export const set_code_db = function(code){
    let player_color = sort_color();
    sessionStorage.setItem("player_color", player_color);
    sessionStorage.setItem("code", code);
    set(ref(db, "Server/" + code), {
        host: player_color
    })
    .catch(() =>{alert("error");});
    set(ref(db, "Server/" + code + "/plays/"), {
        white_play: "last_white_play",
        black_play: "last_black_play"
    });
    set(ref(db, "Server/" + code + "/time/"), {
        white_time: "last_time_white_ds",
        black_time: "last_time_black_ds"
    });
    // receive ghest entry
    onChildAdded(ref(db, "Server/" + code), (data) =>{
        if(data.key == "ghest"){window.location.assign("/multiplayer.html");}
    });
};



// remove code from database
export const remove_code_db = function(code){
    remove(ref(db, "Server/" + code))
    .catch(() =>{alert("error");});
};



// search code to join game
export const join_code_db = function(code){
    get(ref(db, "Server/" + code))
    .then((snapshot) =>{
        if(snapshot.exists()){
            const host_color = snapshot.val().host;
            let player_color = null;
            if(host_color == "white"){player_color = "black"}
            if(host_color == "black"){player_color = "white"}
            sessionStorage.setItem("player_color", player_color);
            sessionStorage.setItem("code", code);
            // set ghest color
            update(ref(db, "Server/" + code), {
                ghest: player_color
            });
            window.location.assign("/multiplayer.html");
        }
    })
    .catch(() =>{alert("error");});
};



// update player play in database
export const update_player_play_database = function(i, j, pos, piece_color, enPassant, castle){
    const code = sessionStorage.getItem("code");
    if(piece_color == "w"){
        update(ref(db, "Server/" + code + "/plays/"), {
            white_play: [i, j, pos[0], pos[1], enPassant, castle]
        });
    }
    if(piece_color == "b"){
        update(ref(db, "Server/" + code + "/plays/"), {
            black_play: [i, j, pos[0], pos[1], enPassant, castle]
        });
    }
};



// get and make opponent's last play
export const get_opponent_play_database = function(player_color, replace_piece_function){
    const code = sessionStorage.getItem("code");
    onChildChanged(ref(db, "Server/" + code + "/plays/"), (data) =>{
        if((player_color == "white" && data.key == "black_play") ||
        (player_color == "black" && data.key == "white_play")){
            // set parameters of replace_piece_function
            let prms = data.val();
            replace_piece_function(prms[0], prms[1], [prms[2], prms[3]], prms[4], prms[5]);
        }
    });
};



// update player remaining time in database
export const update_player_time_database = function(piece_color, time_white_ds, time_black_ds){
    const code = sessionStorage.getItem("code");
    if(piece_color == "w"){
        update(ref(db, "Server/" + code + "/time/"), {
            white_time: time_white_ds
        });
    }
    if(piece_color == "b"){
        update(ref(db, "Server/" + code + "/time/"), {
            black_time: time_black_ds
        });
    }
};



// get opponent's remaining time
export const get_opponent_time_database = function(player_color, set_time_function){
    const code = sessionStorage.getItem("code");
    onChildChanged(ref(db, "Server/" + code + "/time/"), (data) =>{
        if((player_color == "white" && data.key == "black_time") ||
        (player_color == "black" && data.key == "white_time")){
            // set parameters of the set_time_function
            let opponent_time_ds = data.val();
            let opponent_color = null;
            if(player_color == "white"){opponent_color = "b";}
            if(player_color == "black"){opponent_color = "w";}
            set_time_function(opponent_time_ds, opponent_color);
        }
    });
};



// restart game in database
export const restart_game_database = function(){
    const code = sessionStorage.getItem("code");
    set(ref(db, "Server/" + code + "/plays/"), {
        white_play: "last_white_play",
        black_play: "last_black_play"
    })
    .catch(() =>{alert("error");});
};