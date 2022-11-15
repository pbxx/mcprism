<script>
    export default {
        inject: ["serverMotd"]
    }
</script>

<template>
    <div class="srv-infoChip">
        <span class="label">Name:</span>
        <span class="data">{{serverMotd}}</span>

    </div>
</template>