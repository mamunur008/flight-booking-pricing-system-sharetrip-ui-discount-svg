<template>
  <div class="airport-box" @click="openDropdown">
    <div class="airport-code">{{ code }}</div>

    <div class="airport-info">
      <label>{{ label }}</label>

      <input
        v-model="searchText"
        :placeholder="placeholder"
        @input="searchCities"
        @focus="openDropdown"
        @click.stop="openDropdown"
      />

      <small>{{ name }}</small>
    </div>

    <div v-if="open" class="airport-dropdown" @click.stop>
      <button
        v-for="city in cities"
        :key="city.code"
        type="button"
        @click="selectCity(city)"
      >
        <strong>{{ city.code }}</strong>
        <span>{{ city.name }}</span>
      </button>

      <div v-if="!cities.length" class="airport-empty">No cities found</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "../../../services/api";

const props = defineProps({
  label: String,
  code: String,
  name: String,
  placeholder: String,
});

const emit = defineEmits(["update:code", "update:name"]);

const open = ref(false);
const searchText = ref("");
const cities = ref([]);

let timer = null;

const defaultCities = [
  { code: "DAC", name: "Dhaka, Bangladesh, Hazrat Shahjalal Intl" },
  { code: "CXB", name: "Cox's Bazar, Bangladesh, Cox's Bazar Airport" },
  { code: "CGP", name: "Chattogram, Bangladesh, Shah Amanat Intl" },
  { code: "ZYL", name: "Sylhet, Bangladesh, Osmani Intl" },
  { code: "JSR", name: "Jashore, Bangladesh" },
  { code: "SPD", name: "Saidpur, Bangladesh" },
  { code: "RJH", name: "Rajshahi, Bangladesh" },
  { code: "BZL", name: "Barishal, Bangladesh" },
  { code: "DXB", name: "Dubai, United Arab Emirates" },
  { code: "SIN", name: "Singapore, Changi Airport" },
  { code: "KUL", name: "Kuala Lumpur, Malaysia" },
  { code: "BKK", name: "Bangkok, Thailand" },
  { code: "DEL", name: "Delhi, India" },
  { code: "CCU", name: "Kolkata, India" },
  { code: "JFK", name: "New York, United States" },
];

async function openDropdown() {
  open.value = true;

  if (!cities.value.length) {
    await loadInitialCities();
  }
}

async function loadInitialCities() {
  try {
    const queries = ["a", "d", "s", "c", "b"];

    const responses = await Promise.all(
      queries.map((q) => api.get(`/cities?input=${q}`)),
    );

    const merged = responses.flatMap((r) => normalizeCities(r.data));

    cities.value = uniqueCities([...defaultCities, ...merged]).slice(0, 100);
  } catch {
    cities.value = defaultCities;
  }
}

function searchCities() {
  clearTimeout(timer);

  timer = setTimeout(async () => {
    if (!searchText.value || searchText.value.length < 2) {
      await loadInitialCities();
      return;
    }

    const { data } = await api.get(`/cities?input=${searchText.value}`);

    cities.value = uniqueCities(normalizeCities(data)).slice(0, 100);
    open.value = true;
  }, 350);
}

function normalizeCities(data) {
  const list = Array.isArray(data)
    ? data
    : data?.data || data?.Data || data?.result || data?.Result || [];

  return list
    .map((item) => ({
      code:
        item.Code ||
        item.code ||
        item.CityCode ||
        item.IATACode ||
        item.AirportCode ||
        "",
      name:
        item.Name ||
        item.name ||
        item.CityName ||
        item.AirportName ||
        item.DisplayName ||
        "",
    }))
    .filter((x) => x.code && x.name);
}

function uniqueCities(list) {
  const map = new Map();

  list.forEach((city) => {
    if (!map.has(city.code)) {
      map.set(city.code, city);
    }
  });

  return [...map.values()];
}

function selectCity(city) {
  emit("update:code", city.code);
  emit("update:name", city.name);

  searchText.value = city.name;
  open.value = false;
}
</script>
