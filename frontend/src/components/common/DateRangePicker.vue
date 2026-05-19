<template>
  <div class="date-picker-wrapper">
    <div class="date-box" @click="open = true">
      <label>{{ startLabel }}</label>

      <strong class="date-day">
        {{ startParts.day }}
      </strong>

      <div class="date-meta">
        <b>{{ startParts.month }}</b>
        <small>{{ startParts.weekdayYear }}</small>
      </div>
    </div>

    <div v-if="range" class="date-box" @click="open = true">
      <label>{{ endLabel }}</label>

      <strong class="date-day">
        {{ endParts.day }}
      </strong>

      <div class="date-meta">
        <b>{{ endParts.month }}</b>
        <small>{{ endParts.weekdayYear }}</small>
      </div>
    </div>

    <div v-if="range" class="date-box" @click="open = true">
      <label>{{ endLabel }}</label>
      <strong>{{ endDay }}</strong>
      <div>
        <b>{{ endMonth }}</b>
        <small>{{ endText }}</small>
      </div>
    </div>

    <div v-if="open" class="calendar-popover">
      <div class="calendar-header">
        <button @click.stop="prevMonth">‹</button>
        <b>{{ monthTitle }}</b>
        <button @click.stop="nextMonth">›</button>
      </div>

      <div class="calendar-week">
        <span v-for="d in weekDays" :key="d">{{ d }}</span>
      </div>

      <div class="calendar-grid">
        <button
          v-for="day in calendarDays"
          :key="day.key"
          :class="{
            selected: isSelected(day.date),
            inRange: isInRange(day.date),
            muted: !day.currentMonth,
          }"
          @click.stop="selectDate(day.date)"
        >
          {{ day.day }}
        </button>
      </div>

      <div class="calendar-actions">
        <button @click.stop="open = false">Cancel</button>
        <button class="primary-small" @click.stop="apply">Apply</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  startDate: String,
  endDate: String,
  range: Boolean,
  startLabel: { type: String, default: "Departure" },
  endLabel: { type: String, default: "Return" },
});

const emit = defineEmits(["update:startDate", "update:endDate", "change"]);

const open = ref(false);
const viewDate = ref(new Date(props.startDate || new Date()));
const tempStart = ref(props.startDate);
const tempEnd = ref(props.endDate);

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const monthTitle = computed(() =>
  viewDate.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
);

const calendarDays = computed(() => {
  const year = viewDate.value.getFullYear();
  const month = viewDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  start.setDate(start.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    return {
      key: d.toISOString(),
      date: toIso(d),
      day: d.getDate(),
      currentMonth: d.getMonth() === month,
    };
  });
});

function toIso(date) {
  return date.toISOString().slice(0, 10);
}

function formatParts(value) {
  if (!value) {
    return {
      day: "--",
      month: "",
      weekdayYear: "",
    };
  }

  const d = new Date(value);

  return {
    day: d.getDate(),
    month: d.toLocaleDateString("en-US", {
      month: "short",
    }),
    weekdayYear: d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
    }),
  };
}

const startParts = computed(() => formatParts(props.startDate));
const endParts = computed(() => formatParts(props.endDate));

const startDay = computed(() => startParts.value.day);
const startMonth = computed(() => startParts.value.month);
const startText = computed(() => startParts.value.text);

const endDay = computed(() => endParts.value.day);
const endMonth = computed(() => endParts.value.month);
const endText = computed(() => endParts.value.text);

function prevMonth() {
  viewDate.value = new Date(
    viewDate.value.getFullYear(),
    viewDate.value.getMonth() - 1,
    1,
  );
}

function nextMonth() {
  viewDate.value = new Date(
    viewDate.value.getFullYear(),
    viewDate.value.getMonth() + 1,
    1,
  );
}

function selectDate(date) {
  if (!props.range) {
    tempStart.value = date;
    return;
  }

  if (!tempStart.value || tempEnd.value) {
    tempStart.value = date;
    tempEnd.value = "";
    return;
  }

  if (date < tempStart.value) {
    tempEnd.value = tempStart.value;
    tempStart.value = date;
  } else {
    tempEnd.value = date;
  }
}

function isSelected(date) {
  return date === tempStart.value || date === tempEnd.value;
}

function isInRange(date) {
  return (
    props.range &&
    tempStart.value &&
    tempEnd.value &&
    date > tempStart.value &&
    date < tempEnd.value
  );
}

function apply() {
  emit("update:startDate", tempStart.value);

  if (props.range) {
    emit("update:endDate", tempEnd.value);
  }

  emit("change", {
    startDate: tempStart.value,
    endDate: props.range ? tempEnd.value : "",
  });

  open.value = false;
}
</script>
