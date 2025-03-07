

<script lang="ts">
    import { get, writable } from 'svelte/store';
    import { CELL_HEIGHT, CELL_WIDTH, EMPTY_SYMBOL, FLAG_SYMBOL, MINE_SYMBOL, UNREVEALED_SYMBOL } from '$lib';
    import type { Cell } from '$lib/game_logic/modules/classes';
    import { global_state, get_grid } from '$lib';
    let { row, col }: { 
        row: number, col: number
        } = $props();


    // copied from game logic main.ts
    function cell_symbol(cell: Cell): string {
        switch (cell.get_state()) {
            case "flagged":
                return FLAG_SYMBOL;
            case "unrevealed":
                return UNREVEALED_SYMBOL;
            case "revealed":
                switch (cell.get_type()) {
                    case "empty":
                        const adjacent_mines = cell.get_neighboring_mine_count();
                        return adjacent_mines === 0 ? EMPTY_SYMBOL : adjacent_mines.toString()

                    case "mine":
                        return MINE_SYMBOL;
                }
        }
    }
    
    function move_to_cell(event: MouseEvent) {
        event.preventDefault();
        const click: number = event.button; // 0 is left click and 2 is rightclick
        switch (click) {
            case 2:
                get_grid().cell_at(row, col).set_state("flagged");
            
            case 0:
                get_grid().cell_at(row, col).set_state("unrevealed");
            
        }
        
    }   
    ///
    

    
    
</script>

<div class = "cell" class:row = {row} class:col = {col} oncontextmenu={move_to_cell} onclick={move_to_cell}
    style = "width: {CELL_WIDTH}px; height: {CELL_HEIGHT}px;">
    <p>{cell_symbol(get_grid().cell_at(row, col))}</p>
</div>


<style>
    .cell {
        background-color: lightgray;
        border: 1px solid #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 4px;
        width: 100%; 
        height: 100%; 
        user-select: none;
    }
</style>