<script setup>
import windowButtons from '../components/windows-windowbuttons.vue'
</script>

<script>
    export default {
        inject: ['platform'],
    }
</script>

<template>
    <div class="mcHeader">
        
        <div class="mch-layer">
            <div class="mch-left">
                <img src="../assets/img/mcprism-only.svg" />
            </div>
            <div class="mch-right">

            </div>
        </div>
        <windowButtons v-if="platform != 'darwin'" />
    </div>
</template>

<style>
.mcHeader {
    height: var(--d-navH)!important;
    width: 100%!important;
    background: linear-gradient(0deg, var(--nav-dark-gradient), var(--nav-light-gradient));
    display: grid;
}

.mch-layer {
    height: var(--d-navH)!important;
    width: 100%!important;
    
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.mch-left {
    display: flex;
    justify-content: center;
}

.mch-right {
    display: flex;
    justify-content: center;
}

.mch-left img {
    margin-bottom: 0px;
    height: var(--logoH);
}
</style>