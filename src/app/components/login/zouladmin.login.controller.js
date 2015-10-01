(function () {
    'use strict';

    angular
      .module('zouladmin')
      .controller('LoginController', loginController);

    /** @ngInject */
    function loginController($timeout, $zoulservice, $log, $zouladmincnfg, $state) {
        var vm = this;

        vm.login = function (invalid) {
            if (invalid) {
                alert('Mandatory');
                return;
            }
            var data = {};
            try {
                data.username = vm.adminusername;
                data.password = vm.adminpassword;

                $zoulservice.Login(data).then(function (response) {
                    if (response !== undefined && response.status.indexOf('success') > -1) {
                        $zouladmincnfg.admin = response.records[0];
                        $state.go('home.astrology');
                    }
                }, function (response) {
                    $log.error(response);
                });
            }
            catch (e) {
                $log.error(e.message);
            }
        };
    }
})();