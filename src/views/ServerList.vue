<script>
export default {
    data() {
        return {
            serverList: [],
            serverAddress: ''
        }
    },
    mounted(){
        window.ipcRenderer.receive('fromMain', (arg) => {
            console.log(arg) // prints "pong" in the DevTools console
            if (arg.command == 'updateServers') {
                this.serverList = arg.serverList
            }
        })
    },
    methods: {
        addServer(test) {
            //test ipc
            console.log(test)
            window.ipcRenderer.send('toMain', { command: 'addServer', address: this.serverAddress, name: "Donnie's Minecraft Server" })
        },
        deleteServer(index) {
            console.log(`Server deletion requested for index ${index}`)
            window.ipcRenderer.send('toMain', { command: 'deleteServer', index, name: "Donnie's Minecraft Server" })
        },
        serverSettings(index) {
            console.log(`Server settings requested for index ${index}`)
        }
    }
}
</script>

<template>
    <div class="mcPage">
        <div class="sl-top">
            <h1>My Servers</h1>
            <div class="input-group mb-3">
                <input type="text" v-model="serverAddress" class="form-control" placeholder="Enter server address here" aria-label="Enter server address here" aria-describedby="button-addon1">
                <button class="btn btn-success addServerButton" type="button" id="button-addon1" @click="addServer(11)"><i class="bi bi-plus"></i>Add Server</button>
            </div>
        </div>
        <div class="sl-bottom">
            <div v-if="serverList.length" class="serverList">
                <!--<div class="serverObject" v-for="server in serverList">-->
                <div class="serverObject" v-for="(server, index) in serverList">
                    <div class="so-stack">
                        <div class="ic-left">
                            <img src="../assets/img/mc-block.png" />
                        </div>
                        <div class="ic-right">
                            <div class="srv-infoChip">
                                    <span class="label">Name:</span>
                                    <span class="data">{{server.name}}</span>
                                
                            </div>
                            <div class="srv-infoChip">
                                <span class="label">Address:</span>
                                <span class="data">{{server.address}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="so-stack buttonstack">
                        <button type="button" class="btn btn-secondary btn-sm" @click="serverSettings(index)"><i class="bi bi-gear-fill"></i></button>
                        <button type="button" class="btn btn-danger btn-sm" @click="deleteServer(index)"><i class="bi bi-trash-fill"></i></button>
                    </div>
                </div>
                
            </div>
            <div v-else class="noServers">
                
                <p>No servers added yet! Click the add button to add one</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .mcPage {
        width: calc(100vw - 2px)!important;
        height: calc(98vh - (var(--d-navH) + var(--d-footerH)));

        background-color: var(--body-bg)!important;
        border-radius: 0px;
        

        /* flex-grow: 1!important; */
        max-height: 100%!important;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .sl-top h1 {
        color: var(--bodytext-lightcolor);
        font-size: 24px;
        font-weight: 300;
        font-family: "Open Sans Regular";
        padding: 0 18px 0 18px;
        margin-bottom: 12px;
    }

    .sl-top {
        background-color: white;
        height: 110px;
        padding: 14px 18px 0 18px;
    }
    .sl-bottom {
        height: calc(100% - 110px);
        overflow-x: hidden;
        overflow-y: auto;
        padding: 18px 18px 0 18px;
    }

    .addServerButton > i {
        font-size: 16px;
    }

    .noServers p {
        color: var(--bodytext-color);
        font-size: 14px;
        font-family: "Open Sans Regular";
        padding: 8px 18px 0 18px;
    }

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