"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player_move = player_move;
// declarations
var ACCESS_REVEALED = "can't move to a revealed cell";
/**
 * calculates a move to position (@row, @col)
 * @param row
 * @param col
 * @param flag
 */
function player_move(move, grid) {
    // Handle the first reveal of the game
    if (grid.safe_cells === grid.get_empty_count() && move.type === "reveal") {
        grid.game_start(move.row, move.col);
    }
    if (move.type === "reveal") {
        grid.reveal(move.row, move.col);
    }
    // Flag/unflag the cell
    if (move.type === "flag") {
        grid.flag(move.row, move.col);
    }
    return grid.get_game_state();
}
