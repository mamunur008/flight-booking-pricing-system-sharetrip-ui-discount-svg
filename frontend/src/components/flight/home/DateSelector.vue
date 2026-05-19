<template>
  <div class="date-box">
    <div class="date-day">{{ day }}</div>
    <div class="date-info">
      <label>{{ label }}</label>
      <input type="date" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @change="$emit('change')" />
      <small>{{ monthText }}</small>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ label: String, modelValue: String })
defineEmits(['update:modelValue', 'change'])
const date = computed(() => props.modelValue ? new Date(props.modelValue) : null)
const day = computed(() => date.value ? String(date.value.getDate()).padStart(2, '0') : '--')
const monthText = computed(() => date.value ? date.value.toLocaleDateString('en-US', { month: 'long', weekday: 'long', year: 'numeric' }) : '')
</script>
