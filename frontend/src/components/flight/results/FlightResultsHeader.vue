<template>
  <div class="result-topbar">
    <div>
      <h2>{{ flights.length }} Available Flights</h2>
    </div>

    <span> *Price Includes VAT & Tax </span>
  </div>
</template>

<script setup>
defineProps({
  flights: {
    type: Array,
    default: () => [],
  },
});
</script>
