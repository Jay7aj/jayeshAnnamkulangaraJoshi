
var map =null;

//initializing map
map = L.map('map').setView([0, 0], 1.5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

function borderHighlightStyle(){
    return{
        weight: 2,
        opacity: 2,
        color: 'black',
        dashArray: '0',
        fillOpacity: 0
    }
}

function createMap(lat, lng, zoom=6){

    if (map !== null) {
        map.remove();
        map = null;
    }

    map = L.map('map').setView([lat, lng], zoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

    //adding current country border with ajax and php
    $.ajax({
        url:"countryBorders.php",
        type: "GET",
        dataType: "json",
        success: async function(data){
            let matched = false;
            const point = [lng, lat];

            for (let feature of data.features){
                let geometry = feature.geometry;

                if(geometry.type == "Polygon"){
                    matched = turf.booleanPointInPolygon(point, turf.polygon(geometry.coordinates));
                } else if(geometry.type == "MultiPolygon"){
                    for(coords of geometry.coordinates){
                        if(turf.booleanPointInPolygon(point, turf.polygon(coords))){
                            matched = true;
                            break;
                        }
                    }
                }
                if(matched){
                    
                    //adding and higlighting the current country border
                    let layer = L.geoJson(feature, {style: borderHighlightStyle}).addTo(map);
                    map.fitBounds(layer.getBounds(), {padding: [5,5]});                      
                    let countryCode= feature.properties.iso_a2;
                    
                    //request to get country details
                    $.ajax({
                        url: "countryDetails.php",
                        type:'GET',
                        dataType:'json',
                        data:{
                            code: countryCode
                        },
                        success: function(result){
                            document.getElementById("overlay").style.visibility = "visible"; 
                            let countryName= result.data.name.common;
                            let capital= result.data.capital[0];
                            let continent= result.data.continents[0];
                            let population= result.data.population;
                            let area= result.data.area;
                            let currencies= result.data.currencies;

                            let languages = result.data.languages;
                            let langHTML = `<p>${Object.values(languages).join(", ")}</p>`;

                            let flag = result.data.flags;
                            let flagHTML = `<p><strong>Flag:</strong> <img src="${flag.svg}" alt="${flag.alt}" width="60"></p>`;

                            let currencyHTML = "";
                            for (const [key, value] of Object.entries(currencies)) {
                                let currencyCode = key;
                                let currencyName = value.name;
                                let currencySymbol = value.symbol;
                                currencyHTML += `<p> ${currencyName} (${currencySymbol}) [${currencyCode}]</p>`;
                            }
                            
                            let gMapLink= result.data.maps.googleMaps;


                            document.getElementById('overlay').innerHTML = `
                                <h3>Country Info</h3>
                                <p><strong>Name:</strong> ${countryName}</p>
                                <p><strong>Capital:</strong> ${capital}</p>
                                <p><strong>Continent:</strong> ${continent}</p>
                                <p><strong>Population:</strong> ${population.toLocaleString()}</p>
                                <p><strong>Area:</strong> ${area.toLocaleString()} km²</p>
                                <p><strong>Currencies:</strong>${currencyHTML}</p>                                   
                                <p><strong>Languages:</strong>${langHTML}</p>
                                ${flagHTML}
                                <a href= "${gMapLink}" target="_blank">View in Google Map.</a>
                            `;

                            let latlng = result.data.capitalInfo.latlng;
                            var capitalMarker = L.marker(latlng).addTo(map);
                            capitalMarker.bindPopup(`<p>Capital:<strong> ${capital}</strong></p>`).openPopup();
                            

                        },
                        error: function(xyz, textStatus, error){
                            console.log("AJAX error:", textStatus, error);
                            console.log("Response:", xyz.responseText);
                        }
                    });

                    }
                }                                            
            },
            error: function(xhr, status, error){
                console.error('AJAX Error:', status, error);
            }
    });    

    return map;
}

//function to load current country map. 
$("#getLocation").on("click",()=>{
    if(!navigator.geolocation){
    alert("Geolocation is not supported by your browser!");
    alert("Please select a country from the dropdown");
}else{
    navigator.geolocation.getCurrentPosition((position)=>{
        let currLat= position.coords.latitude;
        let currLng= position.coords.longitude;
        createMap(currLat, currLng);
    },
    (error) => {
        alert("Unable to retrieve your location. Please select a country.");
        console.error("Geolocation error:", error);
    });
}
});

//function to load countries in dropdown.
$(document).ready(()=>{
    $.ajax({
        url: 'load.php',
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            
            let options = '<option value="">Select a Country</option>';
            let countryArray = [];

            for (let i in result.data) {
                let cName = result.data[i];
                countryArray.push(cName);
            }
            countryArray.sort((a, b) => a.countryName.localeCompare(b.countryName));

            for (let j = 0; j < countryArray.length; j++) {
                options += `<option value="${countryArray[j].fipsCode}">${countryArray[j].countryName}</option>`;
            }
            $('#country').html(options);
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', status, error);
        }
    });
})

//Event handler to update country.
$('#countrySubmit').on('click',() => {
    let countryCode = $("#country").val();

    if(countryCode ==""){
        alert("Please select a country");
    }else{
        //call navigator.geolocation with selected countryCode
        $.ajax({
            url: "countryDetails.php",
            type:'GET',
            dataType:'json',
            data:{
                code: countryCode
            },
            success: function(result){
                let lat = result.data.latlng[0];
                let lng = result.data.latlng[1];
                //calling create map with selected country coordinates
                createMap(lat, lng);
            },
            error: function(xyz, textStatus, error){
                console.log("AJAX error:", textStatus, error);
            }                   
        })
    }
    
});
