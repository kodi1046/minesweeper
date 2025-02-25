import { Grid, Cell } from './classes'
import { GridError, InvalidIndexError, InvalidMinesError, NegativeGridError } from './errors';

// declarations
const ACCESS_REVEALED = "can't move to a revealed cell";
type Move = "flag" | "reveal";

/**
 * calculates a move to position (@row, @col)
 * @param row 
 * @param col 
 * @param flag 
 */
export function player_move(row: number, col: number, move: Move = "reveal", grid: Grid) {
    if (!grid.is_valid_index(row, col)) {
        throw new InvalidIndexError(grid.get_row_count(), grid.get_col_count(), row, col);
    }

    // cell at given position
    let cell = grid.cell_at(row, col);

    // check if cell is revealed
    if (cell.get_state() === "revealed") {
        console.log(ACCESS_REVEALED);
        // make player move again
    }

    // check if flag is passed
    if (move as Move === "flag") {
        if (cell.get_state() !== "flagged") {
            cell.set_state("flagged");
            return 
        } else {
            // sets state to "unrevealed"
            cell.set_state("unrevealed");
        }
    }

    // handle case when cell is a mine
    if (cell.get_type() === "mine") {
        cell.set_state("revealed");
        // game over
    }

    // general case
    cell.set_state("revealed");

    grid.reveal_neighbors(row, col);

}

/**
 * returs a generated @Grid with the specified amount of mines
 * @param mines 
 */
export function setup_environment(rows: number, cols: number, mines: number): Grid {
    const grid = new Grid(rows, cols);
    if (!grid.is_valid_mines_count(mines)) {
        throw new InvalidMinesError(mines, rows, cols);
    }
    grid.populate_with_mines(mines);
    return grid;
}


