(function () {
    'use strict';

    angular
      .module('zouladmin')
      .controller('AstrologerController', astrologerController);

    function astrologerController($zoulservice, $log, $filter, $scope, Upload, $zouladmincnfg, $timeout) {
        var vm = this;

        vm.userstatus = [];
        vm.showAstrologytypePanel = false;
        vm.astrosystemid = 0;
        vm.astrotypeOptions = {};
        vm.astrolistOptions = {
            showGridFooter: true,
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
            },
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 2,
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
                               ' ng-click="grid.appScope.vm.addAstrotype(grid,row)" title="Add astrology type"><i class="fa fa-user-plus"></i></button><button class="btn btn-success"' +
                               ' ng-click="grid.appScope.vm.editAstroprofile(grid,row)" title="Edit astroology profile"><i class="fa fa-pencil-square-o"></i></button><button class="btn btn-success"' +
                               ' ng-click="grid.appScope.vm.editInternal(grid,row)" title="Add internal communication"><i class="fa fa-plus"></i></button></div>',
                             enableFiltering: false, width: 200
                         }
            ],
            enableRowSelection: true,
            enableFiltering: true
        };
        vm.astrotypeOptions = {
            enableFiltering: true,
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
            },
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 2,
            columnDefs: [
                { field: 'astrologytype', name: 'astrologyType' },
                { field: 'currency', name: 'currency' },
                { field: 'price', name: 'charge' },
                { field: 'units', name: 'units' },
                { field: 'paymenttype', name: 'paymentType' },
                { field: 'future', name: 'futureAstrologer', enableFiltering: false },
                { name: 'actions', cellTemplate: '<div><button class="btn btn-success" ng-click="grid.appScope.vm.editAstrotype(grid,row)" title="Edit astrology type"><i class="fa fa-pencil-square-o"></i></button></div>' }
            ]
        };

        function init() {
            this.getAstroList = function () {
                $zoulservice.AstrologyProfiles().then(function (response) {
                    if (response != undefined && response.status.indexOf('success') > -1) {
                        vm.astroList = response.records;
                        loadGrid(response.records);
                    }
                }, function (response) {
                    $log.error(response);
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

            /* Start :: Create astrologer profile region */
            this.getLanguages = function () {
                $zoulservice.Languages().then(function (response) {
                    if (response != undefined && response.status.indexOf('success') > -1) {
                        vm.languages = response.records;
                    }
                }, function (response) {
                    $log.error(response);
                });
            };
            /* END :: Create astrologer profile region*/

            /*START :: Create astrology type */
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
            };
            this.getAstrologytypes = function () {
                $zoulservice.AstrologyTypes().then(function (response) {
                    if (response != undefined && response.status.indexOf('success') > -1) {
                        vm.astroTypes = response.records;
                    }
                }, function (response) {
                    $log.error('>> API Error' + response);
                });
            };
            /* END :: Create astrology type */
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

        (new init()).getAstroList();
        (new init()).getUserstatus();
        (new init()).getLanguages();
        (new init()).getCurrency();
        (new init()).getPriceunits();
        (new init()).getPaymenttype();
        (new init()).getCountries();
        (new init()).getCities();
        (new init()).getStates();
        (new init()).binddefaultvalues();
        (new init()).getAstrologytypes();

        $timeout(function () {
            vm.city = vm.citylist[0];
            vm.state = vm.statelist[0];
            vm.country = vm.countrylist[0];
        }, 200);

        var loadGrid = function (data) {
            vm.astrolistOptions.data = data;
        }

        vm.filterStatus = function () {
            var statusFilter = $filter('filter')(vm.astroList, { statusname: vm.status });
            vm.astrolistOptions.data = statusFilter;
        }
        vm.resetStatus = function () {
            vm.astrolistOptions.data = vm.astroList;
        }
        vm.addAstrotype = function (grid, row) {
            if (row) {
                vm.selectedAstrologerReferenceId = row.entity.systemid;
                vm.selectedAstrologerId = row.entity.cosmicid;

                if (vm.selectedAstrologerReferenceId && vm.selectedAstrologerId) {
                    vm.getAstrologyDetailsbyId(vm.selectedAstrologerReferenceId);
                }
            }
        };

        /* START :: Create atrologer profile */
        vm.getCordinates = function () {
            $zoulservice.Coordinates().then(function (position) {
                vm.ldt = position.coords.latitude;
                vm.longt = position.coords.longitude;
                $scope.$apply();
            }, function (response) {
                $log.error('Geolocation :: ' + error);
            });
        }

        vm.createastroprofile = function (invalid) {
            if (invalid) {
                alert('Mandatory !!');
                return;
            }
            var languages;
            /*Languages */
            _.each(vm.languages, function (v) {
                if (v.hasOwnProperty('checked') && v.checked) {
                    if (languages != undefined)
                        languages += ',' + v.langid;
                    else
                        languages = v.langid;
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
                locality: vm.locality != undefined ? vm.locality : '',
                languagesknown: languages
            };

            $zoulservice.CreateAstroProfile(data).then(function (response) {
                if (response != undefined && response.status.indexOf('success') > -1) {
                    alert('Data saved successfully');
                    clearProfileform();

                    (new init()).getAstroList();

                    $timeout(function () {
                        angular.element('.nav-tabs a[href="#all"]').tab('show');
                    }, 300);

                }
            }, function (response) {
                $log.error('>>API error' + response);
            });
        }

        vm.uploadFile = function (files) {
            if (files && files != null) {
                if (vm.fname === undefined || vm.fname === null || vm.fname === '') {
                    alert('Please fill organization name');
                    return;
                }
                Upload.upload({
                    url: $zouladmincnfg.apiUrl + 'fileupload',
                    fields: { 'contactname': vm.fname, 'type': 'astrology' },
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
        /* END :: Create astrologer profile */

        /* START :: Edit astrologer profile */
        vm.editAstroprofile = function (grid, row) {
            var data = row.entity;
            if (data) {
                vm.astrosystemid = data.systemid;
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
                vm.ldt = data.latitude;
                vm.longt = data.longitude;
                vm.pincode = data.pincode;
                vm.publicrating = data.publicrating;
                vm.UploadedPath = data.photo;
                vm.ustatus = data.userstatus;

                /* For Languages */
                if (vm.languages) {
                    var selectedArray = data.languagesknown.split(',');
                    if (selectedArray.length > 0) {
                        _.each(selectedArray, function (v, i) {
                            var fiteredObj = _.filter(vm.languages, function (a) {
                                return a.langid == v;
                            });
                            if (fiteredObj.length > 0) {
                                fiteredObj[0].checked = true;
                            }
                        });
                    }
                }
            }

            $timeout(function () {
                angular.element('.nav-tabs a[href="#create"]').tab('show');
            }, 300);
        };

        vm.updateProfile = function (invalid) {
            if (invalid) {
                alert('Mandatory !!');
                return;
            }
            var languages;
            /*Languages */
            _.each(vm.languages, function (v) {
                if (v.hasOwnProperty('checked') && v.checked) {
                    if (languages != undefined)
                        languages += ',' + v.langid;
                    else
                        languages = v.langid;
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
                locality: vm.locality != undefined ? vm.locality : '',
                languagesknown: languages
            };

            $zoulservice.UpdateAstrologyProfile(vm.astrosystemid, data).then(function (response) {
                if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                    alert('Data updated successfully !!');
                    clearProfileform();

                    (new init()).getAstroList();

                    $timeout(function () {
                        angular.element('.nav-tabs a[href="#all"]').tab('show');
                    }, 300);
                }
            }, function (response) {
                $log.error('>> API error' + res);
            });
        }

        var clearProfileform = function () {
            vm.orgname = vm.fname = vm.lname = vm.email = vm.fbpage = vm.website = vm.ldt = vm.longt = vm.address = vm.landmark = vm.story =
                vm.privatenumber = vm.publicnumber = vm.ustatus = vm.publicrating = vm.UploadedPath = vm.pincode = vm.category = vm.locality = null;
        }
        /* END :: Edit astrologer profile */

        /* START :: Astrology details */
        vm.getAstrologyDetailsbyId = function (id) {
            $zoulservice.Astrotype(id).then(function (res) {
                if (res != undefined && res.status.indexOf('success') > -1) {
                    vm.astrotypeOptions.data = res.records;

                    $timeout(function () {
                        angular.element('.nav-tabs a[href="#type"]').tab('show');
                    }, 300);
                }
            }, function (res) {
                $log.error(res);
            });
        }
        vm.updateastrologytype = function (invalid) {
            if (invalid) {
                alert('Mandatory!!');
                return;
            }
            var data = {
                astrologytype: vm.astrologytype,
                priceunits: vm.selectedpriceunits,
                price: vm.price,
                currency: vm.currencytype,
                paymenttype: vm.selectedpaymenttype,
                createduser: 'Admin',
                modifieduser: 'Admin',
                createddate: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                modifieddate: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                astrosystemid: vm.selectedAstrologerReferenceId,
                isfuture: vm.futurelisting != undefined && vm.futurelisting != null ? vm.futurelisting : false
            }

            $zoulservice.UpdateAstrologyType(data).then(function (response) {
                if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                    alert('Data saved successfully');
                    vm.getAstrologyDetailsbyId(vm.selectedAstrologerReferenceId);
                    clearAstrotypeform();
                }
            }, function (response) {
                $log.error('>>API Error' + response);
            });
        };

        var clearAstrotypeform = function () {
            vm.astrologytype = vm.selectedpriceunits = vm.price = vm.currencytype = vm.selectedpaymenttype = vm.futurelisting = null;
        }

        vm.editAstrotype = function (grid, row) {
            vm.showAstrologytypePanel = true;
        }
        /* END :: Astrology details */

        /* START :: Save Internal info */
        vm.editInternal = function (grid, row) {
            var data = row.entity;
            if (data) {
                vm.selectedAstrologerReferenceId = data.systemid;
                vm.selectedAstrologerid = data.cosmicid;
            }

            $timeout(function () {
                angular.element('.nav-tabs a[href="#internal"]').tab('show');
            }, 200);
        }

        vm.saveinternalinfo = function (invalid) {
            if (invalid) {
                alert('mandatory !!');
                return;
            }

            var data = {
                astroid: vm.selectedAstrologerReferenceId,
                communication: vm.encommunication,
                rating: vm.internalrating,
                judgement: vm.judgement,
                videoaccept: vm.willingvideos,
                estbyear: vm.experience,
                ambience: vm.ambience,
                createduser: 'admin',
                modifieduser: 'admin',
                createddate: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                modifieddate: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                instantbooking: vm.instantbooking,
                instantbookingfees: vm.ibookingfees,
                phoneconsulation: vm.phoneconsulation,
                refund: vm.refund,
                learnedby: vm.learnedby,
                doingas: vm.doingas,
                guruname: vm.guruname
            };

            $zoulservice.SaveAstrologerInternal(data).then(function (response) {
                if (response != undefined && response.status.indexOf('success') > -1) {
                    alert('Data saved successfully');
                    clearAstrologerInternal();
                }
            }, function (responose) {
                $log.error('>> API Failed' + response);
            });
        }

        var clearAstrologerInternal = function () {
            vm.encommunication = null;
            vm.internalrating = null;
            vm.judgement = null;
            vm.willingvideos = null;
            vm.experience = null;
            vm.ambience = null;
            vm.instantbooking = null;
            vm.ibookingfees = null;
            vm.phoneconsulation = null;
            vm.refund = null;
            vm.learnedby = null;
            vm.doingas = null;
            vm.guruname = null;
        }
        /* END :: Save internal info */
    }
})();
