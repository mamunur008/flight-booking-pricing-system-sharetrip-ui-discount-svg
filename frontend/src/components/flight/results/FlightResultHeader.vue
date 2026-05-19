<template>
  <section class="result-summary-bar">
    <div>
      <h2>{{ originName }} ({{ form.Origin }}) — {{ destinationName }} ({{ form.Destination }})</h2>
      <p class="muted">{{ journey }} · {{ dateRange }} · {{ form.NoOfAdult }} Traveller · {{ form.ClassType }}</p>
    </div>
    <button class="modify-btn" type="button" @click="$emit('modify')">Modify</button>
  </section>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ form: { type: Object, required: true } })
defineEmits(['modify'])
const originName = computed(() => props.form.Origin === 'DAC' ? 'Dhaka' : props.form.Origin)
const destinationName = computed(() => props.form.Destination === 'CXB' ? "Cox's Bazar" : props.form.Destination)
const journey = computed(() => props.form.JourneyType === 2 ? 'Round Trip' : 'One Way')
const dateRange = computed(() => props.form.ReturnDate ? `${props.form.DepartureDate} - ${props.form.ReturnDate}` : props.form.DepartureDate)
</script>
