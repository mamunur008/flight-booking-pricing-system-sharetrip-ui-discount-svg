<template>
  <div class="airport-box">
    <div class="airport-code">
      {{ code || "---" }}
    </div>

    <div class="airport-info">
      <label>{{ label }}</label>

      <input
        v-model="searchText"
        :placeholder="placeholder"
        @focus="openDropdown"
        @input="handleInput"
      />

      <small>{{ selectedText }}</small>
    </div>

    <div v-if="open" class="airport-dropdown">
      <button
        v-for="city in cities"
        :key="city.id || city.code + city.name"
        type="button"
        class="airport-item"
        @mousedown.prevent="selectCity(city)"
      >
        <strong>{{ city.code }}</strong>

        <span>
          {{ city.city }}, {{ city.country }}
          <small>{{ city.airport }}</small>
        </span>
      </button>

      <div v-if="!cities.length" class="airport-empty">No airports found</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { api } from "../../services/api";

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

const selectedText = computed(() => props.name || "");

async function openDropdown() {
  open.value = true;
  await fetchCities(searchText.value || props.code || "dh");
}

function handleInput() {
  clearTimeout(timer);

  timer = setTimeout(() => {
    fetchCities(searchText.value || "dh");
  }, 300);
}

async function fetchCities(keyword) {
  const { data } = await api.get("/cities", {
    params: { input: keyword },
  });

  cities.value = normalizeCities(data);
}
function normalizeCities(data) {
  const list = Array.isArray(data) ? data : data?.data || data?.Data || [];

  return list
    .map((item) => {
      // Format 1: { AirportCode, SearchString }
      if (item.AirportCode && item.SearchString) {
        const [airport = "", city = "", country = ""] = String(
          item.SearchString,
        )
          .split(",")
          .map((x) => x.trim());

        return {
          id: item.ID,
          code: item.AirportCode,
          airport,
          city: city || airport,
          country,
          name: item.SearchString,
        };
      }

      // Format 2: { Code, Name, Country }
      return {
        id: item.ID || item.Code,
        code: item.Code || item.code || "",
        airport: item.Name || item.name || "",
        city: item.Name || item.name || "",
        country: item.Country || item.country || "",
        name: `${item.Name || item.name}, ${item.Country || item.country}`,
      };
    })
    .filter((x) => x.code && x.city);
}
function normalizeCities_m(data) {
  const list = Array.isArray(data) ? data : data?.data || data?.Data || [];

  return list
    .map((item) => {
      const [airport = "", city = "", country = ""] = String(
        item.SearchString || "",
      )
        .split(",")
        .map((x) => x.trim());

      return {
        id: item.ID,
        code: item.AirportCode,
        airport,
        city: city || airport,
        country,
        name: item.SearchString,
      };
    })
    .filter((x) => x.code);
}

function selectCity(city) {
  emit("update:code", city.code);
  emit("update:name", city.name);

  searchText.value = city.city;
  open.value = false;
}
</script>
