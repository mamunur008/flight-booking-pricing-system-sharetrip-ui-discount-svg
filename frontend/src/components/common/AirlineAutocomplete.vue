<template>
  <div class="airline-select-wrap">
    <el-select
      v-model="selectedValue"
      filterable
      remote
      reserve-keyword
      clearable
      :remote-method="searchAirlines"
      :loading="loading"
      placeholder="Airline Code or blank for All"
      class="airline-select"
      @focus="loadAirlines"
      @change="handleChange"
    >
      <el-option label="ALL - All Airlines" value="">
        <div class="airline-option">
          <strong>ALL</strong>
          <span>All Airlines</span>
        </div>
      </el-option>

      <el-option
        v-for="airline in airlines"
        :key="airline.code"
        :label="`${airline.code} - ${airline.name}`"
        :value="airline.code"
      >
        <div class="airline-option">
          <strong>{{ airline.code }}</strong>

          <span>{{ airline.name }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "../../services/api";

const emit = defineEmits(["update:code", "update:name"]);

const loading = ref(false);

const airlines = ref([]);

const selectedValue = ref("");

const allAirlines = ref([]);

async function loadAirlines() {
  if (allAirlines.value.length) return;

  loading.value = true;

  try {
    // const { data } = await api.get("/airlines");
    const { data } = await api.get("/airlines", {
      params: {
        search: query,
      },
    });

    const list = Array.isArray(data) ? data : data.data || data.Data || [];

    allAirlines.value = list
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

    airlines.value = allAirlines.value.slice(0, 100);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

async function searchAirlines(query) {
  if (!allAirlines.value.length) {
    await loadAirlines();
  }

  if (!query) {
    airlines.value = allAirlines.value.slice(0, 100);

    return;
  }

  const q = query.toLowerCase();

  airlines.value = allAirlines.value
    .filter(
      (x) =>
        x.code.toLowerCase().includes(q) || x.name.toLowerCase().includes(q),
    )
    .slice(0, 100);
}

function handleChange(value) {
  if (!value) {
    emit("update:code", "");
    emit("update:name", "All Airlines");

    return;
  }

  const airline = allAirlines.value.find((x) => x.code === value);

  if (!airline) return;

  emit("update:code", airline.code);

  emit("update:name", airline.name);
}
</script>

<style scoped>
.airline-select-wrap {
  width: 100%;
  position: relative;
}

.airline-select {
  width: 100%;
}

.airline-select :deep(.el-input__wrapper) {
  min-height: 58px;
  border-radius: 16px;
  box-shadow: none !important;
  border: 1px solid #dbe4f0;
  background: #fff;
  padding: 0 16px;
}

.airline-select :deep(.el-input__inner) {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.airline-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 0;
}

.airline-option strong {
  min-width: 52px;
  color: #1677ff;
  font-size: 16px;
  font-weight: 800;
}

.airline-option span {
  color: #1e293b;
  font-size: 14px;
  line-height: 1.3;
}
</style>
