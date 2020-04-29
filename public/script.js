// jquery method to have the HTML load before performing the JavaScript/jQuery
$(document).ready(function() {
  // use jquery to assign a on click event to the button with an id of search button and then perform the function
  $("#search-button").on("click", function() {
    // create a varible, searchValue, that uses jquery to assign a value to the element with the id of search-value
    var searchValue = $("#search-value").val();

    // clears the input box after use
    $("#search-value").val("");

    // call the function searchWeather and pass the searchValue parameter
    searchWeather(searchValue);
  });

  // use jquery to bind the click function to the element with the class of history and create a new list element
  $(".history").on("click", "li", function() {
    // call the searchWeather function and pass the text of the newly created li
    searchWeather($(this).text());
  });

  // create a function called makeRow and pass the value of text
  function makeRow(text) {
    // create a varible called li that adds the classes of list-group-item list-group-item-action and adds the value of text
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    // uses jquery to append the list to the element with the class of history
    $(".history").append(li);
  }

  
  // start of geo location feature
  // have jquery listen for a click event to get geo location
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
      
  }
});

  // creates a function named searchWeather and passes the value of searchValue
  function searchWeather(searchValue) {
    // performs a async AJAX request
    $.ajax({
      // ajax GET requests data from the server
      type: "GET",
      // sends the ajax request to the url below
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=600327cb1a9160fea2ab005509d1dc6d&units=imperial",
      // the data will be returned in the json format
      dataType: "json",
      // on success, use this function and pass the data parameter to the function
      success: function(data) {
        // create history link for this search
        if (history.indexOf(searchValue) === -1) {
          // pushes the value for searchValue to history array
          history.push(searchValue);
          // creates a history key in localStorage
          window.localStorage.setItem("history", JSON.stringify(history));
    
          // call the makeRow function and pass the value of searchValue
          makeRow(searchValue);
        }
        
        // clear any old content
        $("#today").empty();

        // create html content for current weather
        // creating a title varible that creates a new h3 element, adds the card-title class. Then adds the date to the newly created element.
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        // creating a card varible that creates a new div element and adds the card class
        var card = $("<div>").addClass("card");
        // creates a wind varible that creates a new p element then adds the class of card-text. It then modifies the text by adding the wind speed
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        // creates a humid variable that creates a new p element then adds the class of card-text. It further modies the text by adding the humidity
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        // creates a temp varible that creates a new p element and adds the card-text class to it. Then modifies the text by adding the tempature data
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
        // creates a cardBody varible that creates a new div and adds the class of card-body
        var cardBody = $("<div>").addClass("card-body");
        // creates a img varible that creates a new img element and then sets the attribute and adds the source image
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        // merge and add to page
        // appends the image to the h3 heading
        title.append(img);
        // appends the title, tempature, humidity, and wind data to the cardBody div
        cardBody.append(title, temp, humid, wind);
        // appends the cardBody to the card div
        card.append(cardBody);
        // appends all of the above to the element with the id of today
        $("#today").append(card);

        // call follow-up api endpoints
        // calls the getForecast function
        getForecast(searchValue);
        // calls the getUVIndex function
        getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  
  // creates a new function named getForecast and passes the searchValue parameter
  function getForecast(searchValue) {
    // starts a AJAX async request
    $.ajax({
      // ajax GET requests data from the server
      type: "GET",
      // sends the ajax request to the url below
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=600327cb1a9160fea2ab005509d1dc6d&units=imperial",
      // the data will be returned in the json format
      dataType: "json",
      // on success...
      success: function(data) {
        // overwrite any existing content with title and empty row
        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-white");
            var body = $("<div>").addClass("card-body p-2");

            var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

            var p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " °F");
            var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

            // merge together and put on page
            col.append(card.append(body.append(title, img, p1, p2)));
            // append the elements created above to the element with the id of forecast and class of row
            $("#forecast .row").append(col);
          }
        }
      }
    });
  }

  // creates new function named getUVIndex and pass the paraments of lat and lon
  function getUVIndex(lat, lon) {
    // starts a AJAX async request
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/uvi?appid=600327cb1a9160fea2ab005509d1dc6d&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      // on success...
      success: function(data) {
        // create a varible named uv that creates a new <p> elevent and adds text
        var uv = $("<p>").text("UV Index: ");
        // create a varible named btn that creates a new <span> element and adds the classes of btn and btn-sm. Then adds the text
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);
        
        // change color depending on uv value
        if (data.value < 3) {
          btn.addClass("btn-success");
        }
        else if (data.value < 7) {
          btn.addClass("btn-warning");
        }
        else {
          btn.addClass("btn-danger");
        }
        // appends the the data to the element with the id of today and the class of card-body
        $("#today .card-body").append(uv.append(btn));
      }
    });
  }

  // get current history, if any
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    searchWeather(history[history.length-1]);
  }

  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }
});
