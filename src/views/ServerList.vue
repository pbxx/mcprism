<script setup>
import { get } from 'http';
import proxyStatusBar from '../components/serverlist/proxyStatus.vue'
import serverObject from '../components/serverlist/serverObject.vue'
import serverDivider from '../components/serverlist/serverlist-divider.vue'


</script>

<script>
export default {
    data: function() {
        return {
            serverAddress: '',
            displayError: ''
        }
    },
    computed: {
        serverListArr() {
            return this.serverList
        },
    },
    mounted() {
        window.ipcRenderer.receive('fromMain', (arg) => {
        console.log(arg) // prints "pong" in the DevTools console
            if (arg.command == 'errorAddingServer') {
                //this is a server list update
                this.showError(arg.error)
            }
        })
    },
    created() {
        console.log(`This is happening in serverList.vue`, this.serverListArr.length)
        console.log(`This is happening in serverList.vue`, this.serverAddress)
    },
    methods: {
        addServer(test) {
            //test ipc
            console.log(test)
            if (this.serverAddress) {
                window.ipcRenderer.send('toMain', { command: 'addServer', address: this.serverAddress, name: "Donnie's Minecraft Server" })
            } else {
                //server address is not valid
                this.showError("No server address entered!")
            }
            
        },
        showError(err) {
            this.displayError = err
            setTimeout(() => {
                this.displayError = ''
            }, 3500)
        },
        getServerListLength() {
            var len = this.serverList.length
            return len
        }
    },
    inject: ['serverList', 'activeServerIndex'],
    
    
}
</script>

<template>
    <div class="mcPage">
        <div class="sl-top" :class="{ errored: displayError }">
            <proxyStatusBar></proxyStatusBar>
            <h1>My Servers</h1>
            <div class="input-group mb-3">
                <input type="text" v-model="serverAddress" class="form-control" placeholder="Enter server address here" aria-label="Enter server address here" aria-describedby="button-addon1">
                <button class="btn btn-success addServerButton" type="button" id="button-addon1" @click="addServer(11)"><i class="bi bi-plus"></i>Add Server</button>
            </div>
            <p v-if="displayError" class="errortext">{{displayError}}</p>
        </div>
        <div class="sl-bottom" :class="{ errored: displayError }">
            <serverDivider v-if="serverList.length > 0" text="Active Server"/>
            <div class="activeServerList">
                <!--<p v-if="activeServerIndex != null && serverList.length">No active servers. Click the activate button on a server to begin. </p>-->
                <serverObject v-if="serverList.length > 0" :isActiveServerDisplay="true" />
            </div>
            <serverDivider v-if="serverList.length > 0" text="Saved Servers"/>
            <div v-if="serverList.length > 0" class="serverList">
                <serverObject v-for="(server, index) in serverList" :address="server.address" :index="index" />
                
                
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
    .sl-top.errored {
        height: 158px;
        
    }
    .sl-top.errored > .input-group {
        margin-bottom: 4px!important;
        
    }
    .sl-bottom.errored {
        height: calc(100% - 158px);
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

    .errortext {
        padding: 0 22px 0 22px;
        color: red;
        font-size: 14px;
    }

    
</style>