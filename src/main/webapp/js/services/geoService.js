angular.module('starter')

    .factory('geoService', function($http, API, UTIL){
        return({
            getData: getData,
            placeBaseMap: placeBaseMap,
            placeGeoJSON: placeGeoJSON
        });

        //===========================//
        /////// RIVER FLOW DATA ///////
        //===========================//

        function getData( swlat, swlon, nelat, nelon, date1, date1hours, date2, date2hours, has2dates ) {

            //var params = swlat + "/" + swlon + "/" +
            //            nelat + "/" + nelon + "/" +
            //            date1 + ":" + date1hours +
            //            (has2dates ? "/" + date2 + ":" + date2hours : "");

            var dummy = {
                rect: {
                    swlat: swlat,
                    swlon: swlon,
                    nelat: nelat,
                    nelon: nelon
                },
                dates: {
                    date1: date1,
                    hour1: date1hours,
                    date2: has2dates ? date2 : null,
                    hour2: has2dates ? date2hours : null
                }
            };
            alert(API.URL + params);
            $http.post(
                API.URL + params,
                JSON.stringify(dummy),
                {
                    'Content-Type': 'application/json'
                }
            ).success(function(data){
                console.log("Got data.");
                return data;
            }).error(function(data){
                console.log("Got nothing.");
                console.log(data);
                return null;
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

            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                minZoom: MIN_ZOOM,
                maxZoom: MAX_ZOOM,
                crs: L.CRS.EPSG4326
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

        function placeGeoJSON($scope, data){
            console.log(data);

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
                    console.log(data.meanFlow);
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
        }
    });