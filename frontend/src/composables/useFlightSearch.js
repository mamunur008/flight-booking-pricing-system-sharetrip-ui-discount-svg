import { computed, ref } from "vue";
import { api } from "../services/api";

const defaultForm = {
  JourneyType: 2,
  Origin: "DAC",
  Destination: "CXB",
  DepartureDate: "2026-05-14",
  ReturnDate: "2026-05-16",
  ClassType: "Economy",
  NoOfAdult: 1,
  NoOfChildren: 0,
  NoOfInfant: 0,
  discountCode: "INTERVIEW10",
};

export function useFlightSearch() {
  const form = ref({ ...defaultForm });
  const flights = ref([]);
  const filter = ref({ airline_code: [] });
  const loading = ref(false);
  const error = ref("");

  const prices = computed(() =>
    flights.value.map((x) => Number(x.customerPrice || 0)).filter(Boolean),
  );
  const min = computed(() =>
    prices.value.length ? Math.min(...prices.value) : 0,
  );
  const max = computed(() =>
    prices.value.length ? Math.max(...prices.value) : 0,
  );

  const tripTitle = computed(
    () => `${form.value.Origin} — ${form.value.Destination}`,
  );
  const tripMeta = computed(() => {
    const type = form.value.JourneyType === 2 ? "Round Trip" : "One Way";
    return `${type} · ${form.value.DepartureDate} · ${form.value.NoOfAdult} Traveller · ${form.value.ClassType}`;
  });

  async function search() {
    loading.value = true;
    error.value = "";
    try {
      const { data } = await api.post("/flights/search", form.value);
      flights.value = data.flights || [];
      filter.value = data.filter || { airline_code: [] };
    } catch (err) {
      if (err.response?.status === 401) {
        location.href = "/login";
        return;
      }
      error.value = err.response?.data?.message || "Flight search failed";
    } finally {
      loading.value = false;
    }
  }

  return {
    form,
    flights,
    filter,
    loading,
    error,
    min,
    max,
    tripTitle,
    tripMeta,
    search,
  };
}
