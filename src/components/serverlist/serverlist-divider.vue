<script>
export default {
    props: [ "text" ]
}
</script>

<template>
    <div class="sl-divider">
        <div class="sl-accentLeft"></div>
        <div class="sl-text">{{text}}</div>
        <div class="sl-accentRight"></div>
    </div>
</template>

<style>
:root {
    --accent-start: #33333378;
    --accent-end: #33333300;
    --accent-fontsize: 17px;
    --accent-thickness: 2px;
    --accent-fontcolor: #434343;
    --accent-margin: 0 12px 0 12px;
}

.sl-divider {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 18px 0 18px;
    margin-bottom: 12px;
}

.sl-text {
    margin: var(--accent-margin);
    font-size: var(--accent-fontsize);
    color: var(--accent-fontcolor);
}

.sl-accentLeft {
    height: var(--accent-thickness);
    flex-grow: 1;
    background: linear-gradient(270deg, var(--accent-start), var(--accent-end));
}

.sl-accentRight {
    height: var(--accent-thickness);
    flex-grow: 1;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
}

</style>