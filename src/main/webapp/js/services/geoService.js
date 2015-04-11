angular.module('starter')

    .factory('geoService', function($http, API){
        return({
            getData: getData,
            placeBaseMap: placeBaseMap
        });

        //===========================//
        /////// RIVER FLOW DATA ///////
        //===========================//

        function getData( swlat, swlon, nelat, nelon, date1, date1hours, date2, date2hours, has2dates ) {

            var params = swlat + "/" + swlon + "/" +
                        nelat + "/" + nelon + "/" +
                        date1 + ":" + date1hours +
                        (has2dates ? "/" + date2 + ":" + date2hours : "");

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
            //alert(API.URL + params);
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

            var map = L.map('map',{zoomControl: false}).setView([MAP_LAT, MAP_LON], INIT_ZOOM);

            map.attributionControl.setPrefix('');

            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                minZoom: MIN_ZOOM,
                maxZoom: MAX_ZOOM,
                crs: L.CRS.EPSG4326
            }).addTo(map);

            //===========================//
            ///////// WORLD LIMIT /////////
            //===========================//

            map.bounds = [],
                map.setMaxBounds([
                    [84.953828, -179.653976],
                    [-84.938342, 179.103279]
                ]);

            var bounds = new L.latLngBounds([84.953828, -179.653976], [-84.938342, 179.103279]);
            map.fitBounds(bounds);

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
            areaSelect.addTo(map);
        };
    });