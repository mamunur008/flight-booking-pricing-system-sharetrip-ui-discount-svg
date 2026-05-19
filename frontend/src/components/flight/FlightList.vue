<template>
  <section>
    <FlightResultsHeader :count="flights.length" />
    <AirlineTabs :flights="flights" />
    <SortTabs :min="min" />

    <FlightCard
      v-for="(flight, index) in flights"
      :key="flight.id || index"
      :flight="flight"
      :tag="dealTag(index)"
    />

    <AdvertisementBanner />
  </section>
</template>

<script setup>
import FlightCard from "../FlightCard.vue";
import AdvertisementBanner from "./AdvertisementBanner.vue";
import AirlineTabs from "./AirlineTabs.vue";
import FlightResultsHeader from "./FlightResultsHeader.vue";
import SortTabs from "./SortTabs.vue";

defineProps({
  flights: { type: Array, default: () => [] },
  min: { type: Number, default: 0 },
});

function dealTag(index) {
  if (index === 0) return "Best Deal";
  if (index === 1) return "Preferred Deal";
  return "";
}
</script>
