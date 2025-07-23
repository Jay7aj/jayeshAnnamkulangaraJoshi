
let map = null;
let baseLayers = {};
let layerControl = null;
let countryBorderLayer = null;
let capitalMarker = null;

// Loader functions
function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}
showLoader();

//function to return base Map layers
function getBaseLayers() {
    return {
        'Open Street Map': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
        'Airports': L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a>, © OpenStreetMap contributors'
        }),
        'Satellite': L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg', {
            maxZoom: 20,
            attribution: '&copy; CNES, Airbus DS, PlanetObserver, OpenMapTiles, OpenStreetMap'
        }),
        'Watercolor': L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
            maxZoom: 16,
            attribution: '&copy; Stamen, Stadia Maps, OpenMapTiles, OpenStreetMap'
        }),
    };
}

//function to return weather data
function printweather(lat, lng){
    showLoader();
    $.ajax({
        url: "weather.php",
        type: "GET",
        dataType: "json",
        data: { 
            lat: lat, 
            lng: lng, 
        },
        success: function(result) {
            const data = result.data.weatherObservation;

            document.getElementById("wDateTime").innerHTML = data.datetime;
            document.getElementById("station").innerHTML = data.stationName;
            document.getElementById("temp").innerHTML = `${data.temperature} deg Cel`;
            document.getElementById("clouds").innerHTML = data.clouds;
            document.getElementById("humidity").innerHTML = data.humidity;
            document.getElementById("dewPoint").innerHTML = data.dewPoint;
            document.getElementById("windSpeed").innerHTML = `${data.windSpeed} knots`;
            
            hideLoader();
        },
        error: function(err) {
            console.error("Details AJAX error", err);
            hideLoader();
        }
    });
}

//function to return time data
function printTimeInfo(lat, lng){
    showLoader();
    $.ajax({
        url: "timezone.php",
        type: "GET",
        dataType: "json",
        data: { 
            lat: lat, 
            lng: lng, 
        },
        success: function(result) {
            const data = result.data;

            document.getElementById("timezoneId").innerHTML = data.timezoneId;
            document.getElementById("sunrise").innerHTML = data.sunrise.split(" ")[1];
            document.getElementById("sunset").innerHTML = data.sunset.split(" ")[1];
            document.getElementById("cTime").innerHTML = data.time.split(" ")[1];
            document.getElementById("cDate").innerHTML = data.time.split(" ")[0];
            
            hideLoader();
        },
        error: function(err) {
            console.error("Details AJAX error", err);
            hideLoader();
        }
    });
}

//function to load country details
function loadCountryDetails(countryCode) {
    showLoader();
    $.ajax({
        url: "countryDetails.php",
        type: "GET",
        dataType: "json",
        data: { code: countryCode },
        success: function(result) {
            const data = result.data;

            const langHTML = `<p>${Object.values(data.languages).join(", ")}</p>`;
            const flagHTML = `<img src="${data.flags.svg}" alt="${data.flags.alt}" width="60"></p>`;

            let currencyHTML = "";
            for (const [code, value] of Object.entries(data.currencies)) {
                currencyHTML += `<p>${value.name} (${value.symbol}) [${code}]</p>`;
            }
            document.getElementById("cName").innerHTML = data.name.common;
            document.getElementById("capital").innerHTML = data.capital[0];
            document.getElementById("capital2").innerHTML = data.capital[0];
            document.getElementById("continent").innerHTML = data.continents[0];
            document.getElementById("currency").innerHTML = currencyHTML;
            document.getElementById("language").innerHTML = langHTML;
            document.getElementById("population").innerHTML = data.population.toLocaleString();
            document.getElementById("area").innerHTML = data.area.toLocaleString()+ " km²";
            document.getElementById("gMap").innerHTML = `<a href="${data.maps.googleMaps}" target="_blank">View in Google Maps</a>`;
            document.getElementById("flag").innerHTML = flagHTML;
            document.getElementById("tZone").innerHTML = data.timezones;


            const latlng = data.capitalInfo.latlng;
            capitalMarker = L.marker(latlng).addTo(map).bindPopup(`Capital: <strong>${data.capital[0]}</strong>`).openPopup();
            printweather(latlng[0],latlng[1]);
            printTimeInfo(latlng[0],latlng[1]);
            hideLoader();
        },
        error: function(err) {
            console.error("Details AJAX error", err);
            hideLoader();
        }
    });
}

//function to load country dropdown
function loadCountryDropdown() {
    showLoader();
    $.ajax({
        url: 'load.php',
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            let options = '<option value="">Select a Country</option>';
            let countries = result.data.filter(c => c.cioc).sort((a, b) => a.name.common.localeCompare(b.name.common));

            for (let country of countries) {
                options += `<option value="${country.cioc}">${country.name.common}</option>`;
            }

            $('#country').html(options);
            hideLoader();
        },
        error: function(err) {
            console.error("Dropdown AJAX error", err);
            hideLoader();
        }
    });
}

//initializing map layers on page load
$(document).ready(() => {
    baseLayers = getBaseLayers();

    map = L.map('map', {
        center: [0, 0],
        zoom: 2,
        layers: [baseLayers['Open Street Map']]
    });

    layerControl = L.control.layers(baseLayers).addTo(map);

    loadCountryDropdown();
    hideLoader();
});

//border highlight style
function borderHighlightStyle(){
    return{
        weight: 2,
        opacity: 2,
        color: 'black',
        dashArray: '0',
        fillOpacity: 0
    }
}

//function to create map
function createMap(lat, lng, zoom = 6) {
    showLoader();
    // Remove old country border
    if (countryBorderLayer) {
        map.removeLayer(countryBorderLayer);
    }

    if (capitalMarker) {
        map.removeLayer(capitalMarker);
    }

    // Get and show current country border
    $.ajax({
        url: "countryBorders.php",
        type: "GET",
        dataType: "json",
        success: function(data) {
            const point = [lng, lat];
            let matchedFeature = null;

            for (let feature of data.features) {
                const geometry = feature.geometry;

                if (geometry.type === "Polygon") {
                    if (turf.booleanPointInPolygon(point, turf.polygon(geometry.coordinates))) {
                        matchedFeature = feature;
                        break;
                    }
                } else if (geometry.type === "MultiPolygon") {
                    for (const coords of geometry.coordinates) {
                        if (turf.booleanPointInPolygon(point, turf.polygon(coords))) {
                            matchedFeature = feature;
                            break;
                        }
                    }
                }
            }

            if (matchedFeature) {
                countryBorderLayer = L.geoJson(matchedFeature, { style: borderHighlightStyle() }).addTo(map);
                map.fitBounds(countryBorderLayer.getBounds(), { padding: [0,0] });

                const countryCode = matchedFeature.properties.iso_a3;
                loadCountryDetails(countryCode);
            }
            hideLoader();
        },
        error: function(err) {
            console.error("Borders AJAX error", err);
            hideLoader();
        }
    });
}

//function to load dropdown 
function loadCountryDropdown() {
    showLoader();
    $.ajax({
        url: 'load.php',
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            let options = '<option value="">Select a Country</option>';
            let countries = result.data.filter(c => c.cioc).sort((a, b) => a.name.common.localeCompare(b.name.common));

            for (let country of countries) {
                options += `<option value="${country.cioc}">${country.name.common}</option>`;
            }

            $('#country').html(options);
            hideLoader();
        },
        error: function(err) {
            console.error("Dropdown AJAX error", err);
            hideLoader();
        }
    });
}

//function to get current country map
$('#getLocation').on('click', () => {
    showLoader();
    if (!navigator.geolocation) {
        alert("Geolocation not supported. Please select a country.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            createMap(position.coords.latitude, position.coords.longitude);
            hideLoader();
        },
        (error) => {
            alert("Could not get your location.");
            console.error("Geolocation error:", error);
            hideLoader();
        }
    );
});

// Dropdown change
$('#country').on('change', () => {
    showLoader();
    const code = $('#country').val();
    if (!code) {
        alert("Please select a country.");
        return;
    }

    $.ajax({
        url: "countryCoords.php",
        type: "GET",
        dataType: "json",
        data: { code },
        success: function(result) {
            const [lat, lng] = result.data.capitalInfo.latlng;
            createMap(lat, lng);
            hideLoader();
        },
        error: function(err) {
            console.error("Coords AJAX error", err);
            hideLoader();
        }
    });
});