

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
        this.mines = mines;
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
     * @param col < cols
     * @param row < rows
     */
    cell_at(col: number, row: number): Cell {

    }

    /**
     * inserts cell at index (i,j) in grid
     * @param col < cols
     * @param row < rows
     * @param cell 
     */
    insert(col: number, row: number, cell: Cell) {

    }

    /**
     * sets covered to true at index (row, col)
     * @param row < rows
     * @param col < cols
     */
    reveal_at(row: number, col: number) {
        
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
    constructor(state: CellState) {
        this.state = state;
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
        
    }

    /**
     * changes the state of the cell
     * @param state 
     */
    change_state(state: CellState) {
        this.state = state;
    }

    /**
     * changes the type of the cell
     * @param type 
     */
    change_type(type: CellType) {
        this.type = type;
    }

};


type CellType = "mine" | "empty";

type CellState = "revealed" | "unrevealed" | "flagged";

type CellGrid = Array<Array<Cell>>;

