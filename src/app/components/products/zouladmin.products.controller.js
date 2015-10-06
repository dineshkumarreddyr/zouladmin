/* AUTHOR :: DINESH KUMAR
 * DATE :: 05-10-2015
 * DESCRIPTION :: ADD LIST OF PRODUCTS AND LINK THE PROFILES TO THE PRODUCT
 */

(function () {
    "use strict";

    angular
    .module('zouladmin')
    .controller('ProductsController', productsController);

    function productsController($zoulservice, $log, $filter, $scope, Upload, $zouladmincnfg, $timeout) {
        var vm = this;

        /* DEFAULTS */
        vm.showaddProducts = false;
        vm.showupdateproduct = false;
        vm.productstatus = 'disable';
        vm.showSessionsform = false;
        vm.showSessionUpdate = false;
        vm.assignedProfiles = [];

        /* START :: INIT */
        function init() {
            this.getProducts = function () {
                $zoulservice.GetProducts().then(function (response) {
                    if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                        vm.addproductsOptions.data = response.records;
                    }
                }, function (response) {
                    $log.error('API failed' + response);
                });
            };
            this.getLinkedProfiles = function () {
                $zoulservice.GetLinkProfiles().then(function (response) {
                    if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                        vm.profileList = response.records;
                    }
                }, function (response) {
                    $log.error('API Failed' + response);
                });
            }
        }

        (new init()).getProducts();
        (new init()).getLinkedProfiles();

        /* END :: INIT*/

        /* START :: ADD PRODUCTS */
        vm.sessionOptions = {
            showGridFooter: true,
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
            },
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 2,
            columnDefs: [{ field: 'productname', name: 'productName', enablePinning: true },
                         { field: 'session', name: 'Session (in Mins)', enableFiltering: true },
                         { field: 'sessionprice', name: 'sessionPrice (in INR)', enableColumnResizing: true },
                         {
                             name: 'actions', cellTemplate: '<div><button class="btn btn-success"' +
                               ' ng-click="grid.appScope.vm.editSession(grid,row)" title="Edit session"><i class="fa fa-pencil-square-o"></i></button></div>',
                             enableFiltering: false, width: 200
                         }
            ],
            enableRowSelection: true,
            enableFiltering: true
        };

        vm.addproductsOptions = {
            showGridFooter: true,
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
            },
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 2,
            columnDefs: [{ field: 'productname', name: 'Product name', enablePinning: true },
                         { field: 'productdescription', name: 'Description', enableFiltering: true },
                         { field: 'imagelink', name: 'Image', enableColumnResizing: true },
                         {
                             name: 'actions', cellTemplate: '<div><button class="btn btn-success"' +
                               ' ng-click="grid.appScope.vm.editProduct(grid,row)" title="Edit product"><i class="fa fa-pencil-square-o"></i></button><button class="btn btn-success"' +
                               ' ng-click="grid.appScope.vm.addSession(grid,row)" title="Add Sessions"><i class="fa fa-clock-o"></i></button><button class="btn btn-success"' +
                               ' ng-click="grid.appScope.vm.linkProfile(grid,row)" title="Link Profiles"><i class="fa fa-link"></i></button></div>',
                             enableFiltering: false, width: 200
                         }
            ],
            enableRowSelection: true,
            enableFiltering: true
        }
        vm.uploadFile = function (files) {
            if (files && files != null) {
                if (vm.productname === undefined || vm.productname === null || vm.productname === '') {
                    alert('Please fill product name');
                    return;
                }
                Upload.upload({
                    url: $zouladmincnfg.apiUrl + 'fileupload',
                    fields: { 'contactname': vm.productname, 'type': 'app' },
                    file: files
                }).progress(function (evt) {
                    //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('>>Progessing');
                }).success(function (data, status, headers, config) {
                    if (data != undefined) {
                        vm.imagePath = data.url;
                    }
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
            }
        };

        vm.addproduct = function (invalid) {
            if (invalid) {
                alert('Mandatory !!');
                return;
            }

            var data = {
                productname: vm.productname,
                productdescription: vm.productdescription,
                imagelink: vm.imagePath,
                username: 'Admin',
                productstatus: vm.productstatus
            };

            if (data != undefined) {
                $zoulservice.AddProduct(data).then(function (response) {
                    if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                        alert('Data inserted successfully !!');
                        clearproductform();
                        (new init()).getProducts();
                    }
                }, function (response) {
                    $log.error('API Failed' + response);
                });
            }
        };

        var clearproductform = function () {
            vm.productname = vm.productdescription = vm.imagePath = null;
            vm.productstatus = 'disable';
        };

        vm.editProduct = function (grid, row) {
            var data = row.entity;
            if (data != undefined) {
                vm.productname = data.productname;
                vm.productdescription = data.productdescription;
                vm.imagePath = data.imagelink;
                vm.productid = data.productid;
                vm.productstatus = data.productstatus;

                vm.showaddProducts = true;
                vm.showupdateproduct = true;
            }
        }

        vm.updateProduct = function (invalid) {
            if (invalid) {
                alert('Mandatory !!');
                return;
            }

            var data = {
                productname: vm.productname,
                productdescription: vm.productdescription,
                imagelink: vm.imagePath,
                username: 'Admin',
                productstatus: vm.productstatus
            };

            if (data != undefined) {
                $zoulservice.UpdateProduct(vm.productid, data).then(function (response) {
                    if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                        alert('Data updated successfully !!');
                        clearproductform();
                        (new init()).getProducts();
                        vm.showupdateproduct = false;
                        vm.showaddProducts = false;
                    }
                }, function (response) {
                    $log.error('API Failed' + response);
                });
            }
        }

        /* END :: ADD PRODUCTS*/

        /* START :: SESSIONS */

        vm.addSession = function (grid, row) {
            var data = row.entity;
            if (data != undefined) {
                vm.sessionproductname = data.productname;
                vm.productid = data.productid;

                vm.getSessions(vm.productid);

                $timeout(function () {
                    angular.element('.nav-tabs a[href="#addsessions"]').tab('show');
                }, 300);
            }
        };

        vm.saveSessions = function (invalid) {
            if (invalid) {
                alert('Mandatory !!');
                return;
            }

            var data = {
                productid: vm.productid,
                productsession: vm.productsession,
                sessionprice: vm.sessionprice,
                username: 'Admin'
            };

            $zoulservice.AddSessions(data).then(function (response) {
                if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                    alert('Data inserted successfully !!');
                    clearSessionform();
                }
            }, function (response) {
                $log.error('API Error' + response);
            });
        };

        vm.clearSessionform = function () {
            vm.productsession = vm.sessionprice = null;
        };

        vm.getSessions = function (id) {
            $zoulservice.GetSessions(id).then(function (response) {
                if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                    vm.sessionOptions.data = response.records;
                }
            }, function (response) {
                $log.error("API Error" + response);
            });
        };

        vm.editSession = function (grid, row) {
            var data = row.entity;

            if (data != undefined && data != null) {
                vm.productsession = data.session;
                vm.sessionprice = data.sessionprice;
                vm.sessionid = data.sessionsid;

                vm.showSessionsform = true;
                vm.showSessionUpdate = true;
            }
        };

        vm.updateSession = function (invalid) {
            if (invalid) {
                alert('Mandatory !!');
                return;
            }
            var data = {
                productid: vm.productid,
                productsession: vm.productsession,
                sessionprice: vm.sessionprice,
                username: 'Admin'
            };

            $zoulservice.UpdateSession(vm.sessionid, data).then(function (response) {
                if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                    alert('Data updated successfully !!');
                    vm.clearSessionform();
                    vm.getSessions(vm.productid);
                    vm.showSessionsform = false;
                    vm.showSessionUpdate = false;
                }
            }, function (response) {
                $log.error('API Error' + response);
            });
        };

        vm.linkProfile = function (grid, row) {
            var data = row.entity;
            if (data != undefined) {
                vm.linkproductname = data.productname;
                vm.linkproductid = data.productid;
                vm.linkprofileid = data.linkedprofiles;

                vm.bindProfileList(vm.linkprofileid);

                $timeout(function () {
                    angular.element('.nav-tabs a[href="#linkprofile"]').tab('show');
                }, 300);
            }
        }

        vm.assignProfiles = function () {
            if (vm.astrologyprofile == undefined || vm.astrologyprofile == null) {
                alert('Please select a profile');
                return;
            }

            var item = _.filter(vm.profileList, function (v) {
                return v.astrologytypeid == vm.astrologyprofile;
            });

            if (item != undefined && item.length > 0) {
                vm.assignedProfiles.push({
                    astrologer: item[0].astrologer,
                    astrologytypeid: item[0].astrologytypeid
                });
            }
        };

        vm.removeProfile = function (index) {
            vm.assignedProfiles.splice(index, 1);
        };

        vm.addProfiles = function () {
            if (vm.assignedProfiles.length == 0) {
                alert('Please add a profile to save');
                return;
            }
            var profileid = 0;
            _.each(vm.assignedProfiles, function (v, i) {
                if (profileid == 0) {
                    profileid = v.astrologytypeid;
                }
                else {
                    profileid = profileid + '|' + v.astrologytypeid;
                }
            });

            if (profileid != 0) {
                $zoulservice.AddProductProfiles(vm.linkproductid, { "profileid": profileid }).then(function (response) {
                    if (response != undefined && response.status != undefined && response.status.indexOf('success') > -1) {
                        alert('Data updated successfully!!');
                    }
                }, function (response) {
                    $log.error('API Error' + response);
                });
            }
        };

        vm.bindProfileList = function (id) {
            if (id != undefined && id != null) {
                var pid = id.split('|');

                var items = [];

                if (pid.length > 0) {
                    _.each(pid, function (v, i) {
                        var item = _.filter(vm.profileList, function (e) {
                            return v == e.astrologytypeid;
                        });

                        if (item.length > 0) {
                            items.push({
                                astrologer: item[0].astrologer,
                                astrologytypeid: item[0].astrologytypeid
                            });
                        }
                    });

                    if (items.length > 0) {
                        vm.assignedProfiles = items;
                    }
                }
            }
        };

        /* END :: SESSIONS */
    }
})();