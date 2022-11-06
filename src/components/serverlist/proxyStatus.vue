<script>
export default {
    inject: ['serverList', 'activeServerIndex'],
    mounted() {
        //console.log(this.serverList.length)
        console.log(`This is happening in proxyStatus.vue`, this.activeServerIndex)
    }, 
    
}
</script>

<template>
    <div class="prs-container">
        <span >Proxy status: </span>
        <span class="prs-statusDisplay active" v-if="activeServerIndex != -1">active</span>
        <span class="prs-statusDisplay" v-else>inactive</span>
        <i v-if="activeServerIndex != -1" class="bi bi-arrow-left-right"></i>
        <span v-if="activeServerIndex != -1">{{serverList[activeServerIndex].address}}</span>
    </div>
</template>

<style>
.prs-container {
    width: 100%;
    height: 28px;
    background: linear-gradient(0deg, #060606, #0e0e0e);
    display: flex;
    align-items: center;
    padding: 0 18px 0 18px;
    margin-bottom: 14px;

}

.prs-container span {
    font-size: 14px!important;
    padding-bottom: 3px;
    color: white;
    margin-right: 8px;
}

.prs-container i {
    font-size: 12px!important;
    color: #b6b6b6;
    margin-right: 8px;
    padding-bottom: 3px;
}

.prs-statusDisplay {
    font-weight: 700;
    color: #6b6b6b!important;
}

.prs-statusDisplay.active {
    color: #25a850!important;
}
</style>