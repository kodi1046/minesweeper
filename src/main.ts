import { Cell, Grid } from "../modules/classes";
import { setup_environment } from "../modules/game_module";

// declarations
const ROWS = get_user_input("rows");
const COLS = get_user_input("cols");
const MINES = get_user_input("mines");

const MINE_SYMBOL = "*";
const FLAG_SYMBOL = "!";
const EMPTY_SYMBOL = "~";
const UNREVEALED_SYMBOL = "o";


const grid = setup_environment(ROWS, COLS, MINES);

function display_grid(grid: Grid) {
    const rows = grid.get_row_count();
    const cols = grid.get_col_count();
    
    for(const row of grid.grid) {
        let row_string = "";
        for (const cell of row) {
            const symbol = cell_symbol(cell);
                row_string += ` ${symbol}`;
        }
        console.log(row_string);
    }
}

function cell_symbol(cell: Cell): string {
    switch (cell.get_state()) {
        case "flagged":
            return FLAG_SYMBOL;
        case "unrevealed":
            return UNREVEALED_SYMBOL;
        case "revealed":
            switch (cell.get_type()) {
                case "empty":
                    return cell.get_adjacent_mines().toString();
                case "mine":
                    return MINE_SYMBOL;
            }
    }
}

// function get_user_input_coords(): [number, number] {
//     const input_row: string | null = prompt();
//     const input_col: string | null = prompt();
//     const cell =grid.cell_at(parseInt(input_row as string), parseInt(input_col as string));
//     move

// }



// game loop
while (true) {

}






/**
 * asks the user for number of @type "rows" | "cols" | "mines"
 * @param type 
 * @returns number of "rows" | "cols" | "mines"
 */
function get_user_input(type: string): number {
    const input: string | null = prompt(`input the desired number of ${type}`);
    if (input === null){
        console.error("Please provide an input")
        return get_user_input(type);
    }
    const parsed_input = parseInt(input);

    // check if it's not a number or it's less than or equal to 0
    if (isNaN(parsed_input) || parsed_input <= 0){
        console.error("invalid input");
        return get_user_input(type);
    }
    return parsed_input;
}







