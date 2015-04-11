angular.module('starter')

    .controller('MainCtrl', [ '$scope', '$state', '$location', 'geoService', function($scope,$state,$location,geoService){

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

        //===========================//
        //////////// HOURS ////////////
        //===========================//

        $scope.hours = ["00:00", "00:15", "00:30", "00:45",
                        "01:00", "01:15", "01:30", "01:45",
                        "02:00", "02:15", "02:30", "02:45",
                        "03:00", "03:15", "03:30", "03:45",
                        "04:00", "04:15", "04:30", "04:45",
                        "05:00", "05:15", "05:30", "05:45",
                        "06:00", "06:15", "06:30", "06:45",
                        "07:00", "07:15", "07:30", "07:45",
                        "08:00", "08:15", "08:30", "08:45",
                        "09:00", "09:15", "09:30", "09:45",
                        "10:00", "10:15", "10:30", "10:45",
                        "11:00", "11:15", "11:30", "11:45",
                        "12:00", "12:15", "12:30", "12:45",
                        "13:00", "13:15", "13:30", "13:45",
                        "14:00", "14:15", "14:30", "14:45",
                        "15:00", "15:15", "15:30", "15:45",
                        "16:00", "16:15", "16:30", "16:45",
                        "17:00", "17:15", "17:30", "17:45",
                        "18:00", "18:15", "18:30", "18:45",
                        "19:00", "19:15", "19:30", "19:45",
                        "20:00", "20:15", "20:30", "20:45",
                        "21:00", "21:15", "21:30", "21:45",
                        "22:00", "22:15", "22:30", "22:45",
                        "23:00", "23:15", "23:30", "23:45"
                        ];

        //===========================//
        /////// SUBMIT REQUEST ////////
        //===========================//

        $scope.date1 = "";
        $scope.date2 = "";
        $scope.date1hours = $scope.hours[0];
        $scope.date2hours = $scope.hours[0];
        $scope.date1errors = false;
        $scope.date2errors = false;
        $scope.errorMessage = "";

        $scope.submit = function(){

            var url = "http://localhost:8080/rios/";
            var has2dates = false;
            var tmp1 = 0;
            var tmp2 = 0;
            $scope.hideErrorMessage();

            if($scope.isValid($scope.date1)){
                tmp1 = Date.parse($scope.date1);

                if($scope.isValid($scope.date2)){
                    tmp2 = Date.parse($scope.date2);
                    if(tmp2 < tmp1){
                        $scope.errorMessage = "Second date can't be earlier than first. ";
                        $scope.date2errors = true;
                        return;
                    }else if(tmp2 == tmp1 && !$scope.validHours($scope.date1hours, $scope.date2hours)){
                        $scope.errorMessage = "Second hour can't be earlier than first. ";
                        $scope.date2errors = true;
                        return;
                    }
                    has2dates = true;
                }
                url += $scope.swlat + "/" + $scope.swlon + "/" +
                        $scope.nelat + "/" + $scope.nelon + "/" +
                        tmp1 + ":" + $scope.date1hours +
                        (has2dates ? "/" + tmp2 + ":" + $scope.date2hours : "");
                geoService.getData($scope.swlat,$scope.swlon,$scope.nelat,$scope.nelon,
                                    tmp1,$scope.date1hours,tmp2,$scope.date2hours,has2dates);
                console.log(url);
            }else{
                $scope.errorMessage = "First date is wrong. ";
                $scope.date1errors = true;
            };
        };

        //===========================//
        /////// ERROR VALIDATION //////
        //===========================//

        $scope.isValid = function(data){
            if(data == "" || data == null || data == undefined){
                return false;
            }else{
                return true;
            }
        };

        $scope.validHours = function(hour1, hour2){
            var idx1 = $scope.hours.indexOf(hour1);
            var idx2 = $scope.hours.indexOf(hour2);
            if(idx1 <= idx2){
                return true;
            }else{
                return false;
            }
        };

        $scope.hideErrorMessage = function(){
            $scope.date1errors = false;
            $scope.date2errors = false;
        };

    }]);