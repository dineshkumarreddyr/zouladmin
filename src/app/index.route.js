(function () {
    'use strict';

    angular
      .module('zouladmin')
      .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
          .state('home', {
              templateUrl: 'app/main/main.html',
              controller: 'MainController',
              controllerAs: 'vm'
          })
            .state('home.astrology', {
                url: '/astrologer',
                templateUrl: 'app/components/astrology/zouladmin.astrology.html',
                controller: 'AstrologerController',
                controllerAs: 'vm'
            })
            .state('home.yoga', {
                url: '/yoga',
                templateUrl: 'app/components/yoga/zouladmin.yoga.html',
                controller: 'YogaController',
                controllerAs: 'vm'
            })
          .state('login', {
              url: '/login',
              templateUrl: 'app/components/login/zouladmin.login.html',
              controller: 'LoginController',
              controllerAs: 'vm'
          });

        $urlRouterProvider.otherwise('/login');
        $locationProvider.html5Mode(true).hashPrefix('!');
    }

})();
