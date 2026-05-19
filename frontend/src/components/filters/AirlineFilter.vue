<template>
  <div class="panel">
    <h3>Airlines</h3>
    <div class="panel-body airline-list">
      <label v-for="airline in airlines" :key="airline">
        <input type="checkbox" /> {{ airline }}
      </label>
      <p v-if="!airlines.length" class="muted">No airlines loaded yet.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  airlines: { type: Array, default: () => [] },
});
</script>
