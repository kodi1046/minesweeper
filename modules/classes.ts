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
    desired_mines: number
    revealed_empty_count: number;

    // Constructs a grid of unrevealed empty cells
    constructor(row_count: number, col_count: number, desired_mines: number) {

        if(row_count < 0 || col_count < 0) {
            throw new NegativeGridError(row_count, col_count);
        }
        this.grid = Array.from({ length: row_count }, () => 
            Array.from({ length: col_count}, () => 
                new Cell("empty", "unrevealed")));

        this.row_count = row_count;
        this.col_count = col_count;
        this.desired_mines = desired_mines;
        this.mine_count = 0;
        this.revealed_empty_count = 0;
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
    

    /**
     * gets the neighbors of a given cell at @Index (@row, @col)
     * @param row 
     * @param col 
     */
    get_neighbors(row, col): Array<[number, number]> {
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

    // Checks if a given index is valid
    is_valid_index(row: number, col: number): boolean {
        return (row < this.row_count && row >= 0 && 
                col < this.col_count && col >= 0)
    }

    // checks if mines are valid
    is_valid_mines_count(mines: number): boolean {
        if (mines < 0 || mines > this.row_count || mines > this.col_count ) {
            return false;
        }
        return true;
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

    // Reveals a cell, reveals all neighboring cells if it has no neighboring mines
    reveal(row: number, col: number) 
    {
        // Handle initial reveal to populate grid with mines outside the starting area.
        if(this.revealed_empty_count === 0) {
            const start = this.get_neighbors(row, col);
            start.push([row, col]);
            this.populate_with_mines(this.desired_mines, start);
        }

        const cell = this.cell_at(row, col);
        
        if(cell.get_state() === "unrevealed") {
            if(cell.neighboring_mine_count === 0) {
                this.reveal_neighbors(row, col);
            }
            cell.set_state("revealed");

            // Increment the number of unrevealed empty cells
            if(cell.get_type() === "empty") {
            this.revealed_empty_count = this.revealed_empty_count + 1;
            }
        }
    }
    
    /*
    reveal_neighbors(row: number, col: number) {
        const neighbors: Array<[number, number]> = this.get_neighbors(row, col);
        unrevealed_neighbors.forEach((neighbor) => this.reveal(neighbor[0], neighbor[1]));
    }
    */

    /**
     * Reveals all neighbors of a given index
     * @param row < row_count && row >= 0
     * @param col < col_count && col >= 0
     */
    reveal_neighbors(row: number, col: number) {
        if (row < 0 || row >= this.row_count || col < 0 || col >= this.col_count) {
            return;
        }

        const cell : Cell = this.grid[row][col]; 

        // Ends recursion if cell is already revealed, or a mine
        if (cell.get_state() === "revealed" || cell.isMine()){
            return;
        }
        
        this.set_state_at(row, col, "revealed");


        // Ends recursion if cell has adjacent mines
        if(cell.get_adjacent_mines() > 0) {
            return;
        }

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
            grid.set_mine(row, col);

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

        // Create a whitelist containing all indices not found in blacklist
        const whitelist = all_indices.filter((index) =>
             !blacklist.some((blacklisted_index) => index[0] === blacklisted_index[0] && index[1] === blacklisted_index[1]));

        
        add_mine(amount, whitelist);
    }

    // Sets a mine at the given index and increments neighboring_mine_count of each neighbor
    set_mine(row: number, col: number) {

        // Acquire the indices of each of the mine's neighbors
        const neighbors: Array<[number, number]> = this.get_neighbors(row, col);
        
        // Increments mine_count for each neighbor of the mine
        neighbors.forEach((cell_index) => { const neighbor = this.cell_at(cell_index[0], cell_index[1])
                                            neighbor.neighboring_mine_count++; });

        // Set the type of the cell to "mine"
        this.cell_at(row, col).set_type("mine");
    }

    // checks if the board is in a state of winning (checks win-condition)
    has_won(): boolean {
        return this.revealed_empty_count === this.get_empty_count();
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
    neighboring_mine_count: number = 0;

    // Constructs a cell
    constructor(type: CellType, state: CellState) {
        this.type = type;   
        this.state = state;
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
        return this.neighboring_mine_count;
    }

};
