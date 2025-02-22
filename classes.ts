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

    // Constructs an empty grid
    constructor(row_count: number, col_count: number) {

        if(row_count < 0 || col_count < 0)
            throw new NegativeGridError(row_count, col_count);

        this.grid = Array<Array<Cell>>(row_count).fill(Array<Cell>(col_count).fill(new Cell("empty", "unrevealed")))
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
        if(this.is_valid_index(row, col))
            return this.grid[row][col];
        else
            throw new InvalidIndexError(row, col, this.row_count, this.col_count);
    }
    
    /**
     * sets state to revealed at index (row, col)
     * @param row < row_count && row >= 0
     * @param col < col_count && col >= 0
     * @param type
     */
    set_type_at(row: number, col: number, type: CellType ) {
        if(this.is_valid_index(row, col))
            this.cell_at(row, col).set_type(type);
        else
            throw new InvalidIndexError(row, col, this.row_count, this.col_count);
    }

    /**
     * Updates the state of a cell at index (row, col)
     * @param row < row_count && row >= 0
     * @param col < col_count && col >= 0
     * @param state
     */
      set_state_at(row: number, col: number, state: CellState) {
        if(this.is_valid_index(row, col))
            this.cell_at(row, col).set_state(state);
        else
            throw new InvalidIndexError(row, col, this.row_count, this.col_count);
    }

    /**
     * Reveals all neighbors of a given index
     * @param row < row_count && row >= 0
     * @param col < col_count && col >= 0
     */
    reveal_neighbors(row: number, col: number) {

    }

    /**
     * Populates the grid with an @amount of mines at random indices, excluding those in blacklist
     * @param amount
     * @param blacklist 
     * Recursive ?
     */
    add_mines(amount: number, blacklist: Array<[number, number]> = []) {
        
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
    set_state(state: CellState): void {
        this.state = state;
    }

    // Updates the type of the cell
    set_type(type: CellType): void {
        this.type = type;
    }

};
