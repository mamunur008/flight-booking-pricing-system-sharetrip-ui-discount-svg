<template>
  <aside>
    <PriceRangeFilter :min="min" :max="max" />
    <ScheduleFilter />
    <AirlineFilter :airlines="filter.airline_code || []" />
    <DiscountFilter v-model="discountCode" @apply="$emit('apply-discount')" />
  </aside>
</template>

<script setup>
import { computed } from "vue";
import AirlineFilter from "./AirlineFilter.vue";
import DiscountFilter from "./DiscountFilter.vue";
import PriceRangeFilter from "./PriceRangeFilter.vue";
import ScheduleFilter from "./ScheduleFilter.vue";

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 0 },
  filter: { type: Object, default: () => ({ airline_code: [] }) },
  form: { type: Object, required: true },
});

defineEmits(["apply-discount"]);

const discountCode = computed({
  get: () => props.form.discountCode,
  set: (value) => {
    props.form.discountCode = value;
  },
});
</script>
