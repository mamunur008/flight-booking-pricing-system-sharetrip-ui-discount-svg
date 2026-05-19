<template>
  <aside>
    <div class="timer-card"><span>⏱ Time Remaining</span><b>29:58</b></div>
    <<PriceRangeFilter
      :min-price="min"
      :max-price="max"
      @change="$emit('filter-change', $event)"
    />
    <ScheduleFilter />
    <AirlineFilter :airlines="filter?.airline_code || []" />
    <DiscountFilter v-model="discountCode" @apply="$emit('apply-discount')" />
  </aside>
</template>
<script setup>
import { computed } from "vue";
import AirlineFilter from "../../filters/AirlineFilter.vue";
import DiscountFilter from "../../filters/DiscountFilter.vue";
import PriceRangeFilter from "../../filters/PriceRangeFilter.vue";
import ScheduleFilter from "../../filters/ScheduleFilter.vue";

const props = defineProps({
  filter: Object,
  flights: { type: Array, default: () => [] },
  form: Object,
});
defineEmits(["apply-discount", "filter-change"]);
const min = computed(() =>
  props.flights.length
    ? Math.min(...props.flights.map((x) => Number(x.customerPrice || 0)))
    : 0,
);
const max = computed(() =>
  props.flights.length
    ? Math.max(...props.flights.map((x) => Number(x.customerPrice || 0)))
    : 0,
);
const discountCode = computed({
  get: () => props.form.discountCode,
  set: (v) => {
    props.form.discountCode = v;
  },
});
</script>
