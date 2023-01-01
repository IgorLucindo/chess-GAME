import {chess_board, chess_board_div, chess_board_virtual} from "../game/chessBoards.js";
import {pieces, spawn_pieces} from "../game/spawnPieces.js";
import {create_circles} from "../libraries/piecesMovementsCircles.js";
import {update_attacking_map} from "../libraries/chessMaps.js";
import {get_square_overlayed, clear_all_circles, replace_piece, get_piece_position} from "../libraries/chessBoardActions.js";
import {flipped} from "./flipboard_button.js";
import {timer} from "./profile/timer.js";
import {finish_game} from "../game/finishGame.js";

var play_history = [["piece", "from", "to"]];
var pos = null;
var square_overlayed = null;
var isDragging = false;
var pieceDragged = false;
var mouseI = 0;
var mouseJ = 0;
var mouseI_temp = 0;
var mouseJ_temp = 0;
var turn = {value: 0};
const piece_over_others_div = document.getElementById("piece_over_others");
var total_time = 300;


// on press circle function
const pressCircle = (e) =>{
    if(square_overlayed.getAttribute("active") == "true"){
        const chess_board_div_properties = chess_board_div.getBoundingClientRect();
        const left = chess_board_div_properties.left;
        const top = chess_board_div_properties.top;
        let mouseX = e.pageX;
        let mouseY = e.pageY;
        let [mouseI, mouseJ] = px2square(mouseX, mouseY, left, top);
        // move to circle
        if(chess_board[mouseJ][mouseI].getElementsByClassName("circle")[0] != null ||
           chess_board[mouseJ][mouseI].getElementsByClassName("circle_target")[0] != null){
            replace_piece(mouseJ, mouseI, pos, play_history, isDragging, load_piece, turn, flipped, total_time);
        }
    }
};

// on drop piece function
const dropPiece = () =>{
    // move to circle
    if((isDragging && chess_board[mouseJ][mouseI].getElementsByClassName("circle")[0] != null) ||
       (isDragging && chess_board[mouseJ][mouseI].getElementsByClassName("circle_target")[0] != null)){
        replace_piece(mouseJ, mouseI, pos, play_history, isDragging, load_piece, turn, flipped, total_time);
        pieceDragged = true;
    }
    chess_board_div.removeEventListener("mouseup", dropPiece);
};



// move piece in clicked circle
const move_piece_to_circle = function(){
    chess_board_div.addEventListener("mousedown", pressCircle);
    piece_over_others_div.addEventListener("mouseup", dropPiece);
};



// when piece is active
const piece_active = function(pos){
    if(square_overlayed.getAttribute("class") == "overlay"){create_circles(pos, play_history);}
    square_overlayed.classList.add("active");
    move_piece_to_circle();
};



// piece dragging movement animation inside chess board
const piece_drag_movement = function(piece, mouseX, mouseY, left, right, top, bottom){
    if(mouseX > left && mouseX < right){piece.style.left = mouseX - 75/2 + "px";}
    else if(mouseX < left){piece.style.left = left - 75/2 + "px";}
    else{piece.style.left = right - 75/2 + "px";}
    if(mouseY > top && mouseY < bottom){piece.style.top = mouseY - 75/2 + "px";}
    else if(mouseY < top){piece.style.top = top - 75/2 + "px";}
    else{piece.style.top = bottom - 75/2 + "px";}
};

// transform mouse coordinates in px to squares
const px2square = function(mouseX, mouseY, left, top){
    let mouseI = parseInt((mouseX-left)/75);
    let mouseJ = parseInt((mouseY-top)/75);
    if(flipped){[mouseI, mouseJ] =[7 - mouseI, 7 - mouseJ];}
    return [mouseI, mouseJ];
};

// remove square highlight
const add_square_highlight = function(i, j){
    let highlight_border = document.createElement("div");
    highlight_border.classList.add("square_highlight");
    chess_board[j][i].appendChild(highlight_border);
};

// remove square highlight
const remove_square_highlight = function(i, j){
    let highlight_border = chess_board[j][i].getElementsByClassName("square_highlight")[0];
    if(highlight_border != null){chess_board[j][i].removeChild(highlight_border);}
};

// toggle square highlight when mouse is over square
const toggle_square_highlight = function(mouseX, mouseY, left, right, top, bottom){
    [mouseI, mouseJ] = px2square(mouseX, mouseY, left, top);
    if(mouseI != mouseI_temp || mouseJ != mouseJ_temp){
        if((!flipped && mouseX < left) || (flipped && mouseX > right)){mouseI = 0;}
        if((!flipped && mouseX > right) || (flipped && mouseX < left)){mouseI = 7;}
        if((!flipped && mouseY < top) || (flipped && mouseY > bottom)){mouseJ = 0;}
        if((!flipped && mouseY > bottom) || (flipped && mouseY < top)){mouseJ = 7;}
        // add square highlight
        add_square_highlight(mouseI, mouseJ);
        // remove square highlight
        remove_square_highlight(mouseI_temp, mouseJ_temp);
        mouseI_temp = mouseI;
        mouseJ_temp = mouseJ;
    }
};



// make piece playable
const load_piece = function(piece){
    // on drag piece function
    const onDrag = (e) =>{
        // change isDragging state
        if(!isDragging){isDragging = true;}
        // board positions
        const chess_board_div_properties = chess_board_div.getBoundingClientRect();
        const left = chess_board_div_properties.left;
        const top = chess_board_div_properties.top;
        const right = chess_board_div_properties.right;
        const bottom = chess_board_div_properties.bottom;
        // mouse position
        let mouseX = e.pageX;
        let mouseY = e.pageY;
        // drag piece animation
        piece_drag_movement(piece, mouseX, mouseY, left, right, top, bottom);
        // toggle highlight when mouse is over square
        toggle_square_highlight(mouseX, mouseY, left, right, top, bottom);
    };
    // on release piece function
    const onRelease = () =>{
        // get back the piece to original square
        piece.style.left = null;
        piece.style.top = null;
        piece.style.cursor = "grab";
        document.body.style.cursor = null;
        window.removeEventListener("mousemove", onDrag);
        // activate piece, deactivate stopped piece and dragged piece
        if(square_overlayed.getAttribute("active") == "false" && !pieceDragged){square_overlayed.setAttribute("active", "true");}
        else if(!isDragging || pieceDragged){
            square_overlayed.classList.remove("active");
            clear_all_circles();
            square_overlayed.setAttribute("active", "false");
        }
        // remove previous highlight from square
        remove_square_highlight(mouseI_temp, mouseJ_temp);
        // piece, which is in front of others, returns behind
        square_overlayed.appendChild(piece);
        // update state
        isDragging = false;
        pieceDragged = false;
        window.removeEventListener("mouseup", onRelease);
    };
    // press piece
    piece.addEventListener("mousedown", (e) =>{
        // left click
        if(e.button == 0){
            // getting properties of piece
            pos = get_piece_position(piece);
            square_overlayed = get_square_overlayed(pos);
            isDragging = false;
            // piece becomes in front of others
            piece_over_others_div.appendChild(piece);
            // piece move to cursor on click
            piece.style.left = e.pageX - 75/2 + "px";
            piece.style.top = e.pageY - 75/2 + "px";
            piece.style.cursor = "grabbing";
            document.body.style.cursor = "grabbing";
            // clear circles when selecting new piece
            if(square_overlayed.getAttribute("class") == "overlay"){clear_all_circles();}
            // activate piece
            let piece_color = chess_board_virtual[pos[0]][pos[1]][2];
            if((piece_color == "w" && turn.value%2 == 0) || (piece_color == "b" && turn.value%2 == 1)){
                piece_active(pos);
            }
            // drag piece
            window.addEventListener("mousemove", onDrag);
            // release piece
            window.addEventListener("mouseup", onRelease);
        }
    });
};



// starting game
spawn_pieces();
update_attacking_map(play_history);
timer(play_history, turn, load_piece, total_time);
pieces.forEach((piece) =>{
    load_piece(piece);
});



// right clicking on the board
chess_board_div.addEventListener('contextmenu', event => event.preventDefault());
chess_board_div.addEventListener("mouseup", (e) =>{
    if(e.button == 2){
        console.log(1)
    }
});



// deselecting piece when clicking elsewhere
document.addEventListener("mousedown", (e) =>{
    let counter = 0;
    pieces.forEach((piece) =>{
        let pos = get_piece_position(piece);
        let square_overlayed = get_square_overlayed(pos);
        if(e.target.id !== chess_board_virtual[pos[0]][pos[1]]){
            square_overlayed.classList.remove("active");
            square_overlayed.setAttribute("active", "false");
            counter ++;
        }
    });
    if(counter == pieces.length){clear_all_circles();}
});



// restarting game button
const restart_game_button = document.getElementById("restart_game");
restart_game_button.addEventListener("click", () =>{
    finish_game(play_history, turn, load_piece, 300);
});