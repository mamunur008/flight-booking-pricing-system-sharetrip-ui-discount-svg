<template>
  <div class="svg-page">
    <aside class="svg-side">
      <h2>SVG<span style="color: #49e68b">Editor</span></h2>

      <button class="primary" @click="fileInput?.click()">New file</button>
      <input
        ref="fileInput"
        type="file"
        accept=".svg"
        hidden
        @change="uploadFile"
      />

      <h4>AVAILABLE REPLACEMENTS:</h4>

      <label
        >👤 NAME
        <pre>{{ name }}</pre>
      </label>
      <input v-model="name" class="field" placeholder="e.g. John Doe" />

      <label
        >🏷 TITLE
        <pre>{{ title }}</pre>
      </label>
      <input v-model="title" class="field" placeholder="e.g. Senior Engineer" />

      <label
        >📝 DESCRIPTION
        <pre>{{ description }}</pre>
      </label>
      <textarea v-model="description" class="field" rows="4" />

      <button class="download" @click="downloadPng">Download .PNG</button>
      <p>{{ msg }}</p>
    </aside>

    <main class="svg-canvas">
      <div>
        <h2>
          Your Favorite<br />
          ▣ SVG<span style="color: #49e68b">Editor</span>
        </h2>
        <div class="svg-preview" v-html="editedSvg"></div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "../services/api";

const fileInput = ref(null);
const svgContent = ref(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400">
  <rect width="1200" height="400" fill="#111" />

  <text
    x="80"
    y="120"
    fill="#ffffff"
    font-size="48"
    font-weight="700"
    font-family="Arial, Helvetica, sans-serif"
  >{{name}}</text>

  <text
    x="80"
    y="190"
    fill="#cccccc"
    font-size="34"
    font-family="Arial, Helvetica, sans-serif"
  >{{title}}</text>

  <text
    x="80"
    y="250"
    fill="#ffd400"
    font-size="28"
    font-family="Arial, Helvetica, sans-serif"
  >{{description}}</text>
</svg>
`);

const finalSvg_old = computed(() => {
  return svgContent.value
    .replaceAll("{{name}}", name.value)
    .replaceAll("{{title}}", title.value)
    .replaceAll("{{description}}", description.value);
});
const finalSvg = computed(() => {
  return svgContent.value
    .replaceAll("{{name}}", escapeXml(name.value))
    .replaceAll("{{title}}", escapeXml(title.value))
    .replaceAll("{{description}}", escapeXml(description.value));
});
const raw = ref("");
const name = ref("Mamunur Rashid");
const title = ref("Solution Architect");
const description = ref("Flight Booking Pricing System");
const msg = ref("");

const editedSvg = computed(() => {
  return raw.value
    .replaceAll("{{name}}", name.value)
    .replaceAll("{{title}}", title.value)
    .replaceAll("{{description}}", description.value);
});
function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
async function uploadFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  raw.value = await file.text();
}

async function loadSample() {
  const response = await fetch("/samples/banner_template.svg");
  raw.value = await response.text();
}
async function downloadPng() {
  const { data } = await api.post("/upload/svg", {
    name: name.value,
    title: title.value,
    description: description.value,
    svgContent: finalSvg.value,
  });

  const response = await api.get(`/svg/download/${data.fileName}`, {
    responseType: "blob",
  });

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = data.fileName;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}
async function downloadPng1() {
  const token = localStorage.getItem("token");

  const { data } = await api.post("/upload/svg", {
    name: name.value,
    title: title.value,
    description: description.value,
    svgContent: finalSvg.value,
  });

  const fileName = data.fileName;

  const response = await api.get(`/svg/download/${fileName}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}
async function downloadPng_old() {
  const formData = new FormData();
  formData.append("svgContent", raw.value);
  formData.append("name", name.value);
  formData.append("title", title.value);
  formData.append("description", description.value);

  const { data } = await api.post("/upload/svg", formData);
  const baseUrl = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
  ).replace("/api", "");
  window.open(`${baseUrl}${data.downloadUrl}`, "_blank");
  msg.value = "PNG generated";
}

onMounted(loadSample);
</script>
