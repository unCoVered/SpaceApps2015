angular.module('starter')

    .factory('geoService', function($http, API, UTIL){
        return({
            getData: getData,
            placeBaseMap: placeBaseMap,
            placeRivers: placeRivers,
            placeGeoJSON: placeGeoJSON
        });

        //===========================//
        /////// RIVER FLOW DATA ///////
        //===========================//

        function getData( swlat, swlon, nelat, nelon, date1, date1hours, date2, date2hours, has2dates, callback) {

            var params = swlat + "/" + swlon + "/" +
                        nelat + "/" + nelon + "/";
            //            date1 + ":" + date1hours +
            //            (has2dates ? "/" + date2 + ":" + date2hours : "");

            console.log(params);

            var millis1 = date1/1000 + Number(date1hours.substring(0,2))*60*60 + Number(date1hours.substring(3,5))*60;
            var millis2 = has2dates ? date2/1000 + Number(date2hours.substring(0,2))*60*60 + Number(date2hours.substring(3,5))*60 : 0;

            var dummy = {
                rect: {
                    swlat: swlat,
                    swlon: swlon,
                    nelat: nelat,
                    nelon: nelon
                },
                date_lower: millis1,
                date_upper: has2dates ? millis2 : millis1
            };
            console.log(JSON.stringify(dummy));
            $http.post(
                API.URL,
                JSON.stringify(dummy),
                {
                    'Content-Type': 'application/json'
                }
            ).success(function(data){
                console.log("Got data.");
                var dataCollection = data.array;
                callback(dataCollection);
            }).error(function(data){
                console.log("Got nothing.");
                console.log(data);
            });
        };

        //===========================//
        ////////// BASE MAP ///////////
        //===========================//

        function placeBaseMap($scope){

            //===========================//
            ////// LEAFLET INIT VARS //////
            //===========================//

            var MIN_ZOOM = 3;
            var INIT_ZOOM = 5;
            var MAX_ZOOM = 8;

            // SPAIN, OLÉ, TORTILLA
            var MAP_LAT = 41.68337;
            var MAP_LON = -0.8883134;

            //===========================//
            ////// LEAFLET BASE MAP ///////
            //===========================//

            $scope.map = L.map('map',{zoomControl: false}).setView([MAP_LAT, MAP_LON], INIT_ZOOM);

            $scope.map.attributionControl.setPrefix('');

            //L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
                subdomains: ['1', '2', '3', '4'],
                minZoom: MIN_ZOOM,
                maxZoom: MAX_ZOOM
            }).addTo($scope.map);

            //===========================//
            ///////// WORLD LIMIT /////////
            //===========================//

            $scope.map.bounds = [],
                $scope.map.setMaxBounds([
                    [84.953828, -179.653976],
                    [-84.938342, 179.103279]
                ]);

            var bounds = new L.latLngBounds([84.953828, -179.653976], [-84.938342, 179.103279]);
            $scope.map.fitBounds(bounds);

            //===========================//
            //////// AREA SELECTOR ////////
            //===========================//

            $scope.swlat = "";
            $scope.swlon = "";
            $scope.nelat = "";
            $scope.nelon = "";

            var areaSelect = L.areaSelect({width:800, height:500});
            areaSelect.on("change", function() {
                var bounds = this.getBounds();
                $scope.swlat = bounds.getSouthWest().lat;
                $scope.swlon = bounds.getSouthWest().lng;
                $scope.nelat = bounds.getNorthEast().lat;
                $scope.nelon = bounds.getNorthEast().lng;
            });
            areaSelect.addTo($scope.map);
        };

        function placeRivers($scope){
            $http.get("data/rivers.geojson").success(function(data){
                L.geoJson(data, {style: function(feature){return {weight: 1.5}}}).addTo($scope.map);
            });
        };

        //===========================//
        /////// GEOJSON POINTS ////////
        //===========================//

        function placeGeoJSON($scope, data){

            var geojsonMarkerOptions = {
                radius: 5,
                fillColor: UTIL.YELLOW,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            L.geoJson(data, {
                style: function(feature){
                    return {color: filterColor(feature.properties.meanFlow, feature.properties.flow)}
                },
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                },
                onEachFeature: function(feature, layer){
                    if (feature.properties && feature.properties.popupContent) {
                        layer.bindPopup(feature.properties.popupContent);
                    }
                }
            }).addTo($scope.map);
        };

        function filterColor(mean,current){
            var d = current/mean;
            if(d>1.1){
                return UTIL.COLORS.RED;
            }else if(d<0.9){
                return UTIL.COLORS.YELLOW;
            }else{
                return UTIL.COLORS.GREEN;
            }
        };
    });