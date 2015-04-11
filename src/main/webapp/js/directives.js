angular.module("starter")

    //===========================//
    /////////// NAVBAR ////////////
    //===========================//

    .directive('navbar', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/components/navbar.html'
        }
    })

    //===========================//
    /////////// SIDEBAR ///////////
    //===========================//

    .directive('sidebar', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/components/sidebar.html'
        }
    });