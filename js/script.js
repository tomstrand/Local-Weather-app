$(document).ready(function() {
    var myKey = 'AIzaSyDH2RelUndp0Km1mdWff5PdvPIo-j9B9gg';
    var lat;
    var lon;
    //Get the current position
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success);
    }
    // if location found, set cordinates 
    function success(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        getAddress(lon, lat);
        getWeather(lon, lat);
    }
    //Get the current address
    function getAddress(longitude, latitude) {
        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + '%2C' + longitude + '&key=AIzaSyDH2RelUndp0Km1mdWff5PdvPIo-j9B9gg&language=en', function(json) {
            console.log(json);
            $("#location_short").html(json.results[1].address_components[0].long_name);
            $("#location_long").html(json.results[1].formatted_address);
        });
    }

    function getLocation() {
        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',+norway&key=AIzaSyDH2RelUndp0Km1mdWff5PdvPIo-j9B9gg', function(json) {
            console.log(json);
        });
    }
});



//Get weather data
function getWeather(longitude, latitude) {

    var units = 'si';
    var temp;
    var dailyTemp;
    var icon;
    var image;
    var j;
    var currentIcon;
    var $currentIconElement;
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; //to find day of the week
    var dayArray = []; //to store days of the week
    var iconArray = []; //to store icon values
    var tempArray = []; //to store temps

    //Get data from Darksky api
    $.getJSON('https://api.darksky.net/forecast/79249491b88d783afcaaceeab1cfe6c8/' + latitude + ',' + longitude + '?callback=?&units=' + units + '', function(json) {
        console.log(json);
        icon = json.currently.icon;
        $("#temp").html(Math.round(json.currently.temperature) + ('&deg;C'));
        $("#desc").html(json.currently.summary);

        //Get forecast weather conditions and date
        function weatherInfo() {
            var time = json.daily.data[i].time;
            var date = new Date(time * 1000);
            dayArray.push(weekday[date.getDay()]);
            var weatherIcon = json.daily.data[i].icon;
            iconArray.push(weatherIcon);
            tempArray.push(json.daily.data[i].apparentTemperatureMax);
            $("#forecast").html(json.hourly.summary);

        }
        //if it's before 6am (but after midnight), run the function as if later that day = "tomorrow" (so if it's 4am on a Sunday, Sunday will still show up as the first day in the forecast)
        var now = new Date();
        var hour = now.getHours();
        if (hour < 6) {
            for (i = 0; i < 6; i += 1) {
                weatherInfo();
            }
        } else {
            for (i = 1; i < 7; i += 1) {
                weatherInfo();
            }
        }
        //put weekdays into html
        $("#time2").html(dayArray[0]);
        $("#time3").html(dayArray[1]);
        $("#time4").html(dayArray[2]);
        $("#time5").html(dayArray[3]);
        $("#time6").html(dayArray[4]);
        $("#time7").html(dayArray[5]);

        //put temp into html
        $("#day2").html(Math.round(tempArray[0]) + ('&deg;C'));
        $("#day3").html(Math.round(tempArray[1]) + ('&deg;C'));
        $("#day4").html(Math.round(tempArray[2]) + ('&deg;C'));
        $("#day5").html(Math.round(tempArray[3]) + ('&deg;C'));
        $("#day6").html(Math.round(tempArray[4]) + ('&deg;C'));
        $("#day7").html(Math.round(tempArray[5]) + ('&deg;C'));

        //Array of weather condition images
        var imageArray = [{
            "src": "icons/09.png",
            "title": "rain",
            "imageCaption": "Image caption for rain"
        }, {
            "src": "icons/01n.50.png",
            "title": "clear-night",
            "imageCaption": "Image caption for clear night"
        }, {
            "src": "icons/01d.png",
            "title": "clear-day",
            "imageCaption": "Image caption for clear day"
        }, {
            "src": "icons/04.png",
            "title": "cloudy",
            "imageCaption": "Image caption for cloudy"
        }, {
            "src": "icons/13.png",
            "title": "snow",
            "imageCaption": "Image caption for snow"
        }, {
            "src": "icons/12.png",
            "title": "sleet",
            "imageCaption": "Image caption for sleet"
        }, {
            "src": "icons/15.png",
            "title": "fog",
            "imageCaption": "Image caption for fog"
        }, {
            "src": "icons/03d.png",
            "title": "partly-cloudy-day",
            "imageCaption": "Image caption for partly cloudy day"
        }, {
            "src": "icons/16.png",
            "title": "wind",
            "imageCaption": "Image caption for wind"
        }, {
            "src": "icons/03n.50.png",
            "title": "partly-cloudy-night",
            "imageCaption": "Image caption for partly partly cloudy night"
        }];

        //Set icon of today`s weather
        (function setCurrentIcon(title) {
            for (i = 0; i < imageArray.length; i++) {
                if (imageArray[i].title == title) {
                    $('#icon').attr('src', imageArray[i].src);
                }
                $('#icon').attr('alt', "No icon available");
            }

        })(icon);

        // find weather tile
        function iconTitle(imageCandidate) {
            return imageCandidate.title === currentIcon;
        }

        // loop over iconArray
        for (i = 0; i < iconArray.length; i++) {
            // retrieve the current Icon
            currentIcon = iconArray[i];
            // retrieve the icon element
            $currentIconElement = $('#icon' + i);
            // retrieve the corresponding image from the imageArray
            image = imageArray.find(iconTitle);
            $currentIconElement.attr('src', image.src);
        }


        //Convert C to F
        function convertToF() {
            return Math.round((temp * 1.8) + 32);
        }
        //Return temperature in C
        function convertToC() {
            return Math.round(temp);
        }
        //Toggle between C and F when icon is clicked
        $('#temp').on('click', function() {
            $('#temp').toggleClass('celsius');
            $('#temp').toggleClass('fahrenheit');
            if ($(this).hasClass('celsius')) {
                $('#temp').html(convertToF() + ('&deg;F'));
                return;
            }
            $('#temp').html(convertToC() + ('&deg;C'));
        });
    });
}