<script>
export default {
    data() {
        return {
            serverList: []
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
            window.ipcRenderer.send('toMain', { command: 'addServer', address: '10.8.8.8', name: "Donnie's Minecraft Server" })
        }
    }
}
</script>

<template>
    <div class="mcPage">
        <div class="sl-top">
            <h1>My Servers</h1>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
                <button class="btn btn-success addServerButton" type="button" id="button-addon1" @click="addServer(11)"><i class="bi bi-plus"></i>Add Server</button>
            </div>
        </div>
        <div class="sl-bottom">
            <div v-if="serverList.length" class="serverList">
                <div class="serverObject" v-for="server in serverList">
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
        display: flex;
    }

    .serverObject > .ic-left img {
        height: 68px;

    }

    .serverObject > .ic-right {
        display: flex;
        flex-direction: column;
        font-family: "Open Sans Regular";

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

    
</style>