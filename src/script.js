// Script per: Dashboard terremoti recenti
// FISM 2026 - Tema con API remota.
// Prova prima a caricare la API remota. Se fallisce, usa data.json.

const THEME_KIND = "usgs";
const API_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2026-01-01&limit=12&orderby=time";

const container = document.querySelector("#data-container");
const statusMessage = document.querySelector("#status-message");
const DATA_JSON_URL = document.currentScript ? new URL("data.json", document.currentScript.src).href : "data.json";

function setStatus(message, type = "info") {
  if (!statusMessage) return;
  statusMessage.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
}

function clearStatus() {
  if (statusMessage) statusMessage.innerHTML = "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createCard(item) {
  const image = item.image ? `<img src="${escapeHtml(item.image)}" class="card-img-top" alt="${escapeHtml(item.title)}">` : "";
  const meta = item.meta ? `<span class="badge text-bg-primary">${escapeHtml(item.meta)}</span>` : "";
  return `
    <div class="col-md-4">
      <article class="card h-100 shadow-sm">
        ${image}
        <div class="card-body">
          <h3 class="card-title h5">${escapeHtml(item.title)}</h3>
          <p class="card-text">${escapeHtml(item.body)}</p>
          ${meta}
        </div>
      </article>
    </div>
  `;
}

function render(items) {
  if (!container) return;
  container.innerHTML = items.map(createCard).join("");
}

async function loadFallback() {
  const response = await fetch(DATA_JSON_URL);
  if (!response.ok) throw new Error("Impossibile caricare data.json");
  const data = await response.json();
  return data.items || [];
}

async function loadRemote() {
  if (THEME_KIND === "usgs") return await loadUSGS();
  throw new Error("Tema non riconosciuto");
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Errore richiesta: ${url}`);
  return await response.json();
}

async function loadUSGS() {
  const data = await fetchJson(API_URL);
  return data.features.slice(0, 12).map(f => ({
    title: f.properties.place || "Luogo non disponibile",
    body: `Magnitudo: ${f.properties.mag ?? "n.d."}. Tipo: ${f.properties.type}.`,
    meta: new Date(f.properties.time).toLocaleString("it-IT")
  }));
}

async function init() {
  try {
    setStatus("Caricamento dati dalla API remota...", "info");
    const items = await loadRemote();
    render(items);
    clearStatus();
  } catch (error) {
    console.warn(error);
    setStatus("API non disponibile: uso i dati locali di fallback da data.json.", "warning");
    try {
      const items = await loadFallback();
      render(items);
    } catch (fallbackError) {
      console.error(fallbackError);
      setStatus("Errore: non riesco a caricare né la API remota né data.json.", "danger");
    }
  }
}

init();

document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');

    // Toggle menu state on click
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
});