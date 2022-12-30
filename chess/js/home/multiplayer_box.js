import {remove_code_db, join_code_db, set_code_db} from "../../server/firebase_realTimeDatabase/firebase_database_functions.js";

const multiplayer_button = document.getElementById("multyplayer_button");



// 4 digit code generator
const code_generator = function(){
    let code_array = [];
    for(let i = 0; i < 4; i++){
        let digit = null
        let digit_number = Math.floor(36*Math.random());
        if(digit_number < 26){digit = String.fromCharCode(65 + digit_number);}
        else{digit = (digit_number - 26).toString();}
        code_array += digit;
    };
    return code_array;
};



// opening or closing multiplayer box
multiplayer_button.addEventListener("click", () =>{
    // close multiplayer box
    if(document.getElementsByClassName("multiplayer_box")[0] != null){
        document.body.removeChild(document.getElementsByClassName("multiplayer_box")[0]);
        return 0;
    }
    // open multiplayer box
    let multiplayer_box = document.createElement("div");
    multiplayer_box.setAttribute("class", "multiplayer_box");
    multiplayer_box.innerHTML = `<button id="host_button">Host</button><button id="join_button">Join Host</button>`;
    document.body.prepend(multiplayer_box);
    // multiplayer box buttons functionality
    let multiplayer_button_host = document.getElementById("host_button");
    let multiplayer_button_join = document.getElementById("join_button");
    // create host container div
    multiplayer_button_host.addEventListener("click", () =>{
        const body_overlay = document.createElement("div");
        const host_container = document.createElement("div");
        body_overlay.setAttribute("id", "body_overlay");
        body_overlay.setAttribute("class", "body_overlay");
        document.body.appendChild(body_overlay);
        body_overlay.appendChild(host_container);
        // generate code
        let code = code_generator();
        host_container.innerHTML = `<span>Host Code: ` + code + `</span><h2>wating player to join ...</h2>`;
        // send code to database
        set_code_db(code);
        // clicking on body_overlay closes container
        body_overlay.addEventListener("click", (e) =>{
            if(e.target.id === "body_overlay"){
                document.body.removeChild(body_overlay);
                // remove code from database
                remove_code_db(code);
            }
        });
    });
    // create join container div
    multiplayer_button_join.addEventListener("click", () =>{
        const body_overlay = document.createElement("div");
        const join_container = document.createElement("div");
        body_overlay.setAttribute("id", "body_overlay");
        body_overlay.setAttribute("class", "body_overlay");
        document.body.appendChild(body_overlay);
        body_overlay.appendChild(join_container);
        // join host
        join_container.innerHTML = `<h1>Enter Code:</h1><input id="code_input"><button>Join</button>`;
        const join_button = body_overlay.getElementsByTagName("button")[0];
        join_button.addEventListener("click", () =>{
            const code_input = document.getElementById("code_input");
            join_code_db(code_input.value);
        });
        // clicking on body_overlay closes container
        body_overlay.addEventListener("click", (e) =>{
            if(e.target.id === "body_overlay"){document.body.removeChild(body_overlay);}
        });
    });
});

