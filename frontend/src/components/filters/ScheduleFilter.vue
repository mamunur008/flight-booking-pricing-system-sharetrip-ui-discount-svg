<template>
  <div class="panel">
    <h3>Flight Schedules</h3>
    <div class="panel-body">
      <div class="filter-btn">
        <button type="button">Departure</button>
        <button type="button">Arrival</button>
        <button v-for="slot in timeSlots" :key="slot" type="button">
          {{ slot }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const timeSlots = ["12 AM-06 AM", "06 AM-12 PM", "12 PM-06 PM", "06 PM-12 AM"];
</script>
