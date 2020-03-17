# weather-dashboard
Simple weather dashboard 
## Purpose of the project
This is a handy website that will show weather data for locations
## how to use the project
There are two ways to use the website. Either enter in a location or use the 'use current location' button.
## code highlights
```
  $("#search-location-button").on("click", function() {
    // detects if the browser has geolocation support
    if (navigator.geolocation) {
      // gets the current position
      navigator.geolocation.getCurrentPosition(function(position){
        // sends data to the google geo location api to return the city, state, country
        $.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude + "," + position.coords.longitude +"&result_type=locality&key=AIzaSyD3nLZRaOSf5fZsrmjits2u0QrLsH1L9hw", function(data) {
          // assign the value of the returned data to the searchValue variable
          searchValue = data.results[0].formatted_address;
          // calls the searchWeather function and passes the searchValue parameter
          searchWeather(searchValue);
        })

      });
 ```
