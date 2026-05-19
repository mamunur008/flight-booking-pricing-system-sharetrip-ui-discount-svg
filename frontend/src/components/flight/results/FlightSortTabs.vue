<template>
  <div class="sort-tabs">
    <div>Cheapest<br /><b>৳ {{ min.toLocaleString() }}</b></div>
    <div>Earliest<br /><span>07:15 AM</span></div>
    <div>Fastest<br /><span>2 Hr 10 Min</span></div>
    <div>Best Deal</div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ flights: { type: Array, default: () => [] } })
const min = computed(() => props.flights.length ? Math.min(...props.flights.map(x => Number(x.customerPrice || 0))) : 0)
</script>
