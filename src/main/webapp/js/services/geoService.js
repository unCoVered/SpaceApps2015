angular.module('starter')

    //===========================//
    /////// RIVER FLOW DATA ///////
    //===========================//

    .factory('geoService', function($http, API){
        return({
            getData: getData
        });

        function getData( swlat, swlon, nelat, nelon, date1, date1hours, date2, date2hours, has2dates ) {

            var params = swlat + "/" + swlon + "/" +
                        nelat + "/" + nelon + "/" +
                        date1 + ":" + date1hours +
                        (has2dates ? "/" + date2 + ":" + date2hours : "");

            $http({
                /*method: "POST",
                url: API.URL,
                params: {
                    action: "add"
                },
                data: {
                    name: name
                }*/
                method: "GET",
                url: API.URL + params

            }).success(function(data){
                console.log("Got data.");
                return data;
            }).error(function(data){
                console.log("Got nothing.");
                console.log(data);
                return null;
            });
        };
    });