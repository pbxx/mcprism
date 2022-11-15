<script setup>
import { ref, computed } from 'vue'

import playerCountBubble from './playerCountBubble.vue'
import nameInfochip from './nameInfochip.vue'
</script>

<script>
export default {
    props: ["address", "image", "index", "isActiveServerDisplay"],
    inject: ['serverList', 'activeServerIndex'],
    data() {
        return {
            online: -1,
            serverMotd: 'Loading server info...',
            players: ''
        }
    },
    created() {
        // props are exposed on `this`
        console.log(`This is happening in serverObject.vue`, this.address, this.index)
        this.checkServerInfo(this.index)
    },
    mounted() {
        window.ipcRenderer.receive('fromMain', (arg) => {
        //console.log(arg, this.index) // prints "pong" in the DevTools console
            if (arg.command == 'serverInfoResponse' && arg.index == this.index ) {
                //this is a response to this server's info request
                console.log(arg.online)
                this.online = arg.online
                this.serverMotd = arg.serverMotd
                this.players = arg.players
            }
        })
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
        },
        checkServerInfo(index) {
            console.log(`Server info requested for index ${index}`)
            window.ipcRenderer.send('toMain', { command: 'getServerInfo', index })
        }
    },
    provide() {
        return {
            online: computed(() => this.online),
            serverMotd: computed(() => this.serverMotd),
            players: computed(() => this.players),
        }
    }
    
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
                <nameInfochip />
                <div class="srv-infoChip">
                    <span class="label">Address:</span>
                    <span class="data">{{serverList[activeServerIndex].address}}</span>
                </div>
            </div>
        </div>
        <div class="so-stack buttonstack">
            <button type="button" class="btn btn-secondary btn-sm" @click="deactivateProxy(index)"><i class="bi bi-power"></i></button>
        </div>
        <playerCountBubble online="online" min="3" max="22"/>
    </div>
    <div v-else-if="!serverList[index].active" class="serverObject">
        <div class="so-stack">
            <div class="ic-left">
                <img src="../../assets/img/mc-block.png" />
            </div>
            <div class="ic-right">
                <nameInfochip />
                
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
        <playerCountBubble online="offline" min="3" max="22"/>
    </div>
</template>

<style>
    .serverObject {
        background-color: #c8c8c8;
        border-radius: 9px;
        margin: 9px 18px 12px 18px;
        padding: 12px;
        display: grid;
        box-shadow: 0px 0px 24px -7px rgba(0,0,0,0.75);
        position: relative;
    }

    .serverObject.inactive {
        background: linear-gradient(0deg, #515e6b, #6d7e8e);
        padding: 8px;
    }

    .serverObject.active {
        /*background: linear-gradient(0deg, #47475c, #718191);*/
        background: linear-gradient(0deg, #121212, #2b2e4b);
        box-shadow: 0px 0px 24px -7px rgba(0,0,0,0.75);
    }

    .so-stack {
        grid-column: 1;
        grid-row: 1;
        display: flex;
    }

    .so-stack > .ic-left img {
        height: 68px;
        border-radius: 4px;

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

        overflow: hidden;
        white-space: nowrap;

    }

    .srv-infoChip > .label {
        color: var(--bodytext-color);
        font-size: 10px;
        font-weight: 700;
        
    }

    .serverObject.active .srv-infoChip > .label {
        color: #e3e3e3!important;
    }

    .srv-infoChip > .data {
        color: var(--bodytext-color);
        font-size: 14px;
        font-weight: 500;
        margin-left: 4px;
        margin-top: -3px;

        
    }

    .serverObject.active .srv-infoChip > .data {
        color: #e8e8e8!important;
        
    }

    .so-buttonbox {
        flex-direction: row-reverse;
        align-items: flex-end;
    }

    

</style>