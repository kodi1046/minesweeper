import { Cell, Grid } from "../modules/classes";
import { Move, player_move, setup_environment } from "../modules/game_module";

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

        const move: Move = get_player_move();
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
}

main();

// TODO
function get_player_move(): Move {
    const row : number = get_user_input("row");
    const col : number = get_user_input("col");

    let move_type : Move["type"] = "reveal";
    const choice = get_user_input("0 to flag and 1 to reveal")
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
        const input: string | null = prompt(`input the desired number of ${type}`);

        if (input === null) {
            console.error("invalid input");
            continue;
        }
        const parsed_input : number = parseInt(input);

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
                    const adjacent_mines = cell.get_adjacent_mines();
                    return adjacent_mines === 0 ? EMPTY_SYMBOL : adjacent_mines.toString()

                case "mine":
                    return MINE_SYMBOL;
            }
    }
}


/**
 * asks the user for number of @type "rows" | "cols" | "mines"
 * @param type 
 * @returns number of "rows" | "cols" | "mines"
 */
function get_user_input(type: string): number {
    while (true){ 
        const input: string | null = prompt(`input the desired number of ${type}`);
        if (input === null){
            console.error("Please provide an input")
            continue;
        }
        const parsed_input : number = parseInt(input);

        // check if it's not a number or it's less than or equal to 0
        if (isNaN(parsed_input) || parsed_input <= 0){
            console.error("invalid input");
            continue;
        }
        return parsed_input;
    }
}







