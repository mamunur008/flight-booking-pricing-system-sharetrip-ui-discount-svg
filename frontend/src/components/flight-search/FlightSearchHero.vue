<template>
  <section class="hero">
    <div class="hero-overlay">
      <div class="hero-content">
        <h1>Where to Fly?</h1>
        <p>Find Cheap Flights, Airline Tickets in Bangladesh</p>
      </div>

      <FlightSearchBox
        :form="form"
        @update:form="$emit('update:form', $event)"
        @search="$emit('search')"
      />
    </div>
  </section>
</template>

<script setup>
import FlightSearchBox from "./FlightSearchBox.vue";

defineProps({
  form: {
    type: Object,
    required: true,
  },
});

defineEmits(["update:form", "search"]);
</script>
