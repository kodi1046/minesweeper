
<script lang="ts">
    import Cell from './Cell.svelte';
    import { CELL_HEIGHT, CELL_WIDTH, CELL_GAP, GRID_PADDING, global_state } from '$lib';
    import type { Grid } from '$lib/game_logic/modules/classes';
    let { grid }: { grid: Grid } = $props();

</script>
<div class = "grid"
    style = "width: calc({CELL_WIDTH * grid.get_col_count()}px + {CELL_GAP * (grid.get_col_count() - 1)}px); 
            height: calc({CELL_HEIGHT * grid.get_row_count()}px + {CELL_GAP * (grid.get_row_count() - 1)}px);
            grid-template-rows: repeat({grid.get_row_count()}, {CELL_WIDTH}px);
            grid-template-columns: repeat({grid.get_col_count()}, {CELL_HEIGHT}px);
            gap: {CELL_GAP}px;
            padding: {GRID_PADDING}px;">
        {#each Array(grid.get_row_count()).fill(null) as _, row}
            {#each Array(grid.get_col_count()).fill(null) as _, col}
                <Cell row = {row} col = {col}/>
            {/each}
        {/each}
</div>
<style>
    .grid {
        background-color: darkgray; 
        display: grid;
        align-content: center;
        justify-content: center;
        border-radius: 8px; 
        padding: 50px;
    }

</style>
