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
      <AirportSelect :placeholder="originLabel" @select="selectOrigin" />

      <button class="swap-btn" type="button" @click="swapAirports">⇄</button>

      <AirportSelect
        :placeholder="destinationLabel"
        @select="selectDestination"
      />

      <el-date-picker
        v-if="localForm.JourneyType === 1"
        v-model="localForm.DepartureDate"
        type="date"
        placeholder="Departure"
        format="DD MMM YYYY"
        value-format="YYYY-MM-DD"
        class="flight-single-date"
        @change="onSingleDateChange"
      />

      <el-date-picker
        v-else
        v-model="dateRange"
        type="daterange"
        range-separator="To"
        start-placeholder="Departure"
        end-placeholder="Return"
        format="DD MMM YYYY"
        value-format="YYYY-MM-DD"
        class="flight-date-range"
        @change="onDateRangeChange"
      />

      <button class="search-btn" type="button" @click="submitSearch"></button>

      <!-- <button
        class="search-btn"
        type="button"
        @click="$emit('search')"
      ></button> -->

      <!-- <DateRangePicker
        :range="localForm.JourneyType === 2"
        v-model:startDate="localForm.DepartureDate"
        v-model:endDate="localForm.ReturnDate"
        start-label="Departure"
        end-label="Return"
        @change="emitChange"
      /> -->

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
      <!-- 
      <button class="search-btn" @click="$emit('search')">🔍</button> -->
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
import { ElMessage } from "element-plus";
import { reactive, ref, watch } from "vue";
import AirportSelect from "../flight-search/AirportSelector.vue";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
});

const localForm = reactive({ ...props.form });
const dateRange = ref([localForm.DepartureDate, localForm.ReturnDate]);

watch(
  () => [localForm.DepartureDate, localForm.ReturnDate],
  () => {
    if (localForm.JourneyType === 2) {
      dateRange.value = [localForm.DepartureDate, localForm.ReturnDate];
    }
  },
);

const emit = defineEmits(["update:form", "search"]);

const originLabel = ref("DAC - Dhaka, Bangladesh");
const destinationLabel = ref("CXB - Cox's Bazar, Bangladesh");

const originName = ref("Dhaka, Bangladesh, Hazrat Shahjalal Intl");
const destinationName = ref("Cox's Bazar, Bangladesh, Cox's Bazar Airport");

function disablePastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
}

function onSingleDateChange(value) {
  localForm.DepartureDate = value;
  localForm.ReturnDate = "";
  emitChange();
}

function selectOrigin(airport) {
  localForm.Origin = airport.code;
  originLabel.value = `${airport.code} - ${airport.city}, ${airport.country}`;

  emitChange();
}

function selectDestination(airport) {
  localForm.Destination = airport.code;
  destinationLabel.value = `${airport.code} - ${airport.city}, ${airport.country}`;

  emitChange();
}

function onDateRangeChange(value) {
  const startDate = value?.[0] || "";
  const returnDate = value?.[1] || "";

  if (startDate && returnDate && startDate > returnDate) {
    ElMessage.error("Departure date cannot be greater than return date");
    return;
  }

  localForm.DepartureDate = startDate;
  localForm.ReturnDate = returnDate;

  dateRange.value = [startDate, returnDate];

  emitChange();
}

function setJourneyType(type) {
  localForm.JourneyType = type;

  if (type === 1) {
    localForm.ReturnDate = "";
    dateRange.value = [localForm.DepartureDate, ""];
  }

  if (type === 2) {
    if (
      !localForm.ReturnDate ||
      localForm.ReturnDate < localForm.DepartureDate
    ) {
      const nextDay = new Date(localForm.DepartureDate);
      nextDay.setDate(nextDay.getDate() + 1);

      localForm.ReturnDate = nextDay.toISOString().slice(0, 10);
    }

    dateRange.value = [localForm.DepartureDate, localForm.ReturnDate];
  }

  emitChange();
}
function submitSearch_old() {
  emitChange();

  emit("search", { ...localForm });
}
function emitChange_old() {
  emit("update:form", {
    ...localForm,
    DepartureDate: localForm.DepartureDate,
    ReturnDate: localForm.ReturnDate,
  });
}

function emitChange() {
  emit("update:form", { ...localForm });
}

function submitSearch() {
  const payload = { ...localForm };

  emit("update:form", payload);
  emit("search", payload);
}
/*
function setJourneyType(type) {
  localForm.JourneyType = type;

  if (type === 1) {
    localForm.ReturnDate = "";
  }

  emitChange();
} */

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
