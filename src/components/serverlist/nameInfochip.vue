<script>
    export default {
        inject: ["serverMotd"]
    }
</script>

<template>
    <div class="srv-infoChip">
        <span class="label">Name:</span>
        <span class="data">{{serverMotd.slice(0,30) + "..."}}</span>

    </div>
</template>