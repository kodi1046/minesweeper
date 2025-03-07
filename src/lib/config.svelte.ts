
import { 
    MIN_ROW_COUNT, 
    MAX_ROW_COUNT, 
    MIN_COL_COUNT, 
    MAX_COL_COUNT, 
    MIN_MINES_COUNT, 
    MAX_MINES_COUNT,
    FLAG_SYMBOL,
    MINE_SYMBOL,
    EMPTY_SYMBOL,
    UNREVEALED_SYMBOL,
 } from "$lib"
import { Cell, Grid } from './game_logic/modules/classes';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';



export const global_state = $state({
    row_val: 7,
    col_val: 7,
    mine_val: 7,
})

export function get_grid() {
    return grid;
}

const grid: Grid = $derived(new Grid(global_state.row_val, global_state.col_val, global_state.mine_val));


