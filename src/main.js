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
    var row_count = get_game_setting("rows");
    var col_count = get_game_setting("columns");
    var mine_count = get_game_setting("mines");
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
 * asks the user for number of @type "rows" | "cols" | "mines"
 * @param type
 * @returns number of "rows" | "cols" | "mines"
 */
function get_game_setting(type) {
    while (true) {
        var input = prompt("input the desired number of ".concat(type, ": "));
        if (input === null) {
            console.error("invalid input");
            continue;
        }
        var parsed_input = parseInt(input);
        if (parsed_input <= 0 || isNaN(parsed_input)) {
            console.error("invalid input");
            continue;
        }
        return parsed_input;
    }
}
/**
 * Displays a given grid
 * @param grid
 */
function display_grid(grid) {
    var rows = grid.get_row_count();
    var cols = grid.get_col_count();
    // Print column markers
    var col_number_string = "   ";
    for (var col_number = 0; col_number < cols; col_number++) {
        col_number_string += " ".concat(col_number % 10);
    }
    console.log(col_number_string);
    console.log();
    //
    var row_number = 0; // Row marker
    for (var _i = 0, _a = grid.grid; _i < _a.length; _i++) {
        var row = _a[_i];
        var row_string = "".concat(row_number % 10, "  ");
        for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
            var cell = row_1[_b];
            var symbol = cell_symbol(cell);
            row_string += " ".concat(symbol);
        }
        console.log(row_string);
        row_number++;
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
 * Checks if given number is acceptable
 * @param message
 * @param max
 */
function int_input(message, max) {
    while (true) {
        var input = prompt(message);
        if (input === null) {
            console.error("Invalid input");
            continue;
        }
        var value = parseInt(input);
        if (isNaN(value) || value < 0 || value > max) {
            console.error("Invalid input.");
            continue;
        }
        return value;
    }
}
