<template>
  <div class="autocomplete-wrap">
    <input
      v-model="searchText"
      class="autocomplete-input"
      placeholder="Airline Code or blank for All"
      @focus="openDropdown"
      @input="filterAirlines"
    />

    <div v-if="open" class="autocomplete-dropdown">
      <button type="button" class="autocomplete-item" @click="selectAll">
        <strong>ALL</strong>
        <span>All Airlines</span>
      </button>

      <button
        v-for="airline in filteredAirlines"
        :key="airline.code"
        type="button"
        class="autocomplete-item"
        @click="selectAirline(airline)"
      >
        <strong>{{ airline.code }}</strong>
        <span>{{ airline.name }}</span>
      </button>

      <div v-if="!filteredAirlines.length" class="autocomplete-empty">
        No airlines found
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { api } from "../../services/api";

const emit = defineEmits(["update:code", "update:name"]);

const open = ref(false);
const searchText = ref("");
const airlines = ref([]);

const filteredAirlines = computed(() => {
  const q = searchText.value.toLowerCase();

  if (!q) {
    return airlines.value.slice(0, 100);
  }

  return airlines.value
    .filter(
      (x) =>
        x.code.toLowerCase().includes(q) || x.name.toLowerCase().includes(q),
    )
    .slice(0, 100);
});

async function openDropdown() {
  open.value = true;

  if (!airlines.value.length) {
    await loadAirlines();
  }
}

async function loadAirlines() {
  const { data } = await api.get("/airlines");

  const list = Array.isArray(data) ? data : data.data || data.Data || [];

  airlines.value = list
    .map((item) => ({
      code:
        item.Code ||
        item.code ||
        item.AirlineCode ||
        item.airlineCode ||
        item.IATACode ||
        "",
      name:
        item.Name ||
        item.name ||
        item.AirlineName ||
        item.airlineName ||
        item.DisplayName ||
        "",
    }))
    .filter((x) => x.code && x.name);
}

function filterAirlines() {
  open.value = true;
}

function selectAirline(airline) {
  searchText.value = `${airline.code} - ${airline.name}`;

  emit("update:code", airline.code);
  emit("update:name", airline.name);

  open.value = false;
}

function selectAll() {
  searchText.value = "All Airlines";

  emit("update:code", "");
  emit("update:name", "All Airlines");

  open.value = false;
}
</script>
