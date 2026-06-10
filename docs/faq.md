# FAQ

## 1. Come posso visualizzare il sito?
Il sito è pubblicamente accessibile su GitHub:

👉 **[Visita la Repo](https://github.com/sadsuite/Sisma.git)**

Altrimenti è disponibile una versione live hostata su GitHub Pages:

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Site-brightgreen?style=for-the-badge)](https://sadsuite.github.io/Sisma/)

## 2. Quali pagine contiene il progetto?
Il sito include tre pagine principali:
- `index.html` per la homepage,
- `map.html` per la mappa interattiva dei terremoti,
- `data.html` per la dashboard con grafici e statistiche.

## 3. Cosa succede se l'API dei terremoti non risponde?
Se l'API non è disponibile, il sito mostra un messaggio di avviso e utilizza un fallback locale quando possibile. In questo modo la pagina resta visibile e il comportamento rimane leggibile.

## 4. Quali librerie esterne vengono usate?
Il progetto utilizza principalmente:
- `Leaflet` per la mappa interattiva,
- `Chart.js` per i grafici della dashboard,
- `Bootstrap` per alcuni stili e componenti UI.

## 5. Posso modificare i dati o aggiungere nuovi eventi?
Sì. Puoi aggiornare `src/data.json` e il codice JavaScript in `src/script/` per gestire nuove sorgenti dati. Se vuoi usi nuovi dataset, assicurati che siano in formato compatibile con il codice attuale.
