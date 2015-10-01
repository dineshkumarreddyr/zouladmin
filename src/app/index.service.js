(function () {
    "use strict";

    angular
    .module('zouladmin')
    .factory('$zoulservice', zoulService);

    function zoulService($http, $q, $zouladmincnfg, $log) {
        function login(data) {
            var deferred = $q.defer();

            $http.post($zouladmincnfg.apiUrl + 'open', data).success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error(res);
            });
            return deferred.promise;
        };

        function getastroProfiles() {
            var deferred = $q.defer();

            $http.get($zouladmincnfg.apiUrl + 'gastrolist', { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } }).success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error(res);
            });
            return deferred.promise;
        };

        function getUserstatus() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: $zouladmincnfg.apiUrl + 'status',
                headers: {
                    'accesstoken': $zouladmincnfg.admin.accesstoken
                }
            }).success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error(res);
            });
            return deferred.promise;
        };

        function getLanguages() {
            var deferred = $q.defer();

            $http.get($zouladmincnfg.apiUrl + 'lang', { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } }).success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error(res);
            });
            return deferred.promise;
        };

        function createAstrologer(data) {
            var deferred = $q.defer();

            $http.post($zouladmincnfg.apiUrl + 'iast', data, { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } }).success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error(res);
            });
            return deferred.promise;
        };

        function getAstrotypedetailsbyId(id) {
            var deferred = $q.defer();

            $http.get($zouladmincnfg.apiUrl + 'gastrodetails' + '/' + id, { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } }).success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error(res);
            });
            return deferred.promise;
        };

        function getCurrency() {
            var deferred = $q.defer();

            $http.get($zouladmincnfg.apiUrl + 'currency', { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } }).success(function (res) {
                deferred.resolve(res);
            }, function (res) {
                deferred.reject(res);
                $log.error(res);
            });
            return deferred.promise;
        };

        function getPriceunits() {
            var deferred = $q.defer();

            $http.get($zouladmincnfg.apiUrl + 'priceunits', { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } }).success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error('>> Internal API error' + res);
            });
            return deferred.promise;
        };

        function getPaymenttype() {
            var deferred = $q.defer();

            $http.get($zouladmincnfg.apiUrl + 'paymenttype', { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } }).success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error('>> Internal API error' + res);
            });
            return deferred.promise;
        };

        function updateastrologytype(data) {
            var deferred = $q.defer();

            $http.post($zouladmincnfg.apiUrl + 'iastdetail', data, { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } }).success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error('>> Internal API Error' + res);
            });
            return deferred.promise;
        };

        function getYogaprofiles() {
            var deferred = $q.defer();

            $http.get($zouladmincnfg.apiUrl + 'gyogalist', { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } }).success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error('>> Internal API Error' + res);
            });
            return deferred.promise;
        };

        function createYoga(data) {
            var deferred = $q.defer();

            $http.post($zouladmincnfg.apiUrl + 'iyoga', data, { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } })
            .success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error('>> Internal Error ' + res);
            });
            return deferred.promise;
        };

        function getCoordinates() {
            var deferred = $q.defer();

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    deferred.resolve(position);
                }, function (error) {
                    deferred.reject(error);
                    $log.error('Geolocation :: ' + error);
                });
            }
            else {
                deferred.reject('Not supported');
            }

            return deferred.promise;
        };

        function getYogatypebyId(id) {
            var deferred = $q.defer();

            $http.get($zouladmincnfg.apiUrl + 'gyogadetails' + '/' + id, { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } })
            .success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error('>> Internal Error' + res);
            });
            return deferred.promise;
        };

        function updateyogatype(data) {
            var deferred = $q.defer();

            $http.post($zouladmincnfg.apiUrl + 'iyogadetail', data, { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } })
            .success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $loge.error('>> Internal Error' + res);
            });
            return deferred.promise;
        };

        function updateAstrologyprofile(id, data) {
            var deferred = $q.defer();

            $http.put($zouladmincnfg.apiUrl + 'uast' + '/' + id, data, { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } })
            .success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error('>> Internal Error' + res);
            });
            return deferred.promise;
        };

        function getCountries() {
            var country = [{
                name: 'India'
            }];
            return country;
        };

        function getCities() {
            var cities = [{
                name: 'Bangalore'
            }, {
                name: 'Mysore'
            }, {
                name: 'Hyderbad'
            }, {
                name: 'Chennai'
            }];
            return cities;
        };

        function getStates() {
            var state = [{
                name: 'Karnataka'
            }, {
                name: 'Tamilnadu'
            }, {
                name: 'Andhra Pradesh'
            }];
            return state;
        };

        function updateYogaprofile(id, data) {
            var deferred = $q.defer();

            $http.put($zouladmincnfg.apiUrl + 'uyoga' + '/' + id, data, { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } })
            .success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
            });
            return deferred.promise;
        };

        function saveAstrologerinternal(data) {
            var deferred = $q.defer();

            $http.post($zouladmincnfg.apiUrl + 'iastrointernal', data, { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } })
            .success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
            });
            return deferred.promise;
        };

        function getAllastrologytypes() {
            var deferred = $q.defer();

            $http.get($zouladmincnfg.apiUrl + 'gasttypes', { headers: { 'accesstoken': $zouladmincnfg.admin.accesstoken } })
            .success(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject(res);
                $log.error(res);
            });
            return deferred.promise;
        }

        return {
            Login: login,
            AstrologyProfiles: getastroProfiles,
            UserStatus: getUserstatus,
            Languages: getLanguages,
            CreateAstroProfile: createAstrologer,
            Astrotype: getAstrotypedetailsbyId,
            Currency: getCurrency,
            PriceUnits: getPriceunits,
            PaymentType: getPaymenttype,
            UpdateAstrologyType: updateastrologytype,
            YogaProfiles: getYogaprofiles,
            CreateYogaProfile: createYoga,
            Coordinates: getCoordinates,
            Yogatype: getYogatypebyId,
            UpdateYogaType: updateyogatype,
            UpdateAstrologyProfile: updateAstrologyprofile,
            Countries: getCountries,
            Cities: getCities,
            States: getStates,
            UpdateYogaProfile: updateYogaprofile,
            SaveAstrologerInternal: saveAstrologerinternal,
            AstrologyTypes: getAllastrologytypes
        };
    }
})();