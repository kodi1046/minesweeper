
/**
 * GridError
 * trying to create more mines than available cells
 */
export class InvalidMinesError extends Error {
    constructor(mines: number, rows: number, cols: number) {
        super(`number of mines: ${mines} needs to be greater than 0 and less than total number of cells: ${rows * cols}`);
        this.name = "InvalidMinesError";
    };
}
/**
 * GridError
 * trying to create a grid with negative rows or columns
 */
export class NegativeGridError extends Error {
    constructor(rows: number, cols: number) {
        super(`number of rows: ${rows} and number of columns: ${cols} need to be positive integers`);
        this.name = "NegativeGridError";
    };
}

/**
 * GridError
 * trying to access an out of bounds cell in the grid
 */
export class InvalidIndexError extends Error {
    constructor(row: number, col: number, rows: number, cols: number) {
        super(`index row: ${row} must be greater than 0 and less than ${rows} and index col: ${col} must be greater than 0 and less than ${cols}`);
        this.name = "InvalidIndexError";
    }
}

export type GridError = NegativeGridError | InvalidIndexError | InvalidMinesError;

// export type CellError