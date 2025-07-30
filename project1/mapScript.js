
let map = null;
let baseLayers = {};
let layerControl = null;
let countryBorderLayer = null;
let currCurrencyCode= null;
let countryCode2= null;
let countryCode3=null;
let markerCapital = null;
let airportCluster = L.markerClusterGroup();
let railwayCluster = L.markerClusterGroup();

// Loader functions
function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}
showLoader();

//function to remove overlay if existing
function removeOverlayIfExists(layer) {
    if (layer) {
        map.removeLayer(layer);
        layerControl.removeLayer(layer);
        return null;
    }
    return layer;
}

//function to return base Map layers
function getBaseLayers() {
    return {
        'Open Street Map': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
        // 'Airports': L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {
        //     maxZoom: 18,
        //     attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a>, © OpenStreetMap contributors'
        // }),
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
function getWeather(lat, lng){
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
             if (data) {
                document.getElementById("wDateTime").innerHTML = data.datetime || "N/A";
                document.getElementById("station").innerHTML = data.stationName || "N/A";
                document.getElementById("temp").innerHTML = `${data.temperature ?? "N/A"} deg Cel`;
                document.getElementById("clouds").innerHTML = data.clouds || "N/A";
                document.getElementById("humidity").innerHTML = data.humidity || "N/A";
                document.getElementById("dewPoint").innerHTML = data.dewPoint || "N/A";
                document.getElementById("windSpeed").innerHTML = `${data.windSpeed ?? "N/A"} knots`;
            } else {
                console.warn("No weather data available.");
                alert("No weather data available.");
            }
           
            hideLoader();
        },
        error: function(err) {
            console.error("Details AJAX error", err);
            hideLoader();
        }
    });
}

//function to return the airports data
function getAirports(countryCode){

    airportCluster.clearLayers();

    $.ajax({
        url:"getAirports.php",
        type:"get",
        dataType:"json",
        data:{countryCode: countryCode},
        success: function(result){
            
            let airports = result.data.data;
            const airportIcon = L.ExtraMarkers.icon({
                    icon: 'fa-plane',
                    number: '1',
                    markerColor: 'blue',
                    shape: 'circle',
                    prefix: 'fa'
                });
            for (let i = 0; i < airports.length; i++) {
                let airport = airports[i];
                let marker=L.marker([airport.latitude, airport.longitude],{icon: airportIcon}).bindPopup(`Airport Name: <strong>${airport.airport_name}</strong>`);
                airportCluster.addLayer(marker);
            }
            
            
        },error: function(err){
            console.error("Details AJAX error", err);
        }
    });
}

//function to return railway station data
function getRailway(countryCode){

    railwayCluster.clearLayers();

    $.ajax({
        url:"getRailway.php",
        type:"get",
        dataType:"json",
        data:{countryCode: countryCode},
        success: function(result){

            let railways = result.data.geonames;
            const railwayIcon = L.ExtraMarkers.icon({
                    icon: 'fa-train',
                    markerColor: 'blue',
                    shape: 'circle',
                    prefix: 'fa'
                });
            for (let i = 0; i < railways.length; i++) {
                let railway = railways[i];
                let marker = L.marker([railway.lat, railway.lng], {icon: railwayIcon}).bindPopup(`Station Name: <strong>${railway.name}</strong>`);
                railwayCluster.addLayer(marker);
            }
            
           
        },error: function(err){
            console.error("Details AJAX error", err);
        }
    });
}

//function to browsing device
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

//function to return Wikipedia data
function getWikipedia(countryName){
    let name = countryName.toLowerCase();
    $.ajax({
        url:"getWikipedia.php",
        type:"get",
        dataType:"json",
        data:{name: name},
        success: function(result){
            
             document.getElementById("heading").innerHTML = result.data.displaytitle;
             document.getElementById("description").innerHTML = result.data.extract_html;
             
             if(isMobile()){
                document.getElementById("wikiLink").innerHTML = `<a href="${result.data.content_urls.mobile.page}">View in Wikipedia</a>`;
             }else{
                document.getElementById("wikiLink").innerHTML = `<a href="${result.data.content_urls.desktop.page}" >View in Wikipedia</a>`;
             }
             
        },error: function(err){
            console.error("Details AJAX error", err);
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

// function to load currency dropdown
function loadCurrencyDropDown(currencies){
    showLoader();
    $("#amount").val("");
    $("#result").empty();
    let currencyCode = Object.keys(currencies)[0];
    $.ajax({
        url:"currencyDropDown.php",
        type: "GET",
        dataType:"json",
        data:{currencyCode: currencyCode},
        success: function(result){
        
            let cOptions = '<option value="">Select Currency</option>';
            Object.keys(result.data).forEach(key => {
                cOptions += `<option value="${key}">${key}</option>`;
            });

            $('#convertTo').html(cOptions);
            hideLoader();

        },
        error: function(err){
            console.error("Currency Dropdown AJAX error", err);
            alert("Failed to load currency dropdown. Please check the server response.");
            hideLoader();
        }

    });
}

//function to load country details
function loadCountryDetails(countryCode) {
    showLoader();

    markerCapital = removeOverlayIfExists(markerCapital);

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
            currCurrencyCode = Object.keys(data.currencies)[0];

            document.getElementById("cName").innerHTML = data.name.common;
            document.getElementById("capital").innerHTML = data.capital[0];
            document.getElementById("capital2").innerHTML = data.capital[0];
            document.getElementById("continent").innerHTML = data.continents[0];
            document.getElementById("currency").innerHTML = currencyHTML;
            document.getElementById("language").innerHTML = langHTML;
            document.getElementById("population").innerHTML = data.population.toLocaleString();
            document.getElementById("area").innerHTML = data.area.toLocaleString()+ " km²";
            document.getElementById("flag").innerHTML = flagHTML;
            document.getElementById("tZone").innerHTML = data.timezones;


            const latlng = data.capitalInfo.latlng;
            markerCapital = L.marker(latlng).bindPopup(`Capital: <strong>${data.capital[0]}</strong>`).openPopup();
            layerControl.addOverlay(markerCapital,"Capital");
            getWeather(latlng[0],latlng[1]);
            printTimeInfo(latlng[0],latlng[1]);
            loadCurrencyDropDown(data.currencies);
            getAirports(countryCode2);
            getRailway(countryCode2);
            getWikipedia(data.name.common);
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
                countryCode3 = matchedFeature.properties.iso_a3;
                countryCode2 = matchedFeature.properties.iso_a2
                loadCountryDetails(countryCode3);
            }
            hideLoader();
        },
        error: function(err) {
            console.error("Borders AJAX error", err);
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
    layerControl.addOverlay(airportCluster, "Airports");
    layerControl.addOverlay(railwayCluster, "Railway Stations");

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
    loadCountryDropdown();
    hideLoader();
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
           const latlng = result.data.capitalInfo?.latlng;
            if (!latlng || latlng.length < 2) {
                alert("Capital coordinates not available.");
                hideLoader();
                return;
            }
            createMap(latlng[0], latlng[1]);
            hideLoader();
        },
        error: function(err) {
            console.error("Coords AJAX error", err);
            hideLoader();
        }
    });
});

//event handler for currency conversion
$("#convertButtn").on('click', ()=>{
    showLoader();
    let amount = $("#amount").val();
    let currencyTo = $("#convertTo").val();
    if (isNaN(amount) || amount <= 0) {
        alert("Please select amount greater than 0");
        hideLoader();
        return;
    }else{
        $.ajax({
            url: "currencyConvert.php",
            type: "POST",
            dataType: "json",
            data: { amount:amount, currency:currCurrencyCode, convertTo: currencyTo },
            success: function(result) {
        
                document.getElementById("result").innerHTML= `${result.data.result.toFixed(2)} ${currencyTo}`;
                hideLoader();
            },
            error: function(err) {
                console.error("Error", err);
                hideLoader();
            }
        });
    }
})