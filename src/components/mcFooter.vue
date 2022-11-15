<script>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="mcFooter">
        <div class="mcf-left">
            <RouterLink to="/" class="bottomLink" >
                <div>
                    <i class="bi bi-joystick bottomIcon"></i>
                    <span class="bottomLinkLabel">Servers</span>
                    <i class="bi bi-caret-up-fill activeCaret"></i>
                    <i class="bi bi-caret-up hoverCaret"></i>
                </div>
            </RouterLink>
            <RouterLink to="/settings" class="bottomLink" >
                <div>
                    <i class="bi bi-gear-fill bottomIcon"></i>
                    <span class="bottomLinkLabel">Settings</span>
                    <i class="bi bi-caret-up-fill activeCaret"></i>
                    <i class="bi bi-caret-up hoverCaret"></i>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<style>
.mcFooter {
    height: var(--d-footerH)!important;
    width: 100%!important;
    background: linear-gradient(180deg, var(--nav-dark-gradient), var(--footer-light-gradient));
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
    padding: 0 8vw 0 8vw;
    overflow: hidden;
    transition-duration: 0.2s;
    overflow: hidden;
    
}

.bottomLink > div > .bottomIcon {
    padding: 0px!important;
}

.bottomLink > div > .bottomIcon {
    color: var(--bottomlink-inactive-color);
    font-size: var(--desktop-footerbutton-icon-height);

    transition-duration: 0.2s;
}
.bottomLink > div > .bottomLinkLabel {
    color: var(--bottomlink-inactive-color);
    font-size: var(--desktop-footerbutton-font-size);
    margin-top: 0px;
    transition-duration: 0.2s;
    
}
/* Enable footer carets */
.bottomLink > div > .activeCaret {
    color: var(--bottomlink-active-color);
    display: none;
    font-size: var(--desktop-footerbutton-caret-height);
    margin-top: -2px;
}
.bottomLink > div > .hoverCaret {
    color: #ffffff00;
    display: block;
    font-size: var(--desktop-footerbutton-caret-height);
    margin-top: -2px;
    transition-duration: 0.18s;
}
.bottomLink.router-link-active:hover > div > .hoverCaret {
    color: var(--bottomlink-active-color);
    display: none;
    
}
.bottomLink:hover > div > .hoverCaret {
    color: var(--bottomlink-inactive-color);
    display: block;
}
.bottomLink.router-link-active > div > .activeCaret {
    color: var(--bottomlink-active-color);
    display: block;
}
/* <! Enable footer carets */



.bottomLink.router-link-active > div > .bottomLinkLabel {
    color: var(--bottomlink-active-color);
    text-shadow: 0px 0px 6px var(--bottomlink-active-color);
}
.bottomLink.router-link-active > div > .bottomIcon {
    color: var(--bottomlink-active-color);
    text-shadow: 0px 0px 6px var(--bottomlink-active-color);
}

</style>