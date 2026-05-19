<template>
  <div class="results-page">
    <TripSummary :form="form" @modify="$emit('modify')" />

    <div class="results-layout">
      <aside class="sidebar">
        <FlightFilterSidebar
          :filter="filter"
          :flights="flights"
          :form="form"
          @apply-discount="$emit('search')"
          @filter-change="$emit('filter-change', $event)"
        />
      </aside>

      <section class="results-content">
        <FlightResultsHeader :flights="flights" />

        <FlightSortBar :flights="flights" />

        <FlightCard
          v-for="(flight, index) in flights"
          :key="flight.id"
          :flight="flight"
          :tag="index === 0 ? 'Best Deal' : 'Preferred Deal'"
        />

        <div class="ad">AD HERE</div>
      </section>
    </div>
  </div>
</template>

<script setup>
import FlightCard from "./FlightCard.vue";
import FlightFilterSidebar from "./FlightFilterSidebar.vue";
import FlightResultsHeader from "./FlightResultsHeader.vue";
import FlightSortBar from "./FlightSortBar.vue";
import TripSummary from "./TripSummary.vue";

defineProps({
  form: {
    type: Object,
    required: true,
  },
  flights: {
    type: Array,
    default: () => [],
  },
  filter: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["modify", "search", "filter-change"]);
</script>
