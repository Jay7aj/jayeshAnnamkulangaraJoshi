

// async function load(){
//     try{
//         await fetch("http://api.geonames.org/countryInfoJSON?lang=english&username=jayeshannam")
//         .then(res=> res.json())
//         .then(function(data){
//             let jsonData = data;
//             // console.log(jsonData);
//             let options = `<option value="">Select a Country</option>`;
//             let countryArray = [];
//             for(let i in jsonData.geonames){
//                 cName = jsonData.geonames[i];
//                 countryArray.push(cName);
//             }
//             countryArray.sort((a, b) => a.countryName.localeCompare(b.countryName));
        
//             for(let j=0; j<countryArray.length; j++){
//                 options += `<option value="${countryArray[j].fipsCode}">${countryArray[j].countryName}</option>`;
//             }
//             document.getElementById("country").innerHTML= options;
//         })
        

//     }catch(err){
//         console.error(err);
//     }
// }
// load();

// let resultCol = document.getElementById("result");



$(document).ready(()=>{
    
    $.ajax({
        url: 'load.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {

            let options = '<option value="">Select a Country</option>';
            let countryArray = [];

            for (let i in data.geonames) {
                let cName = data.geonames[i];
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

    //event handler function to call countryInfo.php
    $('#countryInfoSubmit').on('click',() => {
        $.ajax({
            url: "countryInfo.php",
            type:'POST',
            dataType:'json',
            data:{
                country: $('#country').val() 
            },
            success: function(result){
                console.log(result);
                $('#result').html("<h3>Results:</h3>");
                if(result.status.code != 200){
                    $('#result').append(`<p>Status Code: ${result.status.code}</p>`);
                    $('#result').append(`<p>Status Description: ${result.status.description}</p>`);
                }else{
                    $('#result').append(`<p>Country Name: ${result.data.countryName}</p>`);
                    $('#result').append(`<p>Continent Name: ${result.data.continentName}</p>`);
                    $('#result').append(`<p>Capital Name: ${result.data.capital}</p>`);
                    $('#result').append(`<p>Currency Code: ${result.data.currencyCode}</p>`);
                    $('#result').append(`<p>Population: ${result.data.population}</p>`);
                }
            },
            error: function(xyz, textStatus, error){
                console.log("AJAX error:", textStatus, error);
                console.log("Response:", xyz.responseText);
            }
        });
    });

    //event handler function to call timezone.php
    $('#timezoneSubmit').on('click',() => {
        $.ajax({
            url: "timezone.php",
            type:'POST',
            dataType:'json',
            data:{
                lat: $('#lat').val(),
                long: $('#long').val()
            },
            success: function(result){
                // console.log(result);
                $('#result').html("<h3>Results:</h3>");
                if(result.status.code != 200){
                    $('#result').append(`<p>Status Code: ${result.status.code}</p>`);
                    $('#result').append(`<p>Status Description: ${result.status.description}</p>`);
                }else{
                    $('#result').append(`<p>Country Name: ${result.data.countryName}</p>`);
                    $('#result').append(`<p>Country Code: ${result.data.countryCode}</p>`);
                    $('#result').append(`<p>Time Zone ID: ${result.data.timezoneId}</p>`);
                    $('#result').append(`<p>Current Time: ${result.data.time.split(" ")[1]} hrs</p>`);
                    $('#result').append(`<p>Current Date: ${result.data.time.split(" ")[0]}</p>`);
                }

            },
            error: function(xyz, textStatus, error){
                console.log("AJAX error:", textStatus, error);
                console.log("Response:", xyz.responseText);
            }
        });
    });

    //event handler function to call wikipediaSearch.php
    $('#wikiSearchSubmit').on('click',() => {
        $.ajax({
            url: "wikipediaSearch.php",
            type:'POST',
            dataType:'json',
            data:{
                search: $('#search').val(),
                resrow: $('#resrow').val()
            },
            success: function(result){
                console.log(result);
                $('#result').html("<h3>Results:</h3>");
                if(result.status.code != 200){
                    $('#result').append(`<p>Status Code: ${result.status.code}</p>`);
                    $('#result').append(`<p>Status Description: ${result.status.description}</p>`);
                }else{
                    for(i=0;i<result.data.length; i++){
                        $('#result').append(`<h3>Result: ${i + 1}</h3>`);
                        $('#result').append(`<p>Title: ${result.data[i].title}</p>`);
                        $('#result').append(`<p>Search Summary: ${result.data[i].summary}</p>`);
                        $('#result').append(`<a href=\"${result.data[i].wikipediaUrl}\">see more</a>`);
                        $('#result').append(`<br><br><img src = \"${result.data[i].thumbnailImg}\" >`);
                    }
                }

            },
            error: function(xyz, textStatus, error){
                console.log("AJAX error:", textStatus, error);
                console.log("Response:", xyz.responseText);
            }
        });
    });
});
