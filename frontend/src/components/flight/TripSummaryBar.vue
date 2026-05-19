<template>
  <section class="tripbar">
    <div>
      <h2>{{ title }}</h2>
      <p class="muted">{{ meta }}</p>
    </div>
    <button class="primary" type="button" @click="$emit('modify')">
      Modify
    </button>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  meta: { type: String, required: true },
});

defineEmits(["modify"]);
</script>
