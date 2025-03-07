import { GridError, InvalidMinesError, NegativeGridError, InvalidIndexError } from "./errors.js";

type CellGrid = Array<Array<Cell>>;
type GameState = "win" | "lose" | "undecided";

/**
 * Represents a grid of size (row_count * col_count), containting Cells...   
 */
export class Grid {
    
    //Properties
    grid: CellGrid; 
    row_count: number; // Number of rows
    col_count: number; // Number of columns
    mine_count: number; // Number of mines
    desired_mine_count: number // Number of desired mines 
    safe_cells: number; // Number of unrevealed empty cells
    flag_count: number; // Number of flagged cells
    game_state: GameState; // State of the game
    
    /**
     * Constructs a grid of empty, unrevealed cells
     * @param row_count
     * @param col_count
     * @param desired_mine_count
     */
    constructor(row_count: number, col_count: number, desired_mine_count: number) {

        if(row_count < 0 || col_count < 0) {
            throw new NegativeGridError(row_count, col_count);
        }
        this.grid = [];
        for (let i = 0; i < row_count; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < col_count; j++) { 
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
    get_row_count(): number {
        return this.row_count;
    }

    // Gets the number of columns
    get_col_count(): number {
        return this.col_count;
    }

    // Gets the number of mine cells
    get_mine_count(): number {
        return this.mine_count;
    }

    // Gets the expected number of empty cells according to desired_mine_count
    get_empty_count(): number {
        const empty_count = this.row_count * this.col_count - this.desired_mine_count;
        return empty_count > 0 ? empty_count : 1;
    }

    // Gets the number of desired mines
    get_desired_mine_count(): number {
        return this.desired_mine_count;
    }

    // Gets the current state of the game
    get_game_state(): GameState {
        return this.game_state
    }
    
    /**
     * Gets all indices of the grid
     * @returns Array of indices [number, number] representing all cells
     */
    get_all_indices(): Array<[number, number]> {
        const all_indices: Array<[number, number]> = [];
        for(let i = 0; i < this.row_count; i = i + 1) {
            for(let j = 0; j < this.col_count; j = j + 1) {
                all_indices.push([i, j]);
            }
        }
        return all_indices;
    }

    /**
     * Gets indices of all neighbors of a cell
     * @param row
     * @param col
     * @returns Array of indices [number, number] representing neighboring cells
     */
    get_neighbors(row : number, col : number): Array<[number, number]> {
        const neighbors: Array<[number, number]> = 
                        [
                        [row - 1, col - 1],
                        [row - 1, col],
                        [row - 1, col + 1],
                        [row, col - 1],
                        [row, col + 1],
                        [row + 1, col - 1],
                        [row + 1, col],
                        [row + 1, col + 1],
                        ]
        return neighbors.filter((index) => this.is_valid_index(index[0], index[1]));
    }
    
    /**
     * Checks if a given index exists on the grid
     * @param row 
     * @param col 
     * @returns True if the index exists on the grid, false otherwise
     */
    is_valid_index(row: number, col: number): boolean {
        return (row < this.row_count && row >= 0 && 
                col < this.col_count && col >= 0)
    }

    /**
     * Gets the cell at given index, only if index is valid
     * @param row 
     * @param col 
     * @returns Cell at [row, col]
     */
    cell_at(row: number, col: number): Cell {
        if(this.is_valid_index(row, col)) {
            return this.grid[row][col];
        }
        else {
            throw new InvalidIndexError(row, col, this.row_count, this.col_count);
        }
    }

    /**
     * Reveals a cell at a given index & sets game states
     * @param row 
     * @param col 
     */
    reveal(row: number, col: number) {
        const cell = this.cell_at(row, col);
        if(cell.get_state() === "unrevealed")
        {
            cell.set_state("revealed");

            // If cell is of type empty 
            if(cell.get_type() === "empty"){
                
                // Decrement number of remaining empty cells
                this.safe_cells--;

                // If no remaining empty cells to reveal, win the game
                if(this.safe_cells === 0) {
                    this.game_state = "win";
                    this.flag_all_mines();
                }

                // If cell has no neighboring mines, reveal all neighbors
                if(cell.get_neighboring_mine_count() === 0) {
                    this.reveal_neighbors(row, col);
                }
            }

            // If revealed cell is a mine, lose the game
            if(cell.get_type() === "mine") {
                this.game_state = "lose";
                this.reveal_all_mines();
            }
            
        }
    }

    /**
     * Reveals neighbors at a given index
     * @param row 
     * @param col 
     */
    reveal_neighbors(row: number, col: number) {
        const neighbors: Array<[number, number]> = this.get_neighbors(row, col);
        neighbors.forEach((neighbor) => this.reveal(neighbor[0], neighbor[1]));
    }
    

    /**
     * Flags / unflags a cell at a given index
     * @param row 
     * @param col 
     */
    flag(row: number, col: number) {
        const cell = this.cell_at(row, col);
        if(cell.get_state() === "unrevealed") {
            cell.set_state("flagged");
        } else if (cell.get_state() === "flagged") {
            cell.set_state("unrevealed");
        }
    }

    /**
     * Populates the grid with an @amount of mines at random indices, excluding those in @blacklist
     * @param amount amount of mines to fill the grid with
     * @param blacklist the indices not to be filled with mines
     * Recursive
     */
    populate_with_mines(amount: number, blacklist: Array<[number, number]> = []) {
        const grid = this;

        function add_mine(amount: number, whitelist: Array<[number, number]>) {
            if (amount > 0 && whitelist.length > 0) {
            // Select a random cell-index from whitelist
            const random_number = Math.floor(Math.random() * whitelist.length);
            const row = whitelist[random_number][0];
            const col = whitelist[random_number][1];

            // Set the cell corresponding to the selected cell-index from whitelist into a mine
            grid.set_mine(row, col);

            // Remove the cell-index from whitelist
            whitelist.splice(random_number, 1);

            add_mine(amount - 1, whitelist);
            }
        }
        
        // Store all indices of the grid in an array
        const all_indices = this.get_all_indices();

        // Create a whitelist containing all indices not found in blacklist
        const whitelist = all_indices.filter((index) =>
             !blacklist.some((blacklisted_index) => index[0] === blacklisted_index[0] && index[1] === blacklisted_index[1]));

        
        add_mine(amount, whitelist);
    }

    /**
     * Sets a mine at the given index and increments neighboring_mine_count of each neighbor
     * @param row 
     * @param col 
     */
    set_mine(row: number, col: number) {

        // Acquire the indices of each of the mine's neighbors
        const neighbors: Array<[number, number]> = this.get_neighbors(row, col);
        
        // Increments mine_count for each neighbor of the mine
        neighbors.forEach((cell_index) => { const neighbor = this.cell_at(cell_index[0], cell_index[1])
                                            neighbor.neighboring_mine_count++; });

        // Set the type of the cell to "mine"
        this.cell_at(row, col).set_type("mine");
    }

    /**
     * Reveals all mine cells, except those that have been flagged
     */
    reveal_all_mines() {
        const all_indices = this.get_all_indices();
        all_indices.forEach((index) => {
            if(this.cell_at(index[0], index[1]).get_type() === "mine") {
                this.reveal(index[0], index[1]); 
            } 
        });
    }

    /**
     * Flags all mine cells
     */
    flag_all_mines() {
        const all_indices = this.get_all_indices();
        all_indices.forEach((index) => {
            if(this.cell_at(index[0], index[1]).get_type() === "mine") {
                this.cell_at(index[0], index[1]).set_state("flagged");
            } 
        });
    }


    /**
     * Fills the grid with mines excluding the area directly neighboring the starting cell
     * @param row - row of starting cell
     * @param col - col of starting cell
     */
    game_start(row: number, col: number) { 
        // Create a 3x3 starting area to be excluded from mine generation
        let start: Array<[number, number]> = [];
        const neighbors = this.get_neighbors(row, col);

        if(this.get_row_count() * this.get_col_count() >= this.desired_mine_count + neighbors.length) {
            start = neighbors;
        }
    
        // Exclude the selected cell from mine generation
        start.push([row, col]);

        //Populate the grid with mines
        this.populate_with_mines(this.get_desired_mine_count(), start);
    }
};

type CellType = "mine" | "empty";
type CellState = "revealed" | "unrevealed" | "flagged";

/**
 * A cell with a type and a state
 */
export class Cell {

    // Properties
    type: CellType;
    state: CellState;
    neighboring_mine_count: number;

    /**
     * Creates a cell with a type and a state
     * @param type 
     * @param state 
     */
    constructor(type: CellType, state: CellState) {
        this.type = type;   
        this.state = state;
        this.neighboring_mine_count = 0;
    }

    // Gets the type of the cell
    get_type(): CellType {
        return this.type;
    }

    // Gets the state of the cell
    get_state(): CellState {
        return this.state;
    }

    // Updates the state of the cell
    set_state(state: CellState) {
        this.state = state;
    }

    // Updates the type of the cell
    set_type(type: CellType) {
        this.type = type;
    }

    // Gets numbers of adjacent mines
    get_neighboring_mine_count(): number {
        return this.neighboring_mine_count;
    }
};
