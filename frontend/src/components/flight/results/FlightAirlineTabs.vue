<template>
  <div class="airline-tabs">
    <div class="arrow-tab">‹</div>
    <div v-for="flight in topFlights" :key="flight.id || flight.airlineCode">
      <b>{{ flight.airlineCode || 'BG' }}</b><br />
      <span class="muted">৳ {{ Number(flight.customerPrice || 0).toLocaleString() }}</span>
    </div>
    <div class="arrow-tab">›</div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ flights: { type: Array, default: () => [] } })
const topFlights = computed(() => props.flights.slice(0, 4))
</script>
