<script>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="mcFooter">
        <div class="mcf-left">
            <RouterLink to="/" class="bottomLink" >
                <div>
                    <i class="bi bi-controller bottomIcon"></i>
                    <span class="bottomLinkLabel">Servers</span>
                    <i class="bi bi-caret-up-fill activeCaret"></i>
                    <i class="bi bi-caret-up hoverCaret"></i>
                </div>
            </RouterLink>
            <RouterLink to="/settings" class="bottomLink">Settings</RouterLink>
        </div>
    </div>
</template>

<style>
.mcFooter {
    height: var(--d-footerH)!important;
    width: 100%!important;
    background: linear-gradient(0deg, var(--footer-dark-gradient), var(--footer-light-gradient));
}

.mcf-left {
    height: var(--d-footerH)!important;
    display: flex;
    justify-content: center;

}

.bottomLink {
    text-decoration: none!important;
}

.bottomLink > div {
    height: var(--d-footerH)!important;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 4vw 0 4vw;
    overflow: hidden;
    transition-duration: 0.2s;
    overflow: hidden;
    
}

.bottomLink > div > .bottomIcon {
    padding: 0px!important;
}

.bottomLink > div > .bottomIcon {
    color: white;
    font-size: var(--desktop-footerbutton-icon-height);

    transition-duration: 0.2s;
}
.bottomLink > div > .bottomLinkLabel {
    color: white;
    font-size: var(--desktop-footerbutton-font-size);
    transition-duration: 0.2s;
    
}
/* Enable footer carets */
.bottomLink > div > .activeCaret {
    color: white;
    display: none;
    font-size: var(--desktop-footerbutton-caret-height);
}
.bottomLink > div > .hoverCaret {
    color: #ffffff00;
    display: block;
    font-size: var(--desktop-footerbutton-caret-height);
    transition-duration: 0.18s;
}
.bottomLink.router-link-active:hover > div > .hoverCaret {
    color: white;
    display: none;
    
}
.bottomLink:hover > div > .hoverCaret {
    color: white;
    display: block;
}
.bottomLink.router-link-active > div > .activeCaret {
    color: white;
    display: block;
}
.bottomLink.router-link-active > div > .activeCaret {
    color: white;
    display: block;
}
/* <! Enable footer carets */
.bottomLink.router-link-active > div {
    
}
.bottomLink.router-link-active > div > .bottomLinkLabel {
    color: white;
    text-shadow: 0px 0px 6px #D9D9D9;
}
.bottomLink.router-link-active > div > .bottomIcon {
    text-shadow: 0px 0px 6px #D9D9D9;
}

</style>