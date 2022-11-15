<script>
    export default {
        inject: ["online", "players"]
    }
</script>

<template>
    <div v-if="online == true" class="playerCountBubble online"><span>{{players}}</span> <i class="bi bi-circle-fill"></i></div>
    <div v-else-if="online == -1" class="playerCountBubble loading"><span>...</span></div>
    <div v-else class="playerCountBubble offline"><span>offline</span> <i class="bi bi-circle-fill"></i></div>
</template>

<style>
    .playerCountBubble {
        position: absolute;
        right: -6px;
        top: -6px;

        display: flex;
        flex-direction: row-reverse;
        align-items: center;

        background-color: #121212;
        border-radius: 6px;
        padding: 4px 8px 4px 8px;

        color: white;
    }

    .playerCountBubble > span {
        font-size: 14px;
    }

    .playerCountBubble > i {
        font-size: 9px;
        margin: 2px 7px 0 0;
    }

    .playerCountBubble.online > i {
        color: var(--online-color);
        text-shadow: 0px 0px 3px var(--online-shadow-color);
    }

    .playerCountBubble.offline > i {
        color: var(--offline-color);
    }

    .playerCountBubble.offline > span {
        color: var(--offline-color);
    }

    .playerCountBubble.loading > span {
        color: var(--offline-color);
    }

</style>