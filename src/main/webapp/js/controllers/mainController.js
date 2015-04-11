angular.module('starter')

    .controller('MainCtrl', [ '$scope', '$state', '$location', function($scope,$state,$location){

        //===========================//
        /////* LEAFLET INIT VARS */////
        //===========================//

        var MIN_ZOOM = 3;
        var INIT_ZOOM = 5;
        var MAX_ZOOM = 8;

        // SPAIN, OLÉ, TORTILLA
        var MAP_LAT = 41.68337;
        var MAP_LON = -0.8883134;

        //===========================//
        /////* LEAFLET BASE MAP *//////
        //===========================//

        var map = L.map('map',{zoomControl: false}).setView([MAP_LAT, MAP_LON], INIT_ZOOM);

        map.attributionControl.setPrefix('');

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: MIN_ZOOM,
            maxZoom: MAX_ZOOM,
            crs: L.CRS.EPSG4326
        }).addTo(map);

        //===========================//
        ////////* WORLD LIMIT *////////
        //===========================//

        map.bounds = [],
            map.setMaxBounds([
                [84.953828, -179.653976],
                [-84.938342, 179.103279]
            ]);

        var bounds = new L.latLngBounds([84.953828, -179.653976], [-84.938342, 179.103279]);
        map.fitBounds(bounds);

        //===========================//
        ///////* AREA SELECTOR *///////
        //===========================//

        var areaSelect = L.areaSelect({width:100, height:100});
        areaSelect.on("change", function() {
            var bounds = this.getBounds();
            console.log(bounds.getSouthWest().lat + ", " + bounds.getSouthWest().lng);
            console.log(bounds.getNorthEast().lat + ", " + bounds.getNorthEast().lng);
        });
        areaSelect.addTo(map);

        //===========================//
        //////* SUBMIT REQUEST *///////
        //===========================//

        $scope.submit = function(){
            alert('they submitting, me alerting');
        }


        //===========================//
        ///////////* HOURS *///////////
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
                        ]
    }]);