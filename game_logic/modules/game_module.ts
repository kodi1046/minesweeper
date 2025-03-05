import { Grid, Cell } from './classes.js'
import { GridError, InvalidIndexError, InvalidMinesError, NegativeGridError } from './errors.js';

// declarations
const ACCESS_REVEALED = "can't move to a revealed cell";
export type Move = {row: number, col: number, type: "reveal" | "flag"}
type GameState = "win" | "lose" | "undecided";

/**
 * calculates a move to position (@row, @col)
 * @param row 
 * @param col 
 * @param flag 
 */
export function player_move(move: Move, grid: Grid): GameState {
    
    // Handle the first reveal of the game
    if(grid.safe_cells === grid.get_empty_count() && move.type === "reveal") {
        grid.game_start(move.row, move.col);
    }

    if(move.type === "reveal") {
        grid.reveal(move.row, move.col)
    }

    // Flag/unflag the cell
    if (move.type === "flag") {
        grid.flag(move.row, move.col);
    }

    return grid.get_game_state();
}


