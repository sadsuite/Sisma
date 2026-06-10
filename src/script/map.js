// Map page logic separated from page markup
const map = L.map('map', {
    zoomControl: false
}).setView([20, 0], 2);

L.control.zoom({ position: 'bottomright' }).addTo(map);

// Define the area (SW and NE corners)
var bounds = L.latLngBounds(
    L.latLng(-85, -Infinity), // Southwest: Fixed Lat, Infinite West
    L.latLng(85, Infinity)   // Northeast: Fixed Lat, Infinite East
);

// Set bounds and lock panning
map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});   

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 3,
}).addTo(map);

const apiUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2026-01-01&limit=12&orderby=time';
const apiAlert = document.getElementById('api-alert');
const apiAlertBody = document.getElementById('api-alert-body');

function showApiAlert(message) {
    if (!apiAlert || !apiAlertBody) return;
    apiAlertBody.textContent = message;
    apiAlert.classList.remove('d-none');
    apiAlert.classList.add('api-alert-visible');
    apiAlert.style.display = 'block';
}

function hideApiAlert() {
    if (!apiAlert) return;
    apiAlert.classList.add('d-none');
    apiAlert.classList.remove('api-alert-visible');
    apiAlert.style.display = 'none';
}

function getColor(mag) {
    return mag >= 5.0 ? varStyle('--accent-danger') :
            mag >= 3.0 ? varStyle('--accent-warning') :
                        varStyle('--accent-safe');
}

function varStyle(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const features = data.features;
        const markersGroup = [];

        features.forEach(quake => {
            const coords = quake.geometry.coordinates;
            const props = quake.properties;
            const lat = coords[1];
            const lng = coords[0];
            const mag = props.mag ? props.mag.toFixed(1) : 'N/A';
            const date = new Date(props.time).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
            });
            const markerColor = getColor(props.mag);

            const marker = L.circleMarker([lat, lng], {
                radius: Math.max(props.mag * 3, 6),
                fillColor: markerColor,
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7
            }).addTo(map);

            const popupContent = `
                <div class="eq-card">
                    <div class="eq-header">
                        <span class="eq-mag" style="color: ${markerColor}">${mag}</span>
                        <span class="eq-badge" style="background-color: ${markerColor}">Magnitude</span>
                    </div>
                    <div class="eq-place">${props.place}</div>
                    <div class="eq-time">${date}</div>
                    <a href="${props.url}" target="_blank" class="eq-link">View Event Details →</a>
                </div>
            `;

            marker.bindPopup(popupContent, {
                closeButton: true,
                offset: L.point(0, -5)
            });

            markersGroup.push([lat, lng]);
        });

        if (markersGroup.length > 0) {
            map.fitBounds(markersGroup, { padding: [50, 50] });
        }
        hideApiAlert();
    })
    .catch(error => {
        console.error('Error fetching earthquake data:', error);
        showApiAlert('Earthquake API unavailable — map data cannot be loaded.');
    });
