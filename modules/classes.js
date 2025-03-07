"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = exports.Grid = void 0;
var errors_js_1 = require("./errors.js");
/**
 * Represents a grid of size (row_count * col_count), containting Cells...
 */
var Grid = /** @class */ (function () {
    /**
     * Constructs a grid of empty, unrevealed cells
     * @param row_count
     * @param col_count
     * @param desired_mine_count
     */
    function Grid(row_count, col_count, desired_mine_count) {
        if (row_count < 0 || col_count < 0) {
            throw new errors_js_1.NegativeGridError(row_count, col_count);
        }
        this.grid = [];
        for (var i = 0; i < row_count; i++) {
            var row = [];
            for (var j = 0; j < col_count; j++) {
                row.push(new Cell("empty", "unrevealed"));
            }
            this.grid.push(row);
        }
        // this.grid = Array.from({ length: row_count }, () => 
        //     Array.from({ length: col_count}, () => 
        //         new Cell("empty", "unrevealed")));
        this.row_count = row_count;
        this.col_count = col_count;
        this.desired_mine_count = desired_mine_count;
        this.safe_cells = this.get_empty_count();
        this.mine_count = 0;
        this.flag_count = 0;
        this.game_state = "undecided";
    }
    // Gets the number of rows
    Grid.prototype.get_row_count = function () {
        return this.row_count;
    };
    // Gets the number of columns
    Grid.prototype.get_col_count = function () {
        return this.col_count;
    };
    // Gets the number of mine cells
    Grid.prototype.get_mine_count = function () {
        return this.mine_count;
    };
    // Gets the number of empty cells
    Grid.prototype.get_empty_count = function () {
        return this.row_count * this.col_count - this.desired_mine_count;
    };
    // Gets the number of desired mines
    Grid.prototype.get_desired_mine_count = function () {
        return this.desired_mine_count;
    };
    // Gets the current state of the game
    Grid.prototype.get_game_state = function () {
        return this.game_state;
    };
    /**
     * Gets all indices of the grid
     * @returns Array of indices [number, number] representing all cells
     */
    Grid.prototype.get_all_indices = function () {
        var all_indices = [];
        for (var i = 0; i < this.row_count; i = i + 1) {
            for (var j = 0; j < this.col_count; j = j + 1) {
                all_indices.push([i, j]);
            }
        }
        return all_indices;
    };
    /**
     * Gets indices of all neighbors of a cell
     * @param row
     * @param col
     * @returns Array of indices [number, number] representing neighboring cells
     */
    Grid.prototype.get_neighbors = function (row, col) {
        var _this = this;
        var neighbors = [
            [row - 1, col - 1],
            [row - 1, col],
            [row - 1, col + 1],
            [row, col - 1],
            [row, col + 1],
            [row + 1, col - 1],
            [row + 1, col],
            [row + 1, col + 1],
        ];
        return neighbors.filter(function (index) { return _this.is_valid_index(index[0], index[1]); });
    };
    /**
     * Checks if a given index exists on the grid
     * @param row
     * @param col
     * @returns True if the index exists on the grid, false otherwise
     */
    Grid.prototype.is_valid_index = function (row, col) {
        return (row < this.row_count && row >= 0 &&
            col < this.col_count && col >= 0);
    };
    /**
     * Gets the cell at given index, only if index is valid
     * @param row
     * @param col
     * @returns Cell at [row, col]
     */
    Grid.prototype.cell_at = function (row, col) {
        if (this.is_valid_index(row, col)) {
            return this.grid[row][col];
        }
        else {
            throw new errors_js_1.InvalidIndexError(row, col, this.row_count, this.col_count);
        }
    };
    /**
     * Reveals a cell at a given index & sets game states
     * @param row
     * @param col
     */
    Grid.prototype.reveal = function (row, col) {
        var cell = this.cell_at(row, col);
        if (cell.get_state() === "unrevealed") {
            cell.set_state("revealed");
            // If cell is of type empty 
            if (cell.get_type() === "empty") {
                // Decrement number of remaining empty cells
                this.safe_cells--;
                // If no remaining empty cells to reveal, win the game
                if (this.safe_cells === 0) {
                    this.game_state = "win";
                }
                // If cell has no neighboring mines, reveal all neighbors
                if (cell.get_neighboring_mine_count() === 0) {
                    this.reveal_neighbors(row, col);
                }
            }
            // If revealed cell is a mine, lose the game
            if (cell.get_type() === "mine") {
                this.game_state = "lose";
                this.reveal_all_mines();
            }
        }
    };
    /**
     * Reveals neighbors at a given index
     * @param row
     * @param col
     */
    Grid.prototype.reveal_neighbors = function (row, col) {
        var _this = this;
        var neighbors = this.get_neighbors(row, col);
        neighbors.forEach(function (neighbor) { return _this.reveal(neighbor[0], neighbor[1]); });
    };
    /**
     * Flags / unflags a cell at a given index
     * @param row
     * @param col
     */
    Grid.prototype.flag = function (row, col) {
        var cell = this.cell_at(row, col);
        if (cell.get_state() === "unrevealed") {
            cell.set_state("flagged");
        }
        else if (cell.get_state() === "flagged") {
            cell.set_state("unrevealed");
        }
    };
    /**
     * Populates the grid with an @amount of mines at random indices, excluding those in @blacklist
     * @param amount amount of mines to fill the grid with
     * @param blacklist the indices not to be filled with mines
     * Recursive
     */
    Grid.prototype.populate_with_mines = function (amount, blacklist) {
        if (blacklist === void 0) { blacklist = []; }
        var grid = this;
        function add_mine(amount, whitelist) {
            if (amount > 0 && whitelist.length > 0) {
                // Select a random cell-index from whitelist
                var random_number = Math.floor(Math.random() * whitelist.length);
                var row = whitelist[random_number][0];
                var col = whitelist[random_number][1];
                // Set the cell corresponding to the selected cell-index from whitelist into a mine
                grid.set_mine(row, col);
                // Remove the cell-index from whitelist
                whitelist.splice(random_number, 1);
                add_mine(amount - 1, whitelist);
            }
        }
        // Store all indices of the grid in an array
        var all_indices = this.get_all_indices();
        // Create a whitelist containing all indices not found in blacklist
        var whitelist = all_indices.filter(function (index) {
            return !blacklist.some(function (blacklisted_index) { return index[0] === blacklisted_index[0] && index[1] === blacklisted_index[1]; });
        });
        add_mine(amount, whitelist);
    };
    /**
     * Sets a mine at the given index and increments neighboring_mine_count of each neighbor
     * @param row
     * @param col
     */
    Grid.prototype.set_mine = function (row, col) {
        var _this = this;
        // Acquire the indices of each of the mine's neighbors
        var neighbors = this.get_neighbors(row, col);
        // Increments mine_count for each neighbor of the mine
        neighbors.forEach(function (cell_index) {
            var neighbor = _this.cell_at(cell_index[0], cell_index[1]);
            neighbor.neighboring_mine_count++;
        });
        // Set the type of the cell to "mine"
        this.cell_at(row, col).set_type("mine");
    };
    /**
     * Reveals all mine cells
     */
    Grid.prototype.reveal_all_mines = function () {
        var _this = this;
        var all_indices = this.get_all_indices();
        all_indices.forEach(function (index) {
            if (_this.cell_at(index[0], index[1]).get_type() === "mine") {
                _this.reveal(index[0], index[1]);
            }
        });
    };
    /**
     * Fills the grid with mines excluding the area directly neighboring the starting cell
     * @param row - row of starting cell
     * @param col - col of starting cell
     */
    Grid.prototype.game_start = function (row, col) {
        // Create a 3x3 starting area to be excluded from mine generation
        var start = this.get_neighbors(row, col);
        start.push([row, col]);
        //Populate the grid with mines
        this.populate_with_mines(this.get_desired_mine_count(), start);
    };
    return Grid;
}());
exports.Grid = Grid;
;
/**
 * A cell with a type and a state
 */
var Cell = /** @class */ (function () {
    /**
     * Creates a cell with a type and a state
     * @param type
     * @param state
     */
    function Cell(type, state) {
        this.type = type;
        this.state = state;
        this.neighboring_mine_count = 0;
    }
    // Gets the type of the cell
    Cell.prototype.get_type = function () {
        return this.type;
    };
    // Gets the state of the cell
    Cell.prototype.get_state = function () {
        return this.state;
    };
    // Updates the state of the cell
    Cell.prototype.set_state = function (state) {
        this.state = state;
    };
    // Updates the type of the cell
    Cell.prototype.set_type = function (type) {
        this.type = type;
    };
    // Gets numbers of adjacent mines
    Cell.prototype.get_neighboring_mine_count = function () {
        return this.neighboring_mine_count;
    };
    return Cell;
}());
exports.Cell = Cell;
;
