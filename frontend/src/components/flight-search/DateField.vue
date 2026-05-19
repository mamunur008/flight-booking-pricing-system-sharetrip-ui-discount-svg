<template>
  <div class="date-box">
    <label>{{ label }}</label>

    <input
      type="date"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @change="$emit('change')"
    />

    <small>{{ formattedDate }}</small>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: String,
  modelValue: String,
});

defineEmits(["update:modelValue", "change"]);

const formattedDate = computed(() => {
  if (!props.modelValue) return "";

  return new Date(props.modelValue).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>
