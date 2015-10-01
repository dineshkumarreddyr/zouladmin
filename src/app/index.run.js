(function() {
  'use strict';

  angular
    .module('zouladmin')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
