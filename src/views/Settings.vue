<script setup>
import { get } from 'http';
import proxyStatusBar from '../components/serverlist/proxyStatus.vue'
import serverDivider from '../components/serverlist/serverlist-divider.vue'


</script>

<script>
export default {
    inject: ['activeServerIndex', 'interfaceList', 'selectedInterface', 'localPortRange'],
    data: function() {
        return {
            //selectedInterface: {}
            lowPort: 0,
            highPort: 1,
        }
    },
    created() {
        console.log(`This is happening in Settings.vue`, this.selectedInterface)
        this.lowPort = this.localPortRange[0]
        this.highPort = this.localPortRange[1]
    },
    methods: {
        selectInterface(event, index) {
            window.ipcRenderer.send('toMain', { command: 'selectInterface', index })
        },
        selectPortRange(event) {
            var newLocalPortRange = [ this.lowPort, this.highPort ]
            if (this.validatePorts(this.lowPort, this.highPort)) {
                window.ipcRenderer.send('toMain', { command: 'selectPortRange', newLocalPortRange })
            }
            
        },
        getServerListLength() {
            var len = this.serverList.length
            return len
        },
        validatePorts() {
            var valid = true
            if (this.highPort > 65535) {
                valid = false
                this.highPort = 65535
            }
            if (this.highPort < 0) {
                valid = false
                this.highPort = 0
            }
            if (this.lowPort > 65535) {
                valid = false
                this.lowPort = 65535
            }
            if (this.lowPort < 0) {
                valid = false
                this.lowPort = 0
            }
            return valid
        }
    },
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
            <p v-if="platform == 'darwin'" class="settingsNote"><em>Note: Selecting interfaces may not work in macOS... It is recommended to use 0.0.0.0</em></p>
            <div class="settingsObject">
                <!--<p v-if="activeServerIndex != null && serverList.length">No active servers. Click the activate button on a server to begin. </p>-->
                <select v-if="interfaceList.length > 0" class="form-select" multiple aria-label="multiple select example" @change="selectInterface($event, $event.target.selectedIndex)" >
                    <option v-for="(iface, index) of interfaceList" :selected="iface.selected">{{iface.ipv4}} <span class="ifSubtitle">({{iface.ifKey}})</span></option>
                </select>
                <p v-else class="error">There was a problem loading your system's network adapters...</p>
            </div>
            <serverDivider text="Port Range"/>
            <p class="settingsNote"><em>Bedrock proxy requires access to UDP port 19132, as well as a random selected one from the range below (default 49,000-65,535).</em></p>
            <div class="settingsObject portRange">
                <!--<p v-if="activeServerIndex != null && serverList.length">No active servers. Click the activate button on a server to begin. </p>-->
                <input type="number" class="form-control" v-model="lowPort" :min=0 :max=65535 @change="selectPortRange($event)">
                <span> - </span>
                <input type="number" class="form-control" v-model="highPort" :min=0 :max=65535 @change="selectPortRange($event)">
            </div>
            <p class="settingsNote"><em>All changes are applied and saved automatically!</em></p>
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

    
    .settingsObject.portRange {
        flex-direction: row;
        justify-content: center;
    }

    .settingsObject.portRange input {
        width: 25vw;
        
    }

    .settingsObject.portRange span {
        font-size: 12px;
        margin: 0 8px 0 8px;
    }

    .ifSubtitle {
        color: #888!important;
        font-size: 10px!important;
    }

    .settingsNote {
        padding: 8px 18px 0 18px;
        font-size: 12.9px;
        text-align: center;
        margin-bottom: 0px!important;
    }

    

    
</style>