# API utilizzate

Questo progetto utilizza principalmente le API pubbliche del servizio USGS (United States Geological Survey) per recuperare i dati sui terremoti più recenti.

## API principale

- **Servizio:** USGS Earthquake API
- **Endpoint:** `https://earthquake.usgs.gov/fdsnws/event/1/query`
- **Parametri principali usati:**
  - `format=geojson` — restituisce i dati in formato GeoJSON
  - `starttime=2026-01-01` — data di inizio per l'intervallo di eventi
  - `limit=12` — numero massimo di eventi restituiti
  - `orderby=time` — ordina gli eventi per tempo (più recenti prima)

### Richiesta esempio

```text
https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2026-01-01&limit=12&orderby=time
```

## Uso nel progetto

- `src/script/map.js` usa questo endpoint per posizionare i marker dei terremoti sulla mappa Leaflet.
- `src/script/data.js` usa lo stesso endpoint per costruire la dashboard, calcolare statistiche e generare il grafico Chart.js.

## Fallback locale

In aggiunta all'API remota, il progetto include un file locale di dati (`src/data.json`) che può essere usato come fallback quando l'API non è disponibile. Questo file non è un endpoint esterno, ma viene utilizzato internamente dal codice per mantenere l'app funzionante anche in assenza di connessione alla rete o quando l'API USGS non risponde.

## Nota

L'API USGS è pubblica e gratuita, quindi non richiede chiavi di accesso per gli endpoint utilizzati in questo progetto.
