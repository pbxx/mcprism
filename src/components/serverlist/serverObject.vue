<script>
export default {
    props: ["address", "image", "index"],
    created() {
        // props are exposed on `this`
        console.log(this.address)
    },
    methods: {
        deleteServer(index) {
            console.log(`Server deletion requested for index ${index}`)
            window.ipcRenderer.send('toMain', { command: 'deleteServer', index })
        },
        serverSettings(index) {
            console.log(`Server settings requested for index ${index}`)
        }
    }
}
</script>

<template>
    <div class="serverObject">
        <div class="so-stack">
            <div class="ic-left">
                <img src="../../assets/img/mc-block.png" />
            </div>
            <div class="ic-right">
                <div class="srv-infoChip">
                        <span class="label">Name:</span>
                        <span class="data">Loading server info...</span>
                    
                </div>
                <div class="srv-infoChip">
                    <span class="label">Address:</span>
                    <span class="data">{{address}}</span>
                </div>
            </div>
        </div>
        <div class="so-stack buttonstack">
            <button type="button" class="btn btn-secondary btn-sm" @click="serverSettings(index)"><i class="bi bi-gear-fill"></i></button>
            <button type="button" class="btn btn-danger btn-sm" @click="deleteServer(index)"><i class="bi bi-trash-fill"></i></button>
        </div>
    </div>
</template>

<style>
    .serverObject {
        background-color: #c8c8c8;
        border-radius: 9px;
        margin: 9px 18px 12px 18px;
        padding: 12px;
        display: grid;
    }

    .so-stack {
        grid-column: 1;
        grid-row: 1;
        display: flex;
    }

    .so-stack > .ic-left img {
        height: 68px;

    }

    .so-stack > .ic-right {
        display: flex;
        flex-direction: column;
        font-family: "Open Sans Regular";

    }

    .buttonstack {
        align-items: flex-end;
        justify-content: flex-end;
        display: none;
    }

    .serverObject:hover .buttonstack {
        display: flex;
    }

    .buttonstack > button {
        margin-left: 4px;
    }

    .srv-infoChip {
        display: flex;
        flex-direction: column;
        font-family: "Open Sans Regular";
        padding: 0 8px 0 8px;

    }

    .srv-infoChip > .label {
        color: var(--bodytext-color);
        font-size: 10px;
        font-weight: 700;
    }

    .srv-infoChip > .data {
        color: var(--bodytext-color);
        font-size: 14px;
        font-weight: 500;
        margin-top: -3px;
    }

    .so-buttonbox {
        flex-direction: row-reverse;
        align-items: flex-end;
    }
</style>