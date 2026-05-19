<template>
  <div class="result-head">
    <h2>{{ count }} Available Flights</h2>
    <span class="muted">*Price Includes VAT & Tax</span>
  </div>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 0 },
});
</script>
