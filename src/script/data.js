const apiUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2026-01-01&limit=12&orderby=time';
const apiAlert = document.getElementById('api-alert');
const apiAlertBody = document.getElementById('api-alert-body');
const liveBadge = document.querySelector('.live-badge');

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

function setLiveStatus(isOnline) {
    if (!liveBadge) return;
    if (isOnline) {
        liveBadge.classList.remove('offline');
    } else {
        liveBadge.classList.add('offline');
    }
}

function getMagnitudeColors(mag) {
    if (mag >= 5.0) return { bg: 'rgba(255, 77, 77, 0.15)', text: '#ff4d4d', border: '#ff4d4d' };
    if (mag >= 3.0) return { bg: 'rgba(255, 178, 36, 0.15)', text: '#ffb224', border: '#ffb224' };
    return { bg: 'rgba(23, 201, 100, 0.15)', text: '#17c964', border: '#17c964' };
}

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const features = data.features;
        let magnitudes = [];
        let labels = [];
        let totalMag = 0;
        let maxMag = 0;
        let maxMagLoc = '';
        let significantCount = 0;
        const feedContainer = document.getElementById('feed-container');

        const processedFeatures = [...features].reverse();

        features.forEach((quake, index) => {
            const props = quake.properties;
            const mag = props.mag ? parseFloat(props.mag.toFixed(1)) : 0;
            totalMag += mag;
            if (mag > maxMag) {
                maxMag = mag;
                maxMagLoc = props.place;
            }
            if (mag >= 5.0) significantCount++;

            const date = new Date(props.time).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
            });
            const colorStyle = getMagnitudeColors(mag);

            const feedItem = document.createElement('div');
            feedItem.className = 'feed-item';
            feedItem.innerHTML = `
                <div class="feed-info">
                    <span class="feed-place">${props.place}</span>
                    <span class="feed-time">${date} &bull; Ref: ${props.code}</span>
                </div>
                <div class="feed-mag" style="background: ${colorStyle.bg}; color: ${colorStyle.text}">
                    ${mag.toFixed(1)}
                </div>
            `;
            feedContainer.appendChild(feedItem);
        });

        processedFeatures.forEach(quake => {
            magnitudes.push(quake.properties.mag ? quake.properties.mag.toFixed(1) : 0);
            const splitPlace = quake.properties.place.split(' of ');
            labels.push(splitPlace[1] || splitPlace[0]);
        });

        document.getElementById('max-mag').innerText = maxMag.toFixed(1);
        document.getElementById('max-mag-loc').innerText = maxMagLoc;
        document.getElementById('avg-mag').innerText = (totalMag / features.length).toFixed(1);
        document.getElementById('significant-count').innerText = significantCount;

        hideApiAlert();
        setLiveStatus(true);

        const ctx = document.getElementById('magnitudeChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Magnitude',
                    data: magnitudes,
                    backgroundColor: magnitudes.map(m => getMagnitudeColors(parseFloat(m)).bg.replace('0.15', '0.75')),
                    borderRadius: 6,
                    borderSkipped: false,
                    maxBarThickness: 32
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        padding: 12,
                        backgroundColor: '#111418',
                        titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
                        bodyFont: { family: 'Plus Jakarta Sans', size: 13 },
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { family: 'Plus Jakarta Sans', size: 10 },
                            color: '#687076',
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    y: {
                        grid: { color: '#e6e8eb', drawBorder: false },
                        ticks: {
                            font: { family: 'Plus Jakarta Sans', size: 11 },
                            color: '#687076',
                            stepSize: 1
                        },
                        min: 0
                    }
                }
            }
        });
    })
    .catch(err => {
        console.error('Error fetching dashboard data:', err);
        showApiAlert('Earthquake API unavailable — data may be stale or offline.');
        setLiveStatus(false);
    });
