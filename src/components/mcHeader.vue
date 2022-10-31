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
}

.mch-left {
    display: flex;
    justify-content: center;
}
.mch-left img {
    margin-top: 28px;
    height: var(--logoH);
}
</style>