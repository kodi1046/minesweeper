"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var classes_js_1 = require("../modules/classes.js");
var game_module_js_1 = require("../modules/game_module.js");
var promptSync = require("prompt-sync");
var prompt = promptSync();
var MINE_SYMBOL = "*";
var FLAG_SYMBOL = "!";
var UNREVEALED_SYMBOL = "~";
var EMPTY_SYMBOL = " ";
function main() {
    // Get settings for the game
    var row_count = int_input("Input the desired number of rows: ");
    var col_count = int_input("Input the desired number of columns: ");
    var mine_count = int_input("Input the desired number of mines: ");
    // Construct the grid
    var grid = new classes_js_1.Grid(row_count, col_count, mine_count);
    // Game loop
    while (true) {
        display_grid(grid);
        var move = get_player_move(grid);
        var result = (0, game_module_js_1.player_move)(move, grid);
        if (result === "win") {
            console.log("You win!");
            break;
        }
        if (result === "lose") {
            console.log("You lose!");
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
function get_player_move(grid) {
    var row = int_input("Enter the row number: ", grid.row_count - 1);
    var col = int_input("Enter the col number: ", grid.col_count - 1);
    var move_type = "reveal";
    var choice = int_input("0 to flag and 1 to reveal: ", 1);
    if (choice === 0) {
        move_type = "flag";
    }
    return { col: col, row: row, type: move_type };
}
/**
 * Displays a given grid
 * @param grid
 */
function display_grid(grid) {
    var cols = grid.get_col_count();
    // Print column markers
    var col_marker_string = "   ";
    for (var col_number = 0; col_number < cols; col_number++) {
        col_marker_string += " ".concat(col_number % 10);
    }
    console.log(col_marker_string);
    console.log();
    var row_marker = 0;
    for (var _i = 0, _a = grid.grid; _i < _a.length; _i++) {
        var row = _a[_i];
        var row_string = "".concat(row_marker % 10, "  ");
        for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
            var cell = row_1[_b];
            var symbol = cell_symbol(cell);
            row_string += " ".concat(symbol);
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
function cell_symbol(cell) {
    switch (cell.get_state()) {
        case "flagged":
            return FLAG_SYMBOL;
        case "unrevealed":
            return UNREVEALED_SYMBOL;
        case "revealed":
            switch (cell.get_type()) {
                case "empty":
                    var adjacent_mines = cell.get_neighboring_mine_count();
                    return adjacent_mines === 0 ? EMPTY_SYMBOL : adjacent_mines.toString();
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
function int_input(message, max, error_message) {
    if (max === void 0) { max = Infinity; }
    if (error_message === void 0) { error_message = "Invalid input"; }
    while (true) {
        var input = prompt(message);
        if (input === null) {
            console.error(error_message);
            continue;
        }
        var value = parseInt(input);
        if (isNaN(value) || value < 0 || value > max) {
            console.error(error_message);
            continue;
        }
        return Math.floor(value);
    }
}
