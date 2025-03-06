import { Grid, Cell } from "../modules/classes";
import { player_move } from "../modules/game_module";

test('Invalid index', () => { 
    const grid = new Grid(3, 3, 0);
    expect(grid.is_valid_index(-1, 3)).toBe(false);
})

test('Reveal grid without any mines & win the game', () => { 
    const grid = new Grid(3, 3, 0);
    grid.reveal(1,1);
    const all_indices = grid.get_all_indices();
    const all_cells_revealed = all_indices.every(index => {return grid.cell_at(index[0], index[1]).get_state() === "revealed"});
    const game_won = grid.get_game_state() === "win";


    expect(all_cells_revealed && game_won).toBe(true);
})

test('Reveal a mine & lose the game', () => { 
    const grid = new Grid(3, 3, 0);
    grid.set_mine(1, 1);
    grid.reveal(1, 1);
    expect(grid.get_game_state()).toBe("lose");
})

test('Flag a cell', () => { 
    const grid = new Grid(3, 3, 0);
    grid.flag(1,1);
    expect(grid.cell_at(1, 1).get_state()).toBe("flagged");
  
})

test('Unflag a flagged cell', () => { 
    const grid = new Grid(3, 3, 0);
    grid.flag(1,1);
    grid.flag(1,1);
    expect(grid.cell_at(1, 1).get_state()).toBe("unrevealed");
  
})

test('Try to flag an already revealed cell', () => { 
    const grid = new Grid(3, 3, 0);
    grid.reveal(1, 1);
    grid.flag(1, 1);
    expect(grid.cell_at(1, 1).get_state()).toBe("revealed");
  
})

test('Get neighbors', () => { 
    const grid = new Grid(3, 3, 0);

    const neighbors = grid.get_neighbors(1,1);

    expect(neighbors).toEqual([[0,0],[0,1],[0,2],
                               [1,0],      [1,2],
                               [2,0],[2,1],[2,2]]);

})

test('Get neighbors at corner cell', () => { 
    const grid = new Grid(3, 3, 0);

    const neighbors = grid.get_neighbors(0,0);

    expect(neighbors).toEqual([[0,1],[1,0],[1,1]]);

})

test('Neighboring mine count increment upon setting a mine', () => { 
    const grid = new Grid(3, 3, 0);
    grid.set_mine(1, 1);
    expect(grid.get_neighbors(1, 1).every(neighbor => {return grid.cell_at(neighbor[0], neighbor[1]).get_neighboring_mine_count() === 1})).toBe(true);
})

test('Populate entire grid with mines', () => {
    const grid = new Grid(3, 3, 0);
    grid.populate_with_mines(9);
    const all_indices = grid.get_all_indices();
    expect(all_indices.every(index => {return grid.cell_at(index[0], index[1]).get_type() === "mine"})).toBe(true);
})

test('Populate all but center cell with mines', () => {
    const grid = new Grid(3, 3, 0);
    grid.populate_with_mines(100, [[1,1]]);

    const neighbors = grid.get_neighbors(1, 1);
    const neighbors_are_mines = neighbors.every((index) => grid.cell_at(index[0], index[1]).get_type() === "mine");
    const center_is_empty = grid.cell_at(1,1).get_type() === "empty";
    expect(neighbors_are_mines && center_is_empty).toBe(true);
})

test('Reveal all mines - grid full of mines', () => {
    const grid = new Grid(5, 5, 0);
    grid.populate_with_mines(25);

    grid.reveal_all_mines();

    const all_indices = grid.get_all_indices();
    expect(all_indices.every(index => {return grid.cell_at(index[0], index[1]).get_state() === "revealed"})).toBe(true);
})

test('Start with only possible mines at bottom row', () => { 
    const grid = new Grid(4, 3, 3);
    grid.game_start(1, 1)

    const bottom_row_mines: boolean = [[3,0], [3, 1], [3, 2]].every(index => grid.cell_at(index[0], index[1]).get_type() === "mine");

    expect(grid.get_empty_count() === 9 && bottom_row_mines).toBe(true);
})

