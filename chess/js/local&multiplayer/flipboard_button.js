import {chess_board_div} from "../game/chessBoards.js";
import {pieces} from "../game/spawnPieces.js";

const flip_board_button = document.getElementsByClassName("flip_board_button")[0];
const border_board_div_array = document.getElementsByClassName("border_board");
export var flipped = false;
const border_board_text_array = ["8","7","6","5","4","3","2","1",,"a","b","c","d","e","f","g","h"];



// flip board
export const flip_board = function(){
    if(!flipped){
        chess_board_div.style.transform = "rotate(180deg)";
        pieces.forEach(piece =>{piece.parentNode.style.transform = "rotate(-180deg)";});
        for(let i = 0; i < 8; i++){
            border_board_div_array[i].innerHTML = `<h3>` + border_board_text_array[7-i] + `</h3>`;
            border_board_div_array[9+i].innerHTML = `<h3>` + border_board_text_array[16-i] + `</h3>`;
        };
        flipped = true;
    }
    else{
        chess_board_div.style.transform = null;
        pieces.forEach(piece =>{piece.parentNode.style.transform = null;});
        for(let i = 0; i < 8; i++){
            border_board_div_array[i].innerHTML = `<h3>` + border_board_text_array[i] + `</h3>`;
            border_board_div_array[9+i].innerHTML = `<h3>` + border_board_text_array[9+i] + `</h3>`;
        };
        flipped = false;
    }
};



// flip board button
if(flip_board_button != null){
    flip_board_button.addEventListener("click", flip_board);
}