(function () {
    'use strict';

    angular
      .module('zouladmin')
      .controller('MainController', MainController);

    /** @ngInject */
    function MainController($zouladmincnfg, $state) {
        var vm = this;

        vm.logout = function () {
            $zouladmincnfg.admin = {};
            $state.go('login');
        }
    }
})();
