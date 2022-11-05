<script setup>
import proxyStatusBar from '../components/serverlist/proxyStatus.vue'
import serverObject from '../components/serverlist/serverObject.vue'
import { ref, computed } from 'vue'
</script>

<script>
export default {
    data: function() {
        return {
            inactiveServerList: [],
            serverAddress: '',
            activeServer: null,
            proxyStatus: false
        }
    },
    mounted(){
        window.ipcRenderer.receive('fromMain', (arg) => {
            console.log(arg) // prints "pong" in the DevTools console
            if (arg.command == 'updateServers') {
                //this is a server list update
                this.inactiveServerList = arg.inactiveServerList
            } else if (arg.command == "updateStatus") {
                //this is a status update
                this.activeServer = arg.activeServer
                this.proxyStatus = arg.proxyStatus
            }
        })
    },
    methods: {
        addServer(test) {
            //test ipc
            console.log(test)
            window.ipcRenderer.send('toMain', { command: 'addServer', address: this.serverAddress, name: "Donnie's Minecraft Server" })
        },
    },
    provide: function() {
        return {
            activeServer: computed(() => this.activeServer),
            proxyStatus: computed(() => this.proxyStatus),
        }
    }
}
</script>

<template>
    <div class="mcPage">
        <div class="sl-top">
            <proxyStatusBar></proxyStatusBar>
            <h1>My Servers</h1>
            <div class="input-group mb-3">
                <input type="text" v-model="serverAddress" class="form-control" placeholder="Enter server address here" aria-label="Enter server address here" aria-describedby="button-addon1">
                <button class="btn btn-success addServerButton" type="button" id="button-addon1" @click="addServer(11)"><i class="bi bi-plus"></i>Add Server</button>
            </div>
        </div>
        <div class="sl-bottom">
            <div class="activeServerList">
                <p v-if="!activeServer && inactiveServerList.length">No active servers. Click the activate button on a server to begin. </p>
            </div>
            <div v-if="inactiveServerList.length" class="inactiveServerList">
                <serverObject v-for="(server, index) in inactiveServerList" :address="server.address" :index="index" />
                <!--<div class="serverObject" v-for="server in serverList">-->
                <!--
                <div class="serverObject" v-for="(server, index) in inactiveServerList">
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
                </div>-->
                
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
        margin-right: 18px;
    }

    .input-group {
        padding: 0 18px 0 18px;
    }

    .sl-top {
        background-color: white;
        height: 138px;
        
    }
    .sl-bottom {
        height: calc(100% - 138px);
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

    .activeServerList p {
        color: var(--bodytext-color);
        font-size: 14px;
        font-family: "Open Sans Regular";
        padding: 8px 18px 0 18px;
    }

    

    
</style>