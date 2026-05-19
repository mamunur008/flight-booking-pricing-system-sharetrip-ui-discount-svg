<template>
  <div class="flight-card">
    <div v-if="tag" class="tag">{{ tag }}</div>

    <div class="flight-main">
      <div>
        <div class="logo">{{ flight.airlineCode }}</div>
        <b>{{ origin }} - {{ dest }}</b>
        <p class="muted">
          {{ flight.airlineName }}<br />
          {{ duration }}
        </p>
      </div>

      <div>
        <h3>{{ dep }}</h3>
        <p class="muted">Departure</p>
      </div>

      <div>
        <h3>{{ arr }}</h3>
        <p class="muted">Arrival</p>
      </div>

      <div>
        <h3>Non-Stop</h3>
        <p>{{ dest }}</p>
        <small>{{
          flight.refundable ? "Partially Refundable" : "Non-Refundable"
        }}</small>
      </div>

      <div class="pricebox">
        <b>🎟 {{ flight.discountCode || "CITYDMO526" }}</b>
        <p class="price">
          ৳ {{ Number(flight.customerPrice || 0).toLocaleString() }}
        </p>
        <p class="old">
          ৳ {{ Number(flight.grossFare || 0).toLocaleString() }}
        </p>
        <button class="primary">Select ›</button>
      </div>
    </div>

    <div class="detail-link">View Detail⌄</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  flight: {
    type: Object,
    required: true,
  },
  tag: {
    type: String,
    default: "",
  },
});

const seg = computed(() => props.flight.segments?.[0] || {});
const origin = computed(() => seg.value.Origin || seg.value.origin || "DAC");
const dest = computed(
  () => seg.value.Destination || seg.value.destination || "CXB",
);

const dep = computed(() => {
  const value =
    seg.value.DepartureTime || seg.value.departureTime || Date.now();
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
});

const arr = computed(() => {
  const value = seg.value.ArrivalTime || seg.value.arrivalTime || Date.now();
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
});

const duration = computed(() => {
  const mins = Number(seg.value.DurationMinutes || 65);
  return `${Math.floor(mins / 60)}hr ${mins % 60}min`;
});
</script>
