<template>
  <el-select
    v-model="selected"
    filterable
    remote
    reserve-keyword
    clearable
    :placeholder="placeholder"
    :remote-method="searchAirports"
    :loading="loading"
    class="airport-el-select"
    @change="selectAirport"
  >
    <el-option
      v-for="item in airports"
      :key="item.code + item.name"
      :label="`${item.code} - ${item.city}, ${item.country}`"
      :value="item.code"
    >
      <div class="airport-option">
        <strong>{{ item.code }}</strong>
        <span>
          {{ item.city }}, {{ item.country }}
          <small>{{ item.airport }}</small>
        </span>
      </div>
    </el-option>
  </el-select>
</template>

<script setup>
import { ref } from "vue";
import { api } from "../../services/api";

const props = defineProps({
  placeholder: String,
});

const emit = defineEmits(["select"]);

const selected = ref("");
const loading = ref(false);
const airports = ref([]);

async function searchAirports(query) {
  if (!query) {
    airports.value = [];
    return;
  }

  loading.value = true;

  try {
    const { data } = await api.get("/cities", {
      params: { input: query },
    });

    airports.value = normalizeCities(data);
  } finally {
    loading.value = false;
  }
}

function normalizeCities(data) {
  const list = Array.isArray(data) ? data : data?.data || [];

  return list
    .map((item) => {
      if (item.AirportCode && item.SearchString) {
        const [airport = "", city = "", country = ""] = item.SearchString.split(
          ",",
        ).map((x) => x.trim());

        return {
          code: item.AirportCode,
          airport,
          city: city || airport,
          country,
          name: item.SearchString,
        };
      }

      return {
        code: item.Code,
        airport: item.Name,
        city: item.Name,
        country: item.Country,
        name: `${item.Name}, ${item.Country}`,
      };
    })
    .filter((x) => x.code);
}

function selectAirport(code) {
  const airport = airports.value.find((x) => x.code === code);

  if (!airport) return;

  emit("select", airport);
}
</script>
