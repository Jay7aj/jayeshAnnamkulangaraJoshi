
let map = null;
let baseLayers = {};
let layerControl = null;
let countryBorderLayer = null;
let currCurrencyCode= null;
let quoteMap = {};
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

//function to remove overlay if existing
function removeOverlayIfExists(layer) {
    if (layer) {
        map.removeLayer(layer);
        layerControl.removeLayer(layer);
        return null;
    }
    return layer;
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
//function to return news data
function getNews(keyword){

    $.ajax({
        url:"php/getNews.php",
        type:"get",
        dataType:"json",
        data:{keyword: keyword},
        success: function(result){
            
            let data = result.data;
            let newsHtml="";
            for(let i=0; i<4; i++){
                let imgUrl = data[i].image_url ? data[i].image_url : "library/images/no-image.jpg";
                let newsTitle = data[i].title;
                let newsUrl = data[i].link;
                let newsSource = data[i].source_name;

                newsHtml += `<table class="table table-borderless">
                                    <tr>
                                        <td rowspan="2" width="50%">
                                        <img class="img-fluid rounded" src="${imgUrl}" alt="" title="">
                                        </td>
                                        <td>
                                        <a  href="${newsUrl}" class="fw-bold fs-6 text-black" target="_blank">${newsTitle}</a>
                                        </td>
                                    </tr>
                                    <tr>      
                                        <td class="align-bottom pb-0">
                                        <p class="fw-light fs-6 mb-1">${newsSource}</p>
                                        </td>       
                                    </tr>
                                    </table>
                                    <hr>
                                    `;
            }
            
            
            $("#newsModalBody").html(newsHtml);
            
            
        },error: function(err){
            // console.error("Details AJAX error", err);
            alert("Could not fetch news data");
            hideLoader();
        }
    });
}

//function to return weather data
function getWeather(lat, lng){
    
    $.ajax({
        url: "php/getWeather.php",
        type: "GET",
        dataType: "json",
        data: { 
            lat: lat, 
            lng: lng, 
        },
        success: function(result) {
            const data = result.data;
            let date = new Date(data.dt * 1000);
            let dateFormated = date.toString("dddd, d MMMM");
            
            let temperature=`<strong>Temperature:</strong> ${data.main.temp}°C`;
            let feelsLike=`<strong>Feels like:</strong> ${data.main.feels_like}°C`;
            let humidity=`<strong>Humidity:</strong> ${data.main.humidity}%`;
            let imagesrc=`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            let windSpeed=`<strong>Wind speed:</strong> ${data.wind.speed}m/s`;
            let description=data.weather[0].description

            document.getElementById("weatherModalTitle").innerHTML= `Weather info at ${data.name}`;
            document.getElementById("weatherDate").innerHTML=dateFormated;
            document.getElementById("weatherImage").src=imagesrc;
            document.getElementById("clouds").innerHTML=description;
            document.getElementById("temperature").innerHTML=temperature;
            document.getElementById("feelsLike").innerHTML=feelsLike;
            document.getElementById("windSpeed").innerHTML=windSpeed;
            document.getElementById("humidity").innerHTML=humidity;       
        },
        error: function(err) {
            // console.error("Details AJAX error", err);
            alert("Could not fetch weather data");
            hideLoader();            
        }
    });
}

//function to return the airports data
function getAirports(countryCode){

    airportCluster.clearLayers();

    $.ajax({
        url:"php/getAirports.php",
        type:"get",
        dataType:"json",
        data:{countryCode: countryCode},
        success: function(result){
            
            let airports = result.data;
            const airportIcon = L.ExtraMarkers.icon({
                    icon: 'fa-plane',
                    number: '1',
                    markerColor: 'white',
                    iconColor: "black",
                    shape: 'square',
                    prefix: 'fa'
                });
            for (let i = 0; i < airports.length; i++) {
                let airport = airports[i];
                let marker=L.marker([airport.latitude, airport.longitude],{icon: airportIcon}).bindPopup(`${airport.airport_name}`);
                airportCluster.addLayer(marker);
            }
            
            
        },error: function(err){
            // console.error("Details AJAX error", err);
            alert("Could not fetch airports data");
            hideLoader();
        }
    });
}

//function to return railway station data
function getRailway(countryCode){

    railwayCluster.clearLayers();

    $.ajax({
        url:"php/getRailway.php",
        type:"get",
        dataType:"json",
        data:{countryCode: countryCode},
        success: function(result){

            let railways = result.data.geonames;
            const railwayIcon = L.ExtraMarkers.icon({
                    icon: 'fa-train',
                    markerColor: 'green',
                    iconColor: "white",
                    shape: 'square',
                    prefix: 'fa'
                });
            for (let i = 0; i < railways.length; i++) {
                let railway = railways[i];
                let marker = L.marker([railway.lat, railway.lng], {icon: railwayIcon}).bindPopup(`${railway.name}`);
                railwayCluster.addLayer(marker);
            }
            
           
        },error: function(err){
            // console.error("Details AJAX error", err);
            alert("Could not fech railway data");
            hideLoader();
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
        url:"php/getWikipedia.php",
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
            // console.error("Details AJAX error", err);
            alert("Could not fetch wikipedia data");
            hideLoader();
        }
    });
}

//functon to calculate currency exchange rates
function calcConvertion(){
    let amount = parseFloat($("#fromAmount").val());
    let currTo = $("#exchangeRate").val();
    let rate;
    if (isNaN(amount) || amount <= 0) {
        alert("Please select amount greater than 0");
        hideLoader();
        return;
    }else{
        if(currTo in quoteMap){
            rate = quoteMap[currTo];
            $("#toAmount").val((rate * amount).toFixed(2));
        }else{
            alert("Currency exchange rates not available");
            hideLoader();            
        }
    }
    
} 

//function to get exchange rates
function getConvertionQuotes() {
    
    $.ajax({
        url: "php/getCurrencyConvert.php",
        type: "POST",
        dataType: "json",
        success: function(result) {
                
            quoteMap = {"USD": 1};

            Object.entries(result.data).forEach(([key, value]) => {
                quoteMap[key.slice(3)] = value;
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // console.log("AJAX Error:", textStatus);
            // console.log("HTTP Status:", jqXHR.status);
            // console.log("Response:", jqXHR.responseText);
            alert("currency convertion data could not be fetched");
            hideLoader();
        }
    });
}

// function to load currency dropdown
function getCurrencyDropDown(){

    $.ajax({
        url:"php/getCurrencyDropDown.php",
        type: "GET",
        dataType:"json",
        success: function(result){
        
            let cOptions = '<option value="">Select Currency</option>';
            Object.entries(result.data).forEach(([key, values]) => {
                cOptions += `<option value="${key}">${values} (${key})</option>`;
            });
    
            $('#exchangeRate').html(cOptions);
            $("#exchangeRate").val("USD");
            setTimeout(() => {
                getConvertionQuotes();
            }, 1000);
            

        },
        error: function(err){
            // console.error("Currency Dropdown AJAX error", err);
            alert("Failed to load currency dropdown. Please check the server response.");
            hideLoader();
            
        }

    });
}

//function to return time data
function getTimeInfo(lat, lng){
    
    $.ajax({
        url: "php/getTimezone.php",
        type: "GET",
        dataType: "json",
        data: { 
            lat: lat, 
            lng: lng, 
        },
        success: function(result) {
            const data = result.data;

            sunrise = new Date(data.sunrise);
            sunriseF = sunrise.toString("hh:mm tt")
            sunset = new Date(data.sunset);
            sunsetF = sunset.toString("hh:mm tt");
            cTime = new Date(data.time);
            cTimeF = cTime.toString("hh:mm tt");
            cDateF = cTime.toString("dddd, dd MMMM yyyy")

            document.getElementById("timezoneId").innerHTML = data.timezoneId;
            document.getElementById("sunrise").innerHTML = sunriseF;
            document.getElementById("sunset").innerHTML = sunsetF;
            document.getElementById("cTime").innerHTML = cTimeF;
            document.getElementById("cDate").innerHTML = cDateF;
        },
        error: function(err) {
            // console.error("Details AJAX error", err);
            alert("Could not fetch timeZone data");
            hideLoader();            
        }
    });
}

//function to load country dropdown
function getCountryDropdown() {
    return new Promise((resolve, reject) => {
        
        $.ajax({
            url: "php/getCountryDropdown.php",
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                let options = '<option value="">Select a Country</option>';
                let countries = result.data.filter(c => c.iso_a2).sort((a, b) => a.name.localeCompare(b.name));

                for (let country of countries) {
                    options += `<option value="${country.iso_a2}">${country.name}</option>`;
                }
                $('#countrySelect').html(options);
                resolve();
            },
            error: function(err) {
                console.error("Dropdown AJAX error", err);
                alert("Error in Dropdown: ",err.statusText);
                reject(err);
                hideLoader();
            }
        });
    });
}

//function to load country details
function getCountryDetails(countryCode) {

    markerCapital = removeOverlayIfExists(markerCapital);

    $.ajax({
        url: "php/getCountryDetails.php",
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
            document.getElementById("continent").innerHTML = data.continents[0];
            document.getElementById("currency").innerHTML = currencyHTML;
            document.getElementById("language").innerHTML = langHTML;
            document.getElementById("population").innerHTML = data.population.toLocaleString();
            document.getElementById("area").innerHTML = data.area.toLocaleString()+ " km²";
            document.getElementById("flag").innerHTML = flagHTML;
            document.getElementById("tZone").innerHTML = data.timezones;
            document.getElementById("tZoneNum").innerHTML = data.timezones.length;

            const latlng = data.capitalInfo.latlng;
            markerCapital = L.marker(latlng).bindPopup(`Capital: <strong>${data.capital[0]}</strong>`).openPopup();
            layerControl.addOverlay(markerCapital,"Capital");
            map.addLayer(markerCapital);
            getWeather(latlng[0],latlng[1]);
            getTimeInfo(latlng[0],latlng[1]);
            getCurrencyDropDown();
            getAirports(countryCode);
            getRailway(countryCode);
            getNews(data.name.common);
            getWikipedia(data.name.common);
            
        },
        error: function(err) {
            // console.error("Details AJAX error", err);
            alert("Could not fetch country details data")
            hideLoader();
            
        }
    });
}

//function to create map
function createMap(code) {

    // Remove old country border
    if (countryBorderLayer) {
        map.removeLayer(countryBorderLayer);
    }

    // Get and show current country border
    $.ajax({
        url: "php/getCountryBorders.php",
        type: "GET",
        dataType: "json",
        data:{code},
        success: function(result) {
            
            let feature = result.data;

            if (feature) {
                countryBorderLayer = L.geoJson(feature, { style: borderHighlightStyle() }).addTo(map);
                map.fitBounds(countryBorderLayer.getBounds(), { padding: [10,10] });
                getCountryDetails(code);
            }else{
                alert("Map border feature not found!");
                hideLoader();
            }
            
            
        },
        error: function(err) {
            // console.error("Borders AJAX error", err);
            alert("Could not fetch country borders data");
            hideLoader();
            
        }
    });
}

//function to get country code from coordinates
async function getCountryIso(lat, lng){
    return new Promise((resolve, reject)=>{

            $.ajax({
            url: "php/getCountryIso.php",
            type: "GET",
            dataType: "json",
            data: { lat: lat ,lng: lng },
            success: function(result) {

                resolve(result.data); 
            },
            error: function(err) {
                reject(err);
                hideLoader();
                alert("Could not fetch country Iso code");
            }
        });
    });
}

//initializing map layers on page load
$(document).ready(async () => {
    
    showLoader();

    await getCountryDropdown();

    baseLayers = getBaseLayers();

    map = L.map('map', {
        center: [0, 0],
        zoom: 2,
        layers: [baseLayers['Open Street Map']]
    });
  
    
    layerControl = L.control.layers(baseLayers).addTo(map);
    layerControl.addOverlay(airportCluster, "Airports");
    layerControl.addOverlay(railwayCluster, "Railway Stations");
    map.addLayer(airportCluster);
    map.addLayer(railwayCluster);

    //button to catch the focus
    const focusCatcher = document.getElementById("focusCatcher");

    // Button to view Info Modal
    L.easyButton('fa-solid fa-circle-info fa-lg fa-fw', function(btn, map) {
        $("#infoModal").modal("show");
    }).addTo(map);
    //move focus out of the modal before closing 
    document.getElementById("infoModal").addEventListener("hide.bs.modal", () => {
        // Force focus shift using requestAnimationFrame to avoid async delay
        requestAnimationFrame(() => {
            focusCatcher.focus();
        });
    });

    //Button to view Weather Modal
    L.easyButton('fa-solid fa-cloud-showers-water fa-lg fa-fw', function(btn, map) {
        $("#weatherModal").modal("show");
    }).addTo(map);
    //move focus out of the modal before closing 
    document.getElementById("weatherModal").addEventListener("hide.bs.modal", () => {
        // Force focus shift using requestAnimationFrame to avoid async delay
        requestAnimationFrame(() => {
            focusCatcher.focus();
        });
    });

    //Button to view Currency Modal
    L.easyButton('fa-solid fa-money-bills fa-lg fa-fw', function(btn, map) {
        $("#currencyModal").modal("show");
    }).addTo(map);
    //move focus out of the modal before closing 
    document.getElementById("currencyModal").addEventListener("hide.bs.modal", () => {
        // Force focus shift using requestAnimationFrame to avoid async delay
        requestAnimationFrame(() => {
            focusCatcher.focus();
        });
    });

    //Button to view Timezone Modal
    L.easyButton('fa-solid fa-clock fa-lg fa-fw', function(btn, map) {
        $("#timeModal").modal("show");
    }).addTo(map);
    //move focus out of the modal before closing 
    document.getElementById("timeModal").addEventListener("hide.bs.modal", () => {
        // Force focus shift using requestAnimationFrame to avoid async delay
        requestAnimationFrame(() => {
            focusCatcher.focus();
        });
    });

    //Button to view Wikipedia Modal
    L.easyButton('fa-solid fa-w fa-lg fa-fw', function(btn, map) {
        $("#wikiModal").modal("show");
    }).addTo(map);
    //move focus out of the modal before closing 
    document.getElementById("wikiModal").addEventListener("hide.bs.modal", () => {
        // Force focus shift using requestAnimationFrame to avoid async delay
        requestAnimationFrame(() => {
            focusCatcher.focus();
        });
    });

    //Button to view News Modal
    L.easyButton('fa-solid fa-newspaper fa-lg fa-fw', function(btn, map) {
        $("#newsModal").modal("show");
    }).addTo(map);
    //move focus out of the modal before closing 
    document.getElementById("newsModal").addEventListener("hide.bs.modal", () => {
        // Force focus shift using requestAnimationFrame to avoid async delay
        requestAnimationFrame(() => {
            focusCatcher.focus();
        });
    });

    //Button to view Settings Modal
    L.easyButton('fa-solid fa-gear fa-lg fa-fw', function(btn, map) {
        $("#settingsModal").modal("show");
    }).addTo(map);
    //move focus out of the modal before closing 
    document.getElementById("settingsModal").addEventListener("hide.bs.modal", () => {
        // Force focus shift using requestAnimationFrame to avoid async delay
        requestAnimationFrame(() => {
            focusCatcher.focus();
        });
    });

    if (!navigator.geolocation) {
        alert("Geolocation not supported. Please select a country.");
        hideLoader();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                //function call to set country code
                countryCode2 = await getCountryIso(position.coords.latitude, position.coords.longitude);

                if (countryCode2) {
                    $('#countrySelect').val(countryCode2).trigger('change');
                } else {
                    alert("Could not determine your country.");
                }
            } catch (e) {
                // console.error("Geolocation country lookup failed", e);
                alert("Could not fetch your country from coordinates.");
                hideLoader();
            }
            
        },
        (error) => {
            alert("Could not get your location.");
            hideLoader();
            // console.error("Geolocation error:", error);
            
        }
    );
});

// event handler for Dropdown change
$('#countrySelect').on('change', () => {
    
    const code = $('#countrySelect').val();
    if (!code) {
        alert("Please select a country.");
        hideLoader();
        return;
    }
    
    createMap(code);
    hideLoader();
    if ($('#showPrimInfo').prop('checked')) {
        $("#infoModal").modal("show");
    }
    
       
});

//event handler for currency conversion
$("#exchangeRate").on("change",()=>{
    calcConvertion();
})
$("#fromAmount").on("change",()=>{
    calcConvertion();
})
$('#currencyModal').on('show.bs.modal', function () {
    calcConvertion();
})
$('#currencyModal').on('hidden.bs.modal', function () {
    $('#fromAmount').val(1);
    $("#exchangeRate").val('USD');
})

