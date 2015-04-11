angular.module('starter')

    .controller('MainCtrl', [ '$scope', '$state', '$location', function($scope,$state,$location){

        var MIN_ZOOM = 3;
        var INIT_ZOOM = 5;
        var MAX_ZOOM = 8;

        // SPAIN, OLÉ, TORTILLA
        var MAP_LAT = 41.68337;
        var MAP_LON = -0.8883134;

        var map = L.map('map',{zoomControl: false}).setView([MAP_LAT, MAP_LON], INIT_ZOOM);

        map.attributionControl.setPrefix('');

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: MIN_ZOOM,
            maxZoom: MAX_ZOOM,
            crs: L.CRS.EPSG4326
        }).addTo(map);

        new L.Control.Zoom({ position: 'topright' }).addTo(map);

        map.bounds = [],
            map.setMaxBounds([
                [84.953828, -179.653976],
                [-84.938342, 179.103279]
            ]);

        var bounds = new L.latLngBounds([84.953828, -179.653976], [-84.938342, 179.103279]);
        map.fitBounds(bounds);

    }]);