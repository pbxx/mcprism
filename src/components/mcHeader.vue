<template>
    <div class="mcHeader">
        <div class="mch-left">
            <img src="../assets/img/mcprism-only.svg" />
        </div>
        <div class="mch-right">

        </div>
    </div>
</template>

<style>
.mcHeader {
    height: var(--d-navH)!important;
    width: 100%!important;
    background: linear-gradient(0deg, var(--nav-dark-gradient), var(--nav-light-gradient));
    -webkit-app-region: drag;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.mch-left {
    display: flex;
    justify-content: center;
}
.mch-left img {
    margin-bottom: 0px;
    height: var(--logoH);
}
</style>