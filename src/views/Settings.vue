<script setup>
import { get } from 'http';
import proxyStatusBar from '../components/serverlist/proxyStatus.vue'
import serverDivider from '../components/serverlist/serverlist-divider.vue'


</script>

<script>
export default {
    data: function() {
        return {
            //selectedInterface: {}
        }
    },
    created() {
        console.log(`This is happening in Settings.vue`, this.selectedInterface)
    },
    methods: {
        selectInterface(event, index) {
            //test ipc
            //console.log(test)
            ///var iface = this.interfaceList[index]
            window.ipcRenderer.send('toMain', { command: 'selectInterface', index })
        },
        getServerListLength() {
            var len = this.serverList.length
            return len
        }
    },
    inject: ['activeServerIndex', 'interfaceList', 'selectedInterface'],
    
    
}
</script>

<template>
    <div class="mcPage">
        <div class="sl-top">
            <proxyStatusBar></proxyStatusBar>
            <h1>Settings</h1>
        </div>
        <div class="sl-bottom">
            <serverDivider text="Default Interface"/>
            <div class="settingsObject">
                <!--<p v-if="activeServerIndex != null && serverList.length">No active servers. Click the activate button on a server to begin. </p>-->
                <select v-if="interfaceList.length > 0" class="form-select" multiple aria-label="multiple select example" @change="selectInterface($event, $event.target.selectedIndex)" >
                    <option v-for="(iface, index) of interfaceList" :selected="iface.selected">{{iface.ipv4}} <span class="ifSubtitle">({{iface.ifKey}})</span></option>
                </select>
                <p v-else class="error">There was a problem loading your system's network adapters...</p>
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
        height: 88px;
        
    }
    .sl-bottom {
        height: calc(100% - 88px);
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

    .settingsObject {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 18px;
    }

    .settingsObject p {
        color: var(--bodytext-color);
        font-size: 14px;
        font-family: "Open Sans Regular";
        padding: 8px 18px 0 18px;
    }

    .ifSubtitle {
        color: #888!important;
        font-size: 10px!important;
    }

    

    
</style>