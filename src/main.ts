import { Cell, Grid } from "../modules/classes";
import { Move, player_move, setup_environment } from "../modules/game_module";


import promptSync from 'prompt-sync';
const prompt = promptSync();


const MINE_SYMBOL = "*";
const FLAG_SYMBOL = "!";
const UNREVEALED_SYMBOL = "~";
const EMPTY_SYMBOL = " ";

function main() {
    const row_count = get_game_setting("rows");
    const col_count = get_game_setting("columns");
    const mine_count = get_game_setting("mines");

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


function get_player_move(grid : Grid): Move {
    const row: number = int_input("Enter the row number: ", grid.row_count - 1);  
    const col: number = int_input("Enter the col number: ", grid.col_count - 1);  

    let move_type : Move["type"] = "reveal";
    let choice: number = int_input("0 to flag and 1 to reveal: ", 1);
    if (choice === 0){
        move_type = "flag"
    }
    return {col: col, row: row, type: move_type};
}

/**
 * asks the user for number of @type "rows" | "cols" | "mines"
 * @param type 
 * @returns number of "rows" | "cols" | "mines"
 */
function get_game_setting(type: string): number {

    while (true){ 
        let input: string | null = prompt(`input the desired number of ${type}: `);

        if (input === null) {
            console.error("invalid input");
            continue;
        }
        let parsed_input : number = parseInt(input);

        if (parsed_input <= 0 || isNaN(parsed_input)) {
            console.error("invalid input");
            continue; 
        }
        return parsed_input;
    }
}

function display_grid(grid: Grid) {
    const rows = grid.get_row_count();
    const cols = grid.get_col_count();
    
    // Print column markers
    let col_number_string = "   ";
    for(let col_number = 0; col_number < cols; col_number++) {
        col_number_string += ` ${col_number % 10}`
    }
    console.log(col_number_string);
    console.log();
    
    //
    let row_number = 0; // Row marker
    for(const row of grid.grid) {
        let row_string = `${row_number % 10}  `;
        for (const cell of row) {
            const symbol = cell_symbol(cell);
                row_string += ` ${symbol}`;
        }
        console.log(row_string);
        row_number++;
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
                    const adjacent_mines = cell.get_adjacent_mines();
                    return adjacent_mines === 0 ? EMPTY_SYMBOL : adjacent_mines.toString()

                case "mine":
                    return MINE_SYMBOL;
            }
    }
}

/**
 * Checks if given number is acceptable
 * @param message 
 * @param max 
 */

function int_input(message: string, max: number): number {
    while (true) {
        let input: string | null = prompt(message);

        if (input === null) {
            console.error("Invalid input");
            continue;
        }
        const value: number = parseInt(input);

        if (isNaN(value) || value < 0 || value > max) {
            console.error("Invalid input.");
            continue;
        }
        return value;
    }
}






