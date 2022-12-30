// set pieces in virtual board
export const chess_board_virtual_initial = [["R_b", "N_b", "B_b", "Q_b", "K_b", "B_b", "N_b", "R_b"],
                                            ["P_b", "P_b", "P_b", "P_b", "P_b", "P_b", "P_b", "P_b"],
                                            [],
                                            [],
                                            [],
                                            [],
                                            ["P_w", "P_w", "P_w", "P_w", "P_w", "P_w", "P_w", "P_w"],
                                            ["R_w", "N_w", "B_w", "Q_w", "K_w", "B_w", "N_w", "R_w"]];
                                            
export var chess_board_virtual = [[],[],[],[],[],[],[],[]];
for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++){chess_board_virtual[i][j] = chess_board_virtual_initial[i][j];};
};

// mapping chess board
let row_1 = document.getElementsByName("row_1");
let row_2 = document.getElementsByName("row_2");
let row_3 = document.getElementsByName("row_3");
let row_4 = document.getElementsByName("row_4");
let row_5 = document.getElementsByName("row_5");
let row_6 = document.getElementsByName("row_6");
let row_7 = document.getElementsByName("row_7");
let row_8 = document.getElementsByName("row_8");
export const chess_board = [row_8, row_7, row_6, row_5, row_4, row_3, row_2, row_1];
export const chess_board_div = document.getElementsByClassName("chess_board")[0];