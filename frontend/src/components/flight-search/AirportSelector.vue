<template>
  <div class="airport-box">
    <div class="airport-code">{{ code }}</div>

    <div class="airport-info">
      <label>{{ label }}</label>

      <input
        v-model="searchText"
        :placeholder="placeholder"
        @input="searchCities"
        @focus="open = true"
      />

      <small>{{ name }}</small>
    </div>

    <div v-if="open && cities.length" class="airport-dropdown">
      <button
        v-for="city in cities"
        :key="city.Code || city.code || city.CityCode"
        type="button"
        @click="selectCity(city)"
      >
        <strong>{{ city.Code || city.code || city.CityCode }}</strong>
        <span>
          {{ city.Name || city.name || city.CityName || city.AirportName }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "../../services/api";

const props = defineProps({
  label: String,
  code: String,
  name: String,
  placeholder: String,
});

const emit = defineEmits(["update:code", "update:name"]);

const searchText = ref("");
const cities = ref([]);
const open = ref(false);
let timer = null;

async function searchCities() {
  clearTimeout(timer);

  timer = setTimeout(async () => {
    if (!searchText.value || searchText.value.length < 2) {
      cities.value = [];
      return;
    }

    const { data } = await api.get(`/cities?input=${searchText.value}`);

    cities.value = Array.isArray(data) ? data : data.data || [];
    open.value = true;
  }, 400);
}

function selectCity(city) {
  const code = city.Code || city.code || city.CityCode || city.IATACode;
  const name =
    city.Name ||
    city.name ||
    city.CityName ||
    city.AirportName ||
    city.CountryName ||
    "";

  emit("update:code", code);
  emit("update:name", name);

  searchText.value = name;
  open.value = false;
}
</script>
