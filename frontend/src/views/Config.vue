<template>
  <AppNavbar />

  <main class="config-page">
    <section class="config-card">
      <div class="config-header">
        <div>
          <h1>Markup, Commission & Discount Management</h1>
          <p>Manage airline pricing rules and promotional discount codes.</p>
        </div>
      </div>

      <form class="config-form" @submit.prevent="save">
        <input
          v-model="cfg.airline_code"
          placeholder="Airline Code or blank for All"
        />

        <select v-model="cfg.markup_type">
          <option value="percent">Percent</option>
          <option value="flat">Flat</option>
        </select>

        <input
          v-model.number="cfg.markup_value"
          type="number"
          placeholder="Markup Value"
        />

        <select v-model="cfg.commission_type">
          <option value="percent">Percent</option>
          <option value="flat">Flat</option>
        </select>

        <input
          v-model.number="cfg.commission_value"
          type="number"
          placeholder="Commission Value"
        />

        <button class="primary" type="submit">Create</button>
      </form>

      <h2>Pricing Rules</h2>

      <table>
        <thead>
          <tr>
            <th>Airline</th>
            <th>Markup</th>
            <th>Commission</th>
            <th>Active</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in configs" :key="item.id">
            <td>{{ item.airline_code || "All" }}</td>
            <td>{{ item.markup_value }} {{ item.markup_type }}</td>
            <td>{{ item.commission_value }} {{ item.commission_type }}</td>
            <td>{{ item.is_active }}</td>
          </tr>
        </tbody>
      </table>

      <h2>Discount Codes</h2>

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Route/Airline</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in discounts" :key="item.id">
            <td>{{ item.code }}</td>
            <td>{{ item.discount_type }}</td>
            <td>{{ item.discount_value }}</td>
            <td>
              {{ item.airline_code || "Any Airline" }}
              /
              {{ item.route_from || "Any" }} - {{ item.route_to || "Any" }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AppNavbar from "../components/layout/AppNavbar.vue";
import { api } from "../services/api";

const configs = ref([]);
const discounts = ref([]);

const cfg = ref({
  airline_code: "",
  markup_type: "percent",
  markup_value: 8,
  commission_type: "percent",
  commission_value: 3,
});

async function load() {
  const { data } = await api.get("/config/lists");

  configs.value = data.configs || data.pricingConfigs || data || [];
  discounts.value = data.discounts || [];
}

async function save() {
  await api.post("/config/create", cfg.value);

  cfg.value = {
    airline_code: "",
    markup_type: "percent",
    markup_value: 8,
    commission_type: "percent",
    commission_value: 3,
  };

  await load();
}

onMounted(load);
</script>
