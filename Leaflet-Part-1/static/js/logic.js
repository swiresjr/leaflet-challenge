// Store URL as API for earthquakes occuring within the span of a day
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Create the map object - add longitude, latitude, and the starting zoom level
let myMap = L.map("map").setView([30.52, -20.67], 1.5);

// Add title layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Perform a GET request to the query URL
fetch(url)
    .then(response => response.json())
    .then(data => {
        createFeatures(data.features);
    });

    function createFeatures(earthquakeData) {
        // Define a function that we want to run once for each feature in the features array.
        function onEachFeature(feature, layer) {
            layer.bindPopup(`Location: ${feature.properties.place}<br>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km`);
        }
    
        // Create a GeoJSON layer that contains the features array on the earthquakeData object.
        let earthquakes = L.geoJSON(earthquakeData, {
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: feature.properties.mag * 3, // Adjust size based on magnitude
                    fillColor: getColor(feature.geometry.coordinates[2]), // Get color based on depth
                    color: "black",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.6
                });
            }
        });
    
        // Send our earthquakes layer to the createMap function
        createMap(earthquakes);
    }
    
    function createMap(earthquakes) {
        // Create a new map with the earthquakes layer
        earthquakes.addTo(myMap);
        createLegend();
    }
    
    // Function to get color based on depth
    function getColor(depth) {
        return depth > 100 ? 'rgb(247, 6, 58)' :
               depth > 70  ? 'rgb(240, 151, 28)' :
               depth > 50  ? 'rgb(227, 224, 26)' :
               depth > 30  ? 'rgb(42, 252, 74)' :
               depth > 10  ? 'rgb(0, 0, 255)' :
                             'rgb(140, 0, 255)';
    }
    
    // Function to create a color coded legend based on severity
    function createLegend() {
        const legend = L.control({ position: 'bottomright' });
    
        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '<strong>Depth (km)</strong><br>';
            div.innerHTML += '<div style="background:rgb(247, 6, 58); width: 20px; height: 20px; display: inline-block;"></div> > 100<br>';
            div.innerHTML += '<div style="background:rgb(240, 151, 28); width: 20px; height: 20px; display: inline-block;"></div> 70 - 100<br>';
            div.innerHTML += '<div style="background:rgb(227, 224, 26); width: 20px; height: 20px; display: inline-block;"></div> 50 - 70<br>';
            div.innerHTML += '<div style="background:rgb(42, 252, 74); width: 20px; height: 20px; display: inline-block;"></div> 30 - 50<br>';
            div.innerHTML += '<div style="background:rgb(0, 0, 255); width: 20px; height: 20px; display: inline-block;"></div> 10 - 30<br>';
            div.innerHTML += '<div style="background:rgb(140, 0, 255); width: 20px; height: 20px; display: inline-block;"></div> < 10<br>';
            return div;
        };
    
        legend.addTo(myMap);
    }

