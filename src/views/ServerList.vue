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
        <h1>My Servers</h1>
        <button class="addServerButton" @click="addServer()">+</button>
        <div v-if="serverList.length" class="serverList">
            <div class="serverObject" v-for="server in serverList">
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
        <div v-else class="noServers">
            
            <p>No servers added yet! Click the add button to add one</p>
        </div>
    </div>
</template>

<style scoped>
    .mcPage {
        width: 100%!important;
        height: calc(100vh - (var(--d-navH) + var(--d-footerH)));
        /* flex-grow: 1!important; */
        max-height: 100%!important;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .mcPage h1 {
        color: white;
        font-size: 18px;
        font-weight: 300;
        font-family: "Open Sans Regular";
        padding: 18px;
    }

    .addServerButton {
        padding: 5px;
        width: 68px;
        height: 68px;
        border-radius: 8px;
        border-width: 0px;
        background-color: #15ba67;
        color: white;
        font-size: 42px;
        
        position: absolute;
        bottom: calc(var(--d-footerH) + 22px);
        right: 38px;
    }

    .noServers p {
        color: white;
        font-size: 14px;
        font-family: "Open Sans Regular";
        padding: 18px;
    }

    .serverObject {
        background-color: #c8c8c8;
        border-radius: 3px;
        margin: 9px 18px 12px 18px;
        padding: 12px;
    }

    .serverObject > .srv-infoChip {
        display: flex;
        flex-direction: column;
        font-family: "Open Sans Regular";

    }

    .serverObject > .srv-infoChip .label {
        color: #3f3f3f;
        font-size: 11px;
        font-weight: 700;
    }

    .serverObject > .srv-infoChip .data {
        color: #585858;
        font-size: 14px;
        font-weight: 500;
    }

    
</style>