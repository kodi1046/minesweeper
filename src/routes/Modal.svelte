<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<script lang="ts">
    import { MIN_COL_COUNT, MAX_COL_COUNT, MIN_MINES_COUNT, MAX_MINES_COUNT, MIN_ROW_COUNT, MAX_ROW_COUNT, global_state } from "$lib";
    let { is_open, on_close }: { is_open: boolean, on_close: (_: void) => void } = $props();
    function handle_backdrop_click(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            on_close();
        }
    }
    
    
</script>

{#if is_open}
    <div class = "popup" onclick = {handle_backdrop_click}>
        <div class = "popup_content">
            <div class = "card">
                <div>
                    <input type = "range" min = {MIN_ROW_COUNT} max = {MAX_ROW_COUNT} bind:value = {global_state.row_val}  class = "row_count_slider">
                    <p>row count: {global_state.row_val}</p>
                </div>
                <div>
                    <input type = "range" min = {MIN_COL_COUNT} max = {MAX_COL_COUNT} bind:value = {global_state.col_val} class = "col_count_slider">
                    <p>col count: {global_state.col_val}</p>
                </div>
                <div>
                    <input type = "range" min = {MIN_MINES_COUNT} max = {global_state.row_val * global_state.col_val - 1} bind:value = {global_state.mine_val} class = "mine_count_slider">
                    <p>mine count: {global_state.mine_val}</p>
                </div>
                <button class = "reset_button">
                    <i class="fa-sharp-duotone fa-solid fa-rotate-right"></i>
                </button>
                <button>
                    start
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); 
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; 
    }

    .card {
        display: flex;
        justify-content: space-between;
        background-color: darkgray;
        border-radius: 8px;
        align-items: center;
    }

    

</style>

