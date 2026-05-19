<template>
  <div class="panel">
    <h3>Discount Code</h3>
    <div class="panel-body">
      <input
        :value="modelValue"
        class="field"
        placeholder="INTERVIEW10"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button class="primary" type="button" @click="$emit('apply')">
        Apply
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "" },
});

defineEmits(["update:modelValue", "apply"]);
</script>
