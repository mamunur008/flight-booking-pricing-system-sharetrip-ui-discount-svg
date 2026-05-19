<template>
  <div class="sort-tabs">
    <div>Cheapest<br />{{ min }}</div>
    <div>Earliest<br />07:15 AM</div>
    <div>Fastest<br />2 Hr 10 Min</div>
    <div>Best Deal</div>
  </div>
</template>

<script setup>
defineProps({
  min: { type: Number, default: 0 },
});
</script>
