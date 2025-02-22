import { GridError, InvalidMinesError, NegativeGridError, InvalidIndexError } from "./errors";

/**
 * the grid (n x m) (Array matrix). containing l mines, k empty cells. l + k = m*n. 
 */
export class Grid {
    //properties
    grid: CellGrid;
    mines: number;
    rows: number;
    cols: number;

    /**
     * constructs a grid
     * @param mines > 0
     * @param rows 
     * @param cols 
     */
    constructor(mines: number, rows: number, cols: number) {
        if (mines < rows * cols && mines > 0) {
            this.mines = mines;
        } else {
            throw new InvalidMinesError(mines, rows, cols);
        }

        if (rows <= 0 || cols <= 0) {
            throw new NegativeGridError(rows, cols);
        }
        
        this.rows = rows;
        this.cols = cols;
    }

    /**
     * gets the number of rows of the grid
     */
    get_rows(): number {
        return this.rows;
    }

    /**
     * gets the number of cols of the grid
     */
    get_cols(): number {
        return this.cols;
    }

    /**
     * gets the number of mines of the grid
     */
    get_mines(): number {
        return this.mines;
    }

    /**
     * gets the number of empty cells of the grid
     */
    get_empties(): number {
        return this.rows * this.cols - this.mines;
    }

    /**
     * gets the cell at index (row,col) in the grid
     * @param row < rows
     * @param col < cols
     */
    cell_at(row: number, col: number): Cell {
        if ((row < this.rows && col < this.cols) && (row >= 0 && col >= 0)) {
            return this.grid[row][col];
        } else {
            throw new InvalidIndexError(row, col, this.rows, this.cols);
        }   
    }

    /**
     * inserts cell at index (row, col) in grid
     * @param row < rows
     * @param col < cols
     * @param cell 
     */
    insert_at(row: number, col: number, cell: Cell) {
        if ((row < this.rows && col < this.cols) && (row >= 0 && col >= 0)) {
            this.grid[row][col] = cell;
        } else {
            throw new InvalidIndexError(row, col, this.rows, this.cols);
        }
    }

    /**
     * sets state to revealed at index (row, col)
     * @param row < rows
     * @param col < cols
     */
    reveal_at(row: number, col: number) {
        if ((row < this.rows && col < this.cols) && (row >= 0 && col >= 0)) {
            this.grid[row][col].reveal()
        } else {
            throw new InvalidIndexError(row, col, this.rows, this.cols);
        }
    }

    /**
     * reveals all neighbor cells
     */
    reveal_neighbors() {

    }

    /**
     * generates the given grid
     */
    generate() {
        this.grid = Array.from({ length: this.rows }, () => 
            Array.from({ length: this.cols}, () => 
                new Cell("empty")));
    }

};

/**
 * a grid cell. Has a state and a type
 */
export class Cell {
    // properties
    state: CellState = "unrevealed";
    type: CellType;

    /**
     * constructs a cell
     * @param row < rows
     * @param col < cols
     * @param state (either covered, uncovered or flagged)
     * @param type (either empty or mine)
     */
    constructor(type: CellType) {
        this.type = type;
    }
    /**
     * gets the state of the cell
     * @returns CellState
     */
    get_state(): CellState {
        return this.state;
    }

    /**
     *gets the type of the cell
     * @returns CellType
     */
    get_type(): CellType {
        return this.type;
    }

    /**
     * sets state to revealed
     */
    reveal() {
        this.state = "revealed";
    }

    /**
     * sets the state of the cell
     * @param state 
     */
    set_state(state: CellState) {
        this.state = state;
    }

    /**
     * sets the type of the cell
     * @param type 
     */
    set_type(type: CellType) {
        this.type = type;
    }

};


type CellType = "mine" | "empty";

type CellState = "revealed" | "unrevealed" | "flagged";

type CellGrid = Array<Array<Cell>>;

