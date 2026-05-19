<template>
  <div class="panel">
    <div class="panel-title">
      <h3>Price Range</h3>
      <button class="reset-pill" type="button" @click="reset">Reset</button>
      <span>⌃</span>
    </div>

    <div class="panel-body">
      <p class="muted">
        Starts from ৳ {{ originalMin }} - ৳ {{ originalMax }} against your
        search. Price is subject to change.
      </p>

      <div class="dual-range">
        <div class="range-track"></div>

        <div
          class="range-fill"
          :style="{
            left: minPercent + '%',
            right: 100 - maxPercent + '%',
          }"
        ></div>

        <input
          v-model.number="selectedMin"
          type="range"
          :min="originalMin"
          :max="originalMax"
          :step="step"
          @input="fixMin"
          @change="apply"
        />

        <input
          v-model.number="selectedMax"
          type="range"
          :min="originalMin"
          :max="originalMax"
          :step="step"
          @input="fixMax"
          @change="apply"
        />
      </div>

      <b>BDT {{ selectedMin }} - BDT {{ selectedMax }}</b>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  minPrice: {
    type: Number,
    default: 100,
  },
  maxPrice: {
    type: Number,
    default: 5000,
  },
});

const emit = defineEmits(["change"]);

const step = 100;

const originalMin = computed(() => Number(props.minPrice || 100));
const originalMax = computed(() => Number(props.maxPrice || 5000));

const selectedMin = ref(originalMin.value);
const selectedMax = ref(originalMax.value);

watch(
  () => [props.minPrice, props.maxPrice],
  () => {
    selectedMin.value = originalMin.value;
    selectedMax.value = originalMax.value;
  },
  { immediate: true },
);

const minPercent = computed(() => {
  return (
    ((selectedMin.value - originalMin.value) /
      (originalMax.value - originalMin.value)) *
    100
  );
});

const maxPercent = computed(() => {
  return (
    ((selectedMax.value - originalMin.value) /
      (originalMax.value - originalMin.value)) *
    100
  );
});

function fixMin() {
  if (selectedMin.value >= selectedMax.value) {
    selectedMin.value = selectedMax.value - step;
  }
}

function fixMax() {
  if (selectedMax.value <= selectedMin.value) {
    selectedMax.value = selectedMin.value + step;
  }
}

function apply() {
  emit("change", {
    min_price: selectedMin.value,
    max_price: selectedMax.value,
  });
}

function reset() {
  selectedMin.value = originalMin.value;
  selectedMax.value = originalMax.value;
  apply();
}
</script>
