<template>
  <div class="airline-tabs">
    <div v-for="flight in topFlights" :key="flight.id || flight.airlineCode">
      <b>{{ flight.airlineCode }}</b
      ><br />
      <span class="muted">{{ formatMoney(flight.customerPrice, "") }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatMoney } from "../../utils/formatters";

const props = defineProps({
  flights: { type: Array, default: () => [] },
});

const topFlights = computed(() => props.flights.slice(0, 4));
</script>
