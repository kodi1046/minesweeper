import { Cell, Grid } from "../modules/classes.js";
import { Move, player_move} from "../modules/game_module.js";

import * as promptSync from 'prompt-sync'
const prompt = promptSync();

const MINE_SYMBOL = "*";
const FLAG_SYMBOL = "!";
const UNREVEALED_SYMBOL = "~";
const EMPTY_SYMBOL = " ";

function main() {

    // Get settings for the game
    const row_count = int_input("Input the desired number of rows: ");
    const col_count = int_input("Input the desired number of columns: ");
    const mine_count = int_input("Input the desired number of mines: ");

    // Construct the grid
    const grid = new Grid(row_count, col_count, mine_count);

    // Game loop
    while(true) {
        display_grid(grid);

        const move: Move = get_player_move(grid);
        const result = player_move(move, grid);

        if(result === "win") {
            console.log("You win!")
            break;
        }

        if(result === "lose") {
            console.log("You lose!")
            break;
        }
    }
    display_grid(grid);
}

main();


/**
 * Asks for a players move on the given grid
 * @param grid 
 * @returns Move, representing the type of move to execute, and at which index
 */
function get_player_move(grid : Grid): Move {
    const row: number = int_input("Enter the row number: ", grid.get_row_count() - 1);  
    const col: number = int_input("Enter the col number: ", grid.get_col_count() - 1);  

    let move_type : Move["type"] = "reveal";
    let choice: number = int_input("0 to flag and 1 to reveal: ", 1);
    if (choice === 0){
        move_type = "flag"
    }
    return {col: col, row: row, type: move_type};
}

/**
 * Displays a given grid
 * @param grid 
 */
function display_grid(grid: Grid) {
    const cols = grid.get_col_count();
    
    // Print column markers
    let col_marker_string = "   ";
    for(let col_number = 0; col_number < cols; col_number++) {
        col_marker_string += ` ${col_number % 10}`
    }
    console.log(col_marker_string);
    console.log();
    

    let row_marker = 0;
    for(const row of grid.get_grid()) {
        let row_string = `${row_marker % 10}  `;
        for (const cell of row) {
            const symbol = cell_symbol(cell);
                row_string += ` ${symbol}`;
        }
        console.log(row_string);
        row_marker++;
    }
}

/**
 * Finds the appropriate cell for a given cell in the grid
 * @param cell 
 * @returns either a UNREVEALED_SYMBOL for unrevealed cells, FLAG_SYMBOl for flagged cells
 *          or either a MINE_SYMBOL, EMTPY_SYMBOL or a number representing neighboring mines for revealed cells
 */
function cell_symbol(cell: Cell): string {
    switch (cell.get_state()) {
        case "flagged":
            return FLAG_SYMBOL;
        case "unrevealed":
            return UNREVEALED_SYMBOL;
        case "revealed":
            switch (cell.get_type()) {
                case "empty":
                    const adjacent_mines = cell.get_neighboring_mine_count();
                    return adjacent_mines === 0 ? EMPTY_SYMBOL : adjacent_mines.toString()

                case "mine":
                    return MINE_SYMBOL;
            }
    }
}

/**
 * Asks the user for a non-negative integer that is not higher than @max, any decimals are rounded down
 * @param message 
 * @param error_message
 * @param max 
 * @returns The given integer
 * */
function int_input(message: string, max: number = Infinity, error_message: string = "Invalid input"): number {
    while (true) {
        let input: string | null = prompt(message);

        if (input === null) {
            console.error(error_message);
            continue;
        }
        const value: number = parseInt(input);

        if (isNaN(value) || value < 0 || value > max) {
            console.error(error_message);
            continue;
        }
        return Math.floor(value);
    }
}






