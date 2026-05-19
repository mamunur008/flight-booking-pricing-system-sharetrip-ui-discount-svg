<template>
  <AppNavbar />

  <FlightHeroSearch
    v-if="!hasSearched"
    :form="form"
    @update:form="updateForm"
    @search="search"
  />

  <!-- <FlightResultPage
    v-else
    :form="form"
    :flights="flights"
    :filter="filter"
    :loading="loading"
    :error="error"
    @modify="hasSearched = false"
    @search="search"
  /> -->
  <FlightResultPage
    v-else
    :form="form"
    :flights="flights"
    :filter="filter"
    :loading="loading"
    :error="error"
    @modify="hasSearched = false"
    @filter-change="filterFlights"
  />
</template>

<script setup>
import { ref } from "vue";
import { api } from "../services/api";

import FlightHeroSearch from "../components/flight/home/FlightHeroSearch.vue";
import FlightResultPage from "../components/flight/results/FlightResultPage.vue";
import AppNavbar from "../components/layout/AppNavbar.vue";

const hasSearched = ref(false);
const loading = ref(false);
const error = ref("");

const form = ref({
  JourneyType: 2,
  Origin: "DAC",
  Destination: "CXB",
  DepartureDate: "2026-05-20",
  ReturnDate: "2026-05-22",
  ClassType: "Economy",
  NoOfAdult: 1,
  NoOfChildren: 0,
  NoOfInfant: 0,
  discountCode: "INTERVIEW10",
});

const flights = ref([]);
const filter = ref({ airline_code: [] });

function updateForm(payload) {
  form.value = {
    ...form.value,
    ...payload,
  };
}

async function filterFlights(filterPayload) {
  try {
    loading.value = true;

    const { data } = await api.post("/filter", {
      ...filterPayload,
      flights: flights.value,
    });

    flights.value = data.flights || [];
  } finally {
    loading.value = false;
  }
}
async function search(payload) {
  const requestPayload = {
    ...form.value,
    ...(payload || {}),
  };

  form.value = requestPayload;

  try {
    loading.value = true;
    error.value = "";

    // IMPORTANT: this opens result page/component
    hasSearched.value = true;

    const { data } = await api.post("/flights/search", requestPayload);
    flights.value = data.flights || [];
    filter.value = data.filter || { airline_code: [] };
  } catch (err) {
    console.log(err);
    error.value = err.response?.data?.message || "Flight search failed";
  } finally {
    loading.value = false;
  }
}
</script>
