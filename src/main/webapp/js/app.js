angular.module('starter', ['ui.router', 'ui.bootstrap'])

    //===========================//
    /////// ROUTES AND VIEWS //////
    //===========================//

    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider

            .state('starter', {
                url: "/",
                templateUrl: "index.html"
            })

            .state('home', {
                url: "/home",
                templateUrl: "templates/main/home.html",
                controller: "MainCtrl"
            });

        $urlRouterProvider.otherwise('home');
    });