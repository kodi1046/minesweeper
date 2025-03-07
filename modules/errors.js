"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidIndexError = exports.NegativeGridError = exports.InvalidMinesError = void 0;
/**
 * GridError
 * trying to create more mines than available cells
 */
var InvalidMinesError = /** @class */ (function (_super) {
    __extends(InvalidMinesError, _super);
    function InvalidMinesError(mines, rows, cols) {
        var _this = _super.call(this, "number of mines: ".concat(mines, " needs to be greater than 0 and less than total number of cells: ").concat(rows * cols)) || this;
        _this.name = "InvalidMinesError";
        return _this;
    }
    ;
    return InvalidMinesError;
}(Error));
exports.InvalidMinesError = InvalidMinesError;
/**
 * GridError
 * trying to create a grid with negative rows or columns
 */
var NegativeGridError = /** @class */ (function (_super) {
    __extends(NegativeGridError, _super);
    function NegativeGridError(rows, cols) {
        var _this = _super.call(this, "number of rows: ".concat(rows, " and number of columns: ").concat(cols, " need to be positive integers")) || this;
        _this.name = "NegativeGridError";
        return _this;
    }
    ;
    return NegativeGridError;
}(Error));
exports.NegativeGridError = NegativeGridError;
/**
 * GridError
 * trying to access an out of bounds cell in the grid
 */
var InvalidIndexError = /** @class */ (function (_super) {
    __extends(InvalidIndexError, _super);
    function InvalidIndexError(row, col, rows, cols) {
        var _this = _super.call(this, "index row: ".concat(row, " must be greater than 0 and less than ").concat(rows, " and index col: ").concat(col, " must be greater than 0 and less than ").concat(cols)) || this;
        _this.name = "InvalidIndexError";
        return _this;
    }
    return InvalidIndexError;
}(Error));
exports.InvalidIndexError = InvalidIndexError;
// export type CellError
