import { GridError, InvalidMinesError, NegativeGridError, InvalidIndexError } from "./errors";

type CellGrid = Array<Array<Cell>>;

/**
 * Represents a grid of size (row_count * col_count), containting Cells...   
 */
export class Grid {
    
    //Properties
    grid: CellGrid;
    row_count: number;
    col_count: number;
    mine_count: number;

    // Constructs a grid of unrevealed empty cells
    constructor(row_count: number, col_count: number) {

        if(row_count < 0 || col_count < 0) {
            throw new NegativeGridError(row_count, col_count);
        }
        this.grid = Array.from({ length: row_count }, () => 
            Array.from({ length: col_count}, () => 
                new Cell("empty", "unrevealed")));

        this.row_count = row_count;
        this.col_count = col_count;
        this.mine_count = 0;
    }


    // Gets the number of rows
    get_row_count(): number {
        return this.row_count;
    }

    // Gets the number of columns
    get_col_count(): number {
        return this.row_count;
    }

    // Gets the number of mine cells
    get_mine_count(): number {
        return this.mine_count;
    }

    // Gets the number of empty cells
    get_empty_count(): number {
        return this.row_count * this.col_count - this.mine_count;
    }

    // Checks if a given index is valid
    is_valid_index(row: number, col: number): boolean {
        return (row < this.row_count && row >= 0 && 
                col < this.col_count && col >= 0)
    }

    /**
     * Gets the cell at index (row, col)
     * @param row < row_count
     * @param col < col_count
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
     * sets state to revealed at index (row, col)
     * @param row < row_count && row >= 0
     * @param col < col_count && col >= 0
     * @param type
     */
    set_type_at(row: number, col: number, type: CellType ) {
        this.cell_at(row, col).set_type(type);
    }

    /**
     * Updates the state of a cell at index (row, col)
     * @param row < row_count && row >= 0
     * @param col < col_count && col >= 0
     * @param state
     */
      set_state_at(row: number, col: number, state: CellState) {
        this.cell_at(row, col).set_state(state);
    }

/**
 * Counts adjaacent mines of a cell
 * @param row < row_count && row >= 0
 * @param col < col_count && col >= 0
 */
    count_adjacent_mines(row: number, col: number): number {
        let count = 0;
    
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                };
    
                const new_row = row + i;
                const new_col = col + j;
    
                if (new_row >= 0 && new_row < this.row_count && new_col >= 0 && new_col < this.col_count) {
                    if (this.grid[new_row][new_col].isMine()) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    /**
     * Reveals all neighbors of a given index
     * @param row < row_count && row >= 0
     * @param col < col_count && col >= 0
     * Recursive
     */
    reveal_neighbors(row: number, col: number) {
        if (row < 0 || row >= this.row_count || col < 0 || col >= this.col_count) {
            return;
        }

        const cell : Cell = this.grid[row][col]; 

        // ends recursion when mine is adjecent or cell is already revealed
        if (cell.get_state() === "revealed" || cell.get_adjacent_mines() > 0){
            return;
        }
        
        this.set_state_at(row, col, "revealed");

        for(let i = -1; i <= 1; i++ ){
            for(let j = -1; j <= 1; j++){
                if (i === 0 && j === 0){
                    continue;
                }
                const new_row = row + i;
                const new_col = col + j;

                this.reveal_neighbors(new_row, new_col);
            }
        }
    }

    /**
     * Populates the grid with an @amount of mines at random indices, excluding those in @blacklist
     * @param amount
     * @param blacklist
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
            grid.cell_at(row, col).set_type("mine");

            // Remove the cell-index from whitelist
            whitelist.splice(random_number, 1);

            add_mine(amount - 1, whitelist);
            }
        }
        
        // Store all indices of the grid in an array
        const all_indices: Array<[number, number]> = [];
        for(let i = 0; i < this.row_count; i = i + 1) {
            for(let j = 0; j < this.col_count; j = j + 1) {
                all_indices.push([i, j]);
            }
        }

        // Filter out indices found in blacklist
        const whitelist = all_indices.filter((index) => !blacklist.some((blacklisted_index) => index[0] === blacklisted_index[0] && index[1] === blacklisted_index[1]));

        
        add_mine(amount, whitelist);
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
    adjacentMines: number;

    // Constructs a cell
    constructor(type: CellType, state: CellState) {
        this.type = type;   
        this.state = state;
        this.adjacentMines = 0;
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

    // Bool for mines
    isMine(): boolean {
        return this.type === "mine";
    }

    // Gets numbers of adjacent mines
    get_adjacent_mines(): number {
        return this.adjacentMines;
    }
};
