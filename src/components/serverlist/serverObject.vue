<script>
export default {
    props: ["address", "image", "index", "isActiveServerDisplay"],
    inject: ['serverList', 'activeServerIndex'],
    created() {
        // props are exposed on `this`
        console.log(`This is happening in serverObject.vue`, this.address)
    },
    methods: {
        deactivateProxy(index) {
            console.log(`Proxy de-activation requested for index ${index}`)
            window.ipcRenderer.send('toMain', { command: 'deactivateProxy', index })
        },
        activateProxy(index) {
            console.log(`Proxy activation requested for index ${index}`)
            window.ipcRenderer.send('toMain', { command: 'activateProxy', index })
        },
        deleteServer(index) {
            console.log(`Server deletion requested for index ${index}`)
            window.ipcRenderer.send('toMain', { command: 'deleteServer', index })
        },
        serverSettings(index) {
            console.log(`Server settings requested for index ${index}`)
        }
    },
    
}
</script>

<template>
    <div v-if="isActiveServerDisplay && activeServerIndex == -1" class="serverObject inactive">
        <div class="so-inactive-textbox">
            <h2>No server active</h2>
            <p>Click the <em>activate</em> button on a server below to start the proxy</p>
        </div>
    </div>
    <div v-else-if="isActiveServerDisplay && activeServerIndex != -1" class="serverObject active">
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
                    <span class="data">{{serverList[activeServerIndex].address}}</span>
                </div>
            </div>
        </div>
        <div class="so-stack buttonstack">
            <button type="button" class="btn btn-secondary btn-sm" @click="deactivateProxy(index)"><i class="bi bi-power"></i></button>
        </div>
    </div>
    <div v-else-if="!serverList[index].active" class="serverObject">
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
            <button type="button" class="btn btn-success btn-sm" @click="activateProxy(index)"><i class="bi bi-power"></i></button>
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
        box-shadow: 0px 1px 24px -7px rgba(0,0,0,0.75);
    }

    .serverObject.inactive {
        background: linear-gradient(0deg, #515e6b, #6d7e8e);
        padding: 8px;
    }

    .serverObject.active {
        background: linear-gradient(0deg, #1c1c1d, #2b2c2d);
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

    .so-inactive-textbox {
        width:100%;
        flex-grow: 1;
        border-style: dashed;
        border-color: #7e868f;
        border-radius: 7px;
        display: flex;
        flex-direction: column;
        align-items: center;
        
    }

    .so-inactive-textbox h2 {
        color: #9faab6;
        font-size: 17px;
        text-align: center;
        margin-top: 7px;
        margin-bottom: 2px;
    }

    .so-inactive-textbox p {
        color: #7e868f;
        font-size: 15px;
        text-align: center;
        margin-bottom: 4px;
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

    .serverObject.active .srv-infoChip > .label {
        color: #a7a7a7!important;
    }

    .srv-infoChip > .data {
        color: var(--bodytext-color);
        font-size: 14px;
        font-weight: 500;
        margin-top: -3px;
    }

    .serverObject.active .srv-infoChip > .data {
        color: white!important;
    }

    .so-buttonbox {
        flex-direction: row-reverse;
        align-items: flex-end;
    }
</style>