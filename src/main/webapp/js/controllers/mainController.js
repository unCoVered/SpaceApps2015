angular.module('starter')

    .controller('MainCtrl', [ '$scope', '$timeout', 'UTIL', 'geoService', function($scope,$timeout,UTIL,geoService){

        geoService.placeBaseMap($scope);

        //===========================//
        //////////// HOURS ////////////
        //===========================//

        $scope.hours = UTIL.HOURS;

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
        $scope.count = 0;
        $scope.dataCollection = "";

        $scope.submit = function(){

            var has2dates = false;
            var tmp1 = 0;
            var tmp2 = 0;
            $scope.hideErrorMessage();

            if($scope.isValid($scope.date1)){
                tmp1 = Date.parse($scope.date1);

                if($scope.isValid($scope.date2)){
                    tmp2 = Date.parse($scope.date2);
                    $scope.validDates(tmp1,tmp2);
                    has2dates = true;
                }
                //var data = geoService.getData($scope.swlat,$scope.swlon,$scope.nelat,$scope.nelon,tmp1,$scope.date1hours,tmp2,$scope.date2hours,has2dates);
                $scope.dataCollection = UTIL.TEST_POINT;
                console.log($scope.dataCollection);
                displayData();
                $scope.date2 = "";

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

        $scope.validDates = function(date1, date2){
            if(date2 < date1){
                $scope.errorMessage = "Second date can't be earlier than first. ";
                $scope.date2errors = true;
                return;
            }else if(date2 == date1 && !$scope.validHours($scope.date1hours, $scope.date2hours)){
                $scope.errorMessage = "Second hour can't be earlier than first. ";
                $scope.date2errors = true;
                return;
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

         function displayData(){
            console.log($scope.count + " " + $scope.dataCollection.length);
            geoService.placeGeoJSON($scope,$scope.dataCollection[$scope.count++]);
            $scope.count = ($scope.count)%$scope.dataCollection.length;

            $timeout(displayData,2000);
        };

    }]);