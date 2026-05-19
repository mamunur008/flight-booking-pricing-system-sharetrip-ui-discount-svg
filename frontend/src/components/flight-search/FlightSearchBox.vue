<template>
  <div class="search-card">
    <div class="trip-types">
      <button
        :class="{ active: localForm.JourneyType === 1 }"
        @click="setJourneyType(1)"
      >
        One Way
      </button>

      <button
        :class="{ active: localForm.JourneyType === 2 }"
        @click="setJourneyType(2)"
      >
        Round Trip
      </button>

      <button disabled>Multi City</button>

      <div class="right-options">
        <select v-model.number="localForm.NoOfAdult" @change="emitChange">
          <option :value="1">1 Traveller</option>
          <option :value="2">2 Travellers</option>
          <option :value="3">3 Travellers</option>
          <option :value="4">4 Travellers</option>
        </select>

        <select v-model="localForm.ClassType" @change="emitChange">
          <option>Economy</option>
          <option>Business</option>
          <option>First</option>
        </select>
      </div>
    </div>

    <div class="search-grid">
      <AirportSelector
        label="From"
        v-model:code="localForm.Origin"
        v-model:name="originName"
        placeholder="Dhaka"
      />

      <button class="swap-btn" type="button" @click="swapAirports">⇄</button>

      <AirportSelector
        label="To"
        v-model:code="localForm.Destination"
        v-model:name="destinationName"
        placeholder="Cox's Bazar"
      />
      <DateRangePicker
        :range="localForm.JourneyType === 2"
        v-model:startDate="localForm.DepartureDate"
        v-model:endDate="localForm.ReturnDate"
        start-label="Departure"
        end-label="Return"
        @change="emitChange"
      />

      <!-- <DateField
        label="Departure"
        v-model="localForm.DepartureDate"
        @change="emitChange"
      />

      <DateField
        v-if="localForm.JourneyType === 2"
        label="Return"
        v-model="localForm.ReturnDate"
        @change="emitChange"
      /> -->

      <button class="search-btn" @click="$emit('search')">🔍</button>
    </div>

    <div class="fare-types">
      <label>
        <input type="radio" checked />
        Regular Fare
      </label>

      <label>
        <input type="radio" />
        Student Fare
      </label>

      <label>
        <input type="radio" />
        Umrah Fare
      </label>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import DateRangePicker from "../common/DateRangePicker.vue";
import AirportSelector from "./AirportSelector.vue";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:form", "search"]);

const localForm = reactive({ ...props.form });

const originName = ref("Dhaka, Bangladesh, Hazrat Shahjalal Intl");
const destinationName = ref("Cox's Bazar, Bangladesh, Cox's Bazar Airport");

watch(
  () => props.form,
  (value) => {
    Object.assign(localForm, value);
  },
  { deep: true },
);

function emitChange() {
  emit("update:form", { ...localForm });
}

function setJourneyType(type) {
  localForm.JourneyType = type;

  if (type === 1) {
    localForm.ReturnDate = "";
  }

  emitChange();
}

function swapAirports() {
  const origin = localForm.Origin;
  localForm.Origin = localForm.Destination;
  localForm.Destination = origin;

  const originText = originName.value;
  originName.value = destinationName.value;
  destinationName.value = originText;

  emitChange();
}
</script>
