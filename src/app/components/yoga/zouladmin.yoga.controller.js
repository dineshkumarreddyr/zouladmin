(function () {
    "use strict";

    angular
    .module('zouladmin')
    .controller('YogaController', yogaController);

    function yogaController($scope, $zoulservice, $log, $filter, Upload, $zouladmincnfg, $timeout) {
        var vm = this;

        var userstatus = [];
        vm.yogasystemid = 0;
        vm.yogalistOptions = {
            columnDefs: [{ field: 'cosmicid', name: 'zoulId', enablePinning: true },
                         { field: 'category', name: 'category', enableFiltering: false },
                         { field: 'orgname', name: 'organizationName', enableColumnResizing: true },
                         { field: 'fname', name: 'cotactPerson' },
                         { field: 'locality', name: 'area' },
                         { field: 'city', name: 'city', enableFiltering: false },
                         {
                             field: 'statusname', name: 'profileStatus', enableFiltering: false
                             //filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
                             //    '<select class="form-control" ng-model="vm.status" ng-options="option.profstatus as option.profstatus for option in vm.userstatus"><option value="">Status</option></select></div>'
                         },
                         {
                             name: 'actions', cellTemplate: '<div><button class="btn btn-success"' +
                               ' ng-click="grid.appScope.vm.addYogatype(grid,row)" title="Add astrology type">+</button><button class="btn btn-success"' +
                               ' ng-click="grid.appScope.vm.editYogaprofile(grid,row)" title="Edit yoga profile">O</button></div>',
                             enableFiltering: false
                         }
            ],
            enableRowSelection: true,
            enableFiltering: true
        };

        function init() {
            this.getYogalist = function () {
                $zoulservice.YogaProfiles().then(function (response) {
                    if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                        vm.yogalist = response.records;
                        vm.yogalistOptions.data = response.records;
                    }
                }, function (response) {
                    $log.error('>> API Error ' + response);
                });
            };
            this.getUserstatus = function () {
                $zoulservice.UserStatus().then(function (response) {
                    if (response != undefined && response.status.indexOf('success') > -1) {
                        vm.userstatus = response.records;
                    }
                }, function (response) {
                    $log.error(response);
                });
            };
            /* Start :: Create yoga profile region */
            this.getLanguages = function () {
                $zoulservice.Languages().then(function (response) {
                    if (response != undefined && response.status.indexOf('success') > -1) {
                        vm.languages = response.records;
                    }
                }, function (response) {
                    $log.error(response);
                });
            };
            /* END :: Create yoga profile region*/

            /*START :: Create yoga type */
            this.getCurrency = function () {
                $zoulservice.Currency().then(function (response) {
                    if (response != undefined && response.status.indexOf('success') > -1) {
                        vm.currency = response.records;
                    }
                }, function (response) {
                    $log.error('>> API Error' + response);
                });
            };
            this.getPriceunits = function () {
                $zoulservice.PriceUnits().then(function (response) {
                    if (response != undefined && response.status.indexOf('success') > -1) {
                        vm.priceunits = response.records;
                    }
                }, function (response) {
                    $log.error('>> API Error' + response);
                });
            };
            this.getPaymenttype = function () {
                $zoulservice.PaymentType().then(function (response) {
                    if (response != undefined && response.status.indexOf('success') > -1) {
                        vm.paymenttype = response.records;
                    }
                }, function (response) {
                    $log.error('>> API Error' + response);
                });
            }
            /* END :: Create yoga type */
            /* START :: Default terms */
            this.getCountries = function () {
                vm.countrylist = $zoulservice.Countries();
            };
            this.getCities = function () {
                vm.citylist = $zoulservice.Cities();
            };
            this.getStates = function () {
                vm.statelist = $zoulservice.States();
            };
            this.binddefaultvalues = function () {
                $timeout(function () {
                    vm.city = vm.citylist[0].name;
                    vm.state = vm.statelist[0].name;
                    vm.country = vm.countrylist[0].name;
                }, 2000);
            };
            /* END :: Default terms */
        }

        (new init()).getYogalist();
        (new init()).getUserstatus();
        (new init()).getLanguages();
        (new init()).getPaymenttype();
        (new init()).getPriceunits();
        (new init()).getCurrency();
        (new init()).getCountries();
        (new init()).getCities();
        (new init()).getStates();
        (new init()).binddefaultvalues();

        vm.filterStatus = function () {
            var statusFilter = $filter('filter')(vm.yogalist, { statusname: vm.status });
            vm.yogalistOptions.data = statusFilter;
        }
        vm.resetStatus = function () {
            vm.yogalistOptions.data = vm.yogalist;
        }

        /* START :: Create yoga profile */
        vm.getCordinates = function () {
            $zoulservice.Coordinates().then(function (position) {
                vm.ldt = position.coords.latitude;
                vm.longt = position.coords.longitude;
                //$scope.$apply();
            }, function (response) {
                $log.error('Geolocation :: ' + error);
            });
        };

        vm.uploadFile = function (files) {
            if (files && files != null) {
                if (vm.fname === undefined || vm.fname === null || vm.fname === '') {
                    alert('Please fill organization name');
                    return;
                }
                Upload.upload({
                    url: $zouladmincnfg.apiUrl + 'fileupload',
                    fields: { 'contactname': vm.fname, 'type': 'yoga' },
                    file: files
                }).progress(function (evt) {
                    //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('>>Progessing');
                }).success(function (data, status, headers, config) {
                    if (data != undefined) {
                        vm.UploadedPath = data.url;
                    }
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
            }
        }

        vm.createyogaprofile = function (invalid) {
            if (invalid) {
                alert('Mandatory !!');
                return;
            }

            _.each(vm.languages, function (v) {
                if (v.hasOwnProperty('checked') && v.checked) {
                    if (vm.languagesknown != undefined)
                        vm.languagesknown += ',' + v.langid;
                    else
                        vm.languagesknown = v.langid;
                }
            });

            var data = {
                orgname: vm.orgname,
                fname: vm.fname,
                lname: vm.lname,
                email: vm.email,
                fbpage: vm.fbpage != undefined ? vm.fbpage : '',
                website: vm.website != undefined ? vm.website : '',
                ldt: vm.ldt != undefined ? vm.ldt : '',
                longt: vm.longt != undefined ? vm.longt : '',
                address: vm.address,
                landmark: vm.landmark != undefined ? vm.landmark : '',
                city: vm.city,
                state: vm.state,
                country: vm.country,
                story: vm.story != undefined ? vm.story : '',
                privatenumber: vm.privatenumber != undefined ? vm.privatenumber : '',
                publicnumber: vm.publicnumber != undefined ? vm.publicnumber : '',
                ustatus: vm.ustatus != undefined ? vm.ustatus : '5',
                publicrating: vm.publicrating,
                photolink: vm.UploadedPath != undefined ? vm.UploadedPath : 'http://45.55.171.166:7569/images/astrology/noimg.jpg',
                pincode: vm.pincode != undefined ? vm.pincode : '0',
                createduser: 'admin',
                modifieduser: 'admin',
                createddate: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                modifieddate: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                category: vm.category != undefined ? vm.category : '',
                locality: vm.locality != undefined ? vm.locality : ''

            };

            $zoulservice.CreateYogaProfile(data).then(function (response) {
                if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                    alert('Yoga profile created successfully !!');
                }
            }, function (response) {
                $log.error('>> API Error ' + response);
            });
        }

        vm.clearyogaform = function () {
            vm.orgname = null;
            vm.fname = null;
            vm.lname = null;
            vm.email = null;
            vm.fbpage = null;
            vm.website = null;
            vm.ldt = null;
            vm.longt = null;
            vm.address = null;
            vm.landmark = null;
            vm.city = null;
            vm.state = null;
            vm.country = null;
            vm.story = null;
            vm.privatenumber = null;
            vm.publicnumber = null;
            vm.ustatus = null;
            vm.publicrating = null;
            vm.pincode = null;
            vm.category = null;
            vm.UploadedPath = null;
            vm.ustatus = null;
            vm.languages = null;
            vm.cosmicid = null;
            vm.yogasystemid = 0;
            vm.cosmicid = null;
        }
        /* END :: Create yoga profile */

        /* START :: Edit Yoga profile */
        vm.editYogaprofile = function (grid, row) {
            var data = row.entity;
            if (data) {
                vm.yogasystemid = data.systemid;
                vm.cosmicid = data.cosmicid;
                vm.orgname = data.orgname;
                vm.category = data.category;
                vm.fname = data.fname;
                vm.email = data.email;
                vm.publicnumber = data.publicnumber;
                vm.privatenumber = data.privatenumber;
                vm.story = data.shortstory;
                vm.fbpage = data.fbpage;
                vm.website = data.website;
                vm.address = data.address;
                vm.locality = data.locality;
                vm.landmark = data.landmark;
                vm.city = data.city;
                vm.state = data.state;
                vm.country = data.country;
                vm.ldt = data.latitude;
                vm.longt = data.longitude;
                vm.pincode = data.pincode;
                vm.publicrating = data.publicrating;
                vm.ustatus = data.userstatus;
                vm.UploadedPath = data.photo;
            }

            $timeout(function () {
                angular.element('.nav-tabs a[href="#create"]').tab('show');
            }, 200);
        }

        vm.edityoga = function (invalid) {
            if (invalid) {
                alert('Mandatory !!');
                return;
            }
            _.each(vm.languages, function (v) {
                if (v.hasOwnProperty('checked') && v.checked) {
                    if (vm.languagesknown != undefined)
                        vm.languagesknown += ',' + v.langid;
                    else
                        vm.languagesknown = v.langid;
                }
            });

            var data = {
                orgname: vm.orgname,
                fname: vm.fname,
                lname: vm.lname,
                email: vm.email,
                fbpage: vm.fbpage != undefined ? vm.fbpage : '',
                website: vm.website != undefined ? vm.website : '',
                ldt: vm.ldt != undefined ? vm.ldt : '',
                longt: vm.longt != undefined ? vm.longt : '',
                address: vm.address,
                landmark: vm.landmark != undefined ? vm.landmark : '',
                city: vm.city,
                state: vm.state,
                country: vm.country,
                story: vm.story != undefined ? vm.story : '',
                privatenumber: vm.privatenumber != undefined ? vm.privatenumber : '',
                publicnumber: vm.publicnumber != undefined ? vm.publicnumber : '',
                ustatus: vm.ustatus != undefined ? vm.ustatus : '5',
                publicrating: vm.publicrating,
                photolink: vm.UploadedPath != undefined ? vm.UploadedPath : 'http://45.55.171.166:7569/images/astrology/noimg.jpg',
                pincode: vm.pincode != undefined ? vm.pincode : '0',
                createduser: 'admin',
                modifieduser: 'admin',
                createddate: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                modifieddate: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                category: vm.category != undefined ? vm.category : '',
                locality: vm.locality != undefined ? vm.locality : ''

            };

            $zoulservice.UpdateYogaProfile(vm.yogasystemid, data).then(function (response) {
                if (response != undefined && response.status.indexOf('success') > -1) {
                    alert('Data saved successfully !!');
                    (new init()).getYogalist();
                    clearyogaform();
                }
            }, function (response) {
                $log.error(response);
            });


        }
        /* END :: Edit Yoga profile */

        /* START :: Create yoga type */
        vm.yogatypeOptions = {
            enableFiltering: true,
            columnDefs: [
                { field: 'yogatype', name: 'yogaType' },
                { field: 'currency', name: 'currency' },
                { field: 'price', name: 'charge' },
                { field: 'units', name: 'units' },
                { field: 'paymenttype', name: 'paymentType' },
                { field: 'future', name: 'futureYogaProfile', enableFiltering: false },
                { name: 'actions', cellTemplate: '<div><button class="btn btn-success" ng-click="grid.appScope.vm.editYogatype(grid,row)" title="Edit Yoga type">O</button></div>', enableFiltering: false }
            ]
        }
        vm.getYogaDetailsbyId = function (id) {
            $zoulservice.Yogatype(id).then(function (response) {
                if (response != undefined && response.status.indexOf('success') > -1) {
                    vm.yogatypeOptions.data = response.records;

                    $timeout(function () {
                        angular.element('.nav-tabs a[href="#type"]').tab('show');
                    }, 300);
                }
            }, function (response) {
                $log.error('>> API Error' + response);
            });
        }
        vm.addYogatype = function (grid, row) {
            if (row) {
                vm.selectedYogaReferenceId = row.entity.systemid;
                vm.selectedYogaId = row.entity.cosmicid;

                if (vm.selectedYogaReferenceId && vm.selectedYogaId) {
                    vm.getYogaDetailsbyId(vm.selectedYogaReferenceId);
                }
            }
        };

        vm.updateyogatype = function (invalid) {
            if (invalid) {
                alert('Mandatory !!');
                return;
            }
            var data = {
                yogatype: vm.yogatype,
                priceunits: vm.selectedpriceunits,
                price: vm.price,
                currency: vm.currencytype,
                paymenttype: vm.selectedpaymenttype,
                createduser: 'Admin',
                modifieduser: 'Admin',
                createddate: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                modifieddate: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                yogasystemid: vm.selectedYogaReferenceId,
                isfuture: vm.futurelisting != undefined && vm.futurelisting != null ? vm.futurelisting : false
            };

            $zoulservice.UpdateYogaType(data).then(function (response) {
                if (response != undefined && response.status.indexOf('success') > -1) {
                    alert('Yoga type saved successfully !!');
                    vm.getYogaDetailsbyId(vm.selectedYogaReferenceId);
                    clearAstrotypeform();
                }
            }, function (response) {
                $log.error('>> API Error' + response);
            });
        };

        var clearAstrotypeform = function () {
            vm.yogatype = vm.selectedpriceunits = vm.price = vm.currencytype = vm.selectedpaymenttype = vm.futurelisting = null;
        }
        vm.editYogatype = function (grid, row) {
            vm.showYogatypePanel = true;
        }
        /* END  :: Create yoga type */
    }
})();