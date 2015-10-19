/* Kaitlin Lockhart
   JS creating the map, getting the shooting data, creating the layers/points, calculating table data */

var map;
var drawMap = function() {
    map = L.map('container').setView([38.8833, -97.0167], 4);
    var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
    layer.addTo(map);
    getData();
}

var getData = function() {
    $.get ( "data/response.json" , function(data) {
        customBuild(data);
    }, "json");
}

var customBuild = function(data) {
    var White = new L.LayerGroup([]);
    var Black = new L.LayerGroup([]);
    var Asian = new L.LayerGroup([]);
    var AmericanIndian = new L.LayerGroup([]);
    var NativeHawaiian = new L.LayerGroup([]);
    var Unknown = new L.LayerGroup([]);

    var armed;
    var killed;

    var armAndHitCount = 0;
    var armAndKillCount = 0;
    var notAndHitCount = 0;
    var notAndKillCount = 0;

   for (var i = 0; i < data.length; i++) {
       var lat = data[i]["lat"];
       var lng = data[i]["lng"];

       var circle = new L.circleMarker([lat, lng]);
       circle.setStyle({stroke: false});

       var hit = data[i]["Hit or Killed?"];
       if (hit === "Killed") {
           circle.setStyle({fillColor: 'red'});
           killed = true;
       } else {
           circle.setStyle({fillColor: 'black'});
           killed = false;
       }

       var armedCheck = data[i]["Armed or Unarmed?"];
       if (armedCheck === "Armed") {
           armed = true;
       } else {
           armed = false;
       }

       var summary = data[i]["Summary"];
       circle.bindPopup(summary);

       var race = data[i]["Race"];
       if (race === "White") {
            circle.addTo(White);
        } else if (race === "Black or African American") {
            circle.addTo(Black);
        } else if (race === "Asian") {
            circle.addTo(Asian);
        } else if (race === "American Indian or Alaska Native") {
            circle.addTo(AmericanIndian);
        } else if (race === "Native Hawaiian or Other Pacific Islander") {
            circle.addTo(NativeHawaiian);
        } else {
            circle.addTo(Unknown);
        }

       if (armed == true && killed == false) {
           armAndHitCount++;
       } else if (armed == true && killed == true) {
           armAndKillCount++;
       } else if (armed == false && killed == false) {
           notAndHitCount++;
       } else if (armed == false && killed == true) {
           notAndKillCount++;
       }
    }

    White.addTo(map);
    Black.addTo(map);
    Asian.addTo(map);
    AmericanIndian.addTo(map);
    NativeHawaiian.addTo(map);
    Unknown.addTo(map);

    var mapPoints = {
        "White": White,
        "Black or African American": Black,
        "Asian": Asian,
        "American Indian or Alaska Native": AmericanIndian,
        "Native Hawaiian or Other Pacific Islander": NativeHawaiian,
        "Unknown": Unknown
    };

    L.control.layers(null,mapPoints).addTo(map);

    document.getElementById('armAndHit').innerHTML = armAndHitCount;
    document.getElementById('notAndHit').innerHTML = armAndKillCount;
    document.getElementById('armAndKill').innerHTML = notAndHitCount;
    document.getElementById('notAndKill').innerHTML = notAndKillCount;
}