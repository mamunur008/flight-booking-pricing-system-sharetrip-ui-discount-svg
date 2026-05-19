<template>
  <section class="trip-summary">
    <div class="trip-summary-inner">
      <div>
        <h2>
          {{ form.Origin }}
          —
          {{ form.Destination }}
        </h2>

        <p>
          {{ journeyText }}
          ·
          {{ form.DepartureDate }}

          <template v-if="form.ReturnDate"> - {{ form.ReturnDate }} </template>

          ·
          {{ travellers }} Traveller ·
          {{ form.ClassType }}
        </p>
      </div>

      <button class="primary" @click="$emit('modify')">Modify</button>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
});

defineEmits(["modify"]);

const journeyText = computed(() => {
  return props.form.JourneyType === 1 ? "One Way" : "Round Trip";
});

const travellers = computed(() => {
  return (
    Number(props.form.NoOfAdult || 0) +
    Number(props.form.NoOfChildren || 0) +
    Number(props.form.NoOfInfant || 0)
  );
});
</script>
