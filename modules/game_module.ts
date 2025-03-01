import { Grid, Cell } from './classes'
import { GridError, InvalidIndexError, InvalidMinesError, NegativeGridError } from './errors';

// declarations
const ACCESS_REVEALED = "can't move to a revealed cell";
export type Move = {row: number, col: number, type: "reveal" | "flag"}
type Result = "win" | "lose" | void;

/**
 * calculates a move to position (@row, @col)
 * @param row 
 * @param col 
 * @param flag 
 */
export function player_move(move: Move, grid: Grid): Result {
    // Cell at given position
    const cell = grid.cell_at(move.row, move.col);

    // Reveal the cell
    if(move.type === "reveal") {
        if (cell.get_state() !== "flagged") {
            grid.reveal(move.row, move.col);
            
            if(cell.get_type() === "mine") {
                return "lose";
            }
        } 
    }

    // Flag/unflag the cell
    if (move.type === "flag") {
        if (cell.get_state() === "unrevealed") {
            cell.set_state("flagged");
        }
        else if (cell.get_state() === "flagged") {
            cell.set_state("unrevealed");
        }
    }

    if (grid.has_won()) {
        return "win";
    }
}

/**
 * returs a generated @Grid
 * @param mines 
 */
export function setup_environment(rows: number, cols: number, desired_mines: number): Grid {
    const grid = new Grid(rows, cols, desired_mines);
    if (!grid.is_valid_mines_count(desired_mines)) {
        throw new InvalidMinesError(desired_mines, rows, cols);
    }
    
    return grid;
}


