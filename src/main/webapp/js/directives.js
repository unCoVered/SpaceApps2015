angular.module("starter")

    .directive('navbar', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/components/navbar.html'
        }
    })

    .directive('footer', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/components/sidebar.html'
        }
    });