<template>
  <div class="sort-tabs">
    <div class="sort-tab active">
      <strong>Cheapest</strong>
      <br />
      ৳ {{ cheapest }}
    </div>

    <div class="sort-tab">
      <strong>Earliest</strong>
      <br />
      07:15 AM
    </div>

    <div class="sort-tab">
      <strong>Fastest</strong>
      <br />
      2 Hr 10 Min
    </div>

    <div class="sort-tab">
      <strong>Best Deal</strong>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  flights: {
    type: Array,
    default: () => [],
  },
});

const cheapest = computed(() => {
  if (!props.flights.length) return 0;

  return Math.min(...props.flights.map((f) => Number(f.customerPrice || 0)));
});
</script>
