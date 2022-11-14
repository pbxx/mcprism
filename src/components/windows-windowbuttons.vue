<script>
export default {
    methods: {
        closeWindow: function() {
            console.log(`Window close requested...`)
            window.ipcRenderer.send('toMain', { command: 'closeWindow' })
        },
        minimizeWindow: function() {
            console.log(`Window minimize requested...`)
            window.ipcRenderer.send('toMain', { command: 'minimizeWindow' })
        }
    }
}
</script>

<template>
    <div class="windowButtons">
        <button @click="closeWindow()"><i class="bi bi-x-lg close"></i></button>
        <button @click="minimizeWindow()" class="minButton"><i class="bi bi-dash-lg minimize"></i></button>
    </div>
</template>

<style>
:root {
    --wbuttons-height: 32px;
    --wbuttons-fontsize: 12px;
}

.windowButtons {
    height: var(--d-navH)!important;
    width: 100vw!important;
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: row-reverse!important;
    justify-content: flex-start!important;
    -webkit-app-region: drag;
}

.windowButtons button {
    border-style: none;
    background-color: transparent;
    height: var(--wbuttons-height);
    -webkit-app-region: no-drag;
    padding: 5px!important;
}

.windowButtons .minButton {
    padding: 5px 5px 0px 5px!important;
}

.windowButtons :nth-child(1) {
    padding: 5px 6px 5px 5px!important;
}

.windowButtons button > i {
    color: var(--bottomlink-inactive-color);
    margin: 0px;
    transition: 100ms;
}

.windowButtons button:hover > i {
    color: var(--bottomlink-active-color);

}
</style>
