(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentConsoleAndPackingController", ShipmentConsoleAndPackingController);

    ShipmentConsoleAndPackingController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "APP_CONSTANT", "authService", "apiService", "appConfig", "shipmentConfig", "helperService", "toastr", "confirmation", "$uibModal"];

    function ShipmentConsoleAndPackingController($rootScope, $scope, $state, $timeout, $location, APP_CONSTANT, authService, apiService, appConfig, shipmentConfig, helperService, toastr, confirmation, $uibModal) {
        /* jshint validthis: true */
        var ShipmentConsolePackingCtrl = this;

        function Init() {
            var currentShipment = ShipmentConsolePackingCtrl.currentShipment[ShipmentConsolePackingCtrl.currentShipment.label].ePage.Entities;
            ShipmentConsolePackingCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_ConsoleAndPacking",
                "Masters": {
                    "Package": {},
                    "ShipmentDangerousGoods": {},
                    "ShipmentJobLocation": {},
                    "ShipmentConsol": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            ShipmentConsolePackingCtrl.ePage.Masters.DropDownMasterList = shipmentConfig.Entities.Header.Meta;

            InitConsole();
            InitPacking();
        }
        // ==========================Console Details Begin ====================================
        function InitConsole() {
            ShipmentConsolePackingCtrl.ePage.Masters.ShipmentConsol.DeleteConsole = DeleteConsole;
            ShipmentConsolePackingCtrl.ePage.Masters.ShipmentConsol.ConsoleDeleteConfirmation = ConsoleDeleteConfirmation;
            ShipmentConsolePackingCtrl.ePage.Masters.SelectedGridRowConsol = SelectedGridRowConsol;
            ShipmentConsolePackingCtrl.ePage.Masters.SelectedConsoleData = SelectedConsoleData;

            if (!ShipmentConsolePackingCtrl.currentShipment.isNew) {
                GetConsolListing();
            } else {
                ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIConShpMappings = [];
            }
        }

        function GetConsolListing() {
            var _filter = {
                "SHP_FK": ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    GetContainerList(response.data.Response);
                    $rootScope.GetRotingList();
                }
            });
        }

        function GetContainerList(data) {
            ShipmentConsolePackingCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            if (data.length > 0) {
                data.map(function (value1, key1) {
                    value1.UICntContainerList.map(function (value2, key2) {
                        var _isExist = ShipmentConsolePackingCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
                            return value3.PK === value2.PK;
                        });

                        if (!_isExist) {
                            var _obj = {
                                "ContainerNo": value2.ContainerNo,
                                "CNT": value2.PK,
                                "ContainerCount": value2.ContainerCount,
                                "RC_Type": value2.RC_Type,
                                "SealNo": value2.SealNo
                            };
                            ShipmentConsolePackingCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                        }
                    });
                });
            } else {
                ShipmentConsolePackingCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            }
        }

        function SelectedConsoleData($item) {
            var _tempArray = [];

            $item.map(function (val, key) {
                var _isExist = ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIConShpMappings.some(function (value, index) {
                    return value.CON_FK === val.PK;
                });

                if (!_isExist) {
                    var _tempObj = {
                        "SHP_FK": ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.PK,
                        "CON_FK": val.PK,
                        "PK": "",
                        "TenantCode": authService.getUserInfo().TenantCode,
                    };
                    _tempArray.push(_tempObj)
                } else {
                    toastr.warning(val.ConsolNo + " Already Available...!");
                }
            });
            if (_tempArray.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.Insert.Url, _tempArray).then(function (response) {
                    if (response.data.Response) { }
                    GetConsolListing();
                });
            }
        }

        function SelectedGridRowConsol(item) {
            ConsoleDeleteConfirmation(item);
        }

        function ConsoleDeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteConsole($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteConsole($item) {
            var _index = ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
                return value.PK;
            }).indexOf($item.PK);

            if (_index !== -1) {
                apiService.get("eAxisAPI", appConfig.Entities.ConShpMapping.API.Delete.Url + $item.PK).then(function (response) {
                    if (response.data.Response) {
                        GetConsolListing();
                        // $rootScope.GetContainerList();
                        // $rootScope.GetRotingList();
                    }
                });
            }
        }
        // ==========================Console Details End ====================================

        // =======================Packing Begin=======================
        function InitPacking() {
            ShipmentConsolePackingCtrl.ePage.Masters.Package.FormView = {};
            ShipmentConsolePackingCtrl.ePage.Masters.Package.FormView.JobDangerousGoods = [];
            ShipmentConsolePackingCtrl.ePage.Masters.Package.FormView.JobLocation = [];
            ShipmentConsolePackingCtrl.ePage.Masters.Package.AddNewPacking = AddNewPacking;
            ShipmentConsolePackingCtrl.ePage.Masters.Package.DeletePacking = DeletePacking;
            ShipmentConsolePackingCtrl.ePage.Masters.Package.PackageDeleteConfirmation = PackageDeleteConfirmation;
            ShipmentConsolePackingCtrl.ePage.Masters.Package.SelectedGridRow = SelectedGridRow;

            $rootScope.GetPackingDetails = GetPackingDetails;

            if (!ShipmentConsolePackingCtrl.currentShipment.isNew) {
                // GetPackingList();
                ShipmentConsolePackingCtrl.ePage.Masters.Package.GridData = [];
            } else {
                ShipmentConsolePackingCtrl.ePage.Masters.Package.GridData = [];
            }

            sum();
        }

        function GetPackingList() {
            var _filter = {
                "SHP_FK": ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        var _isExist = ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                            return value1.PK === value.PK;
                        });

                        if (!_isExist) {
                            ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                        }
                    });

                    GetPackingDetails();
                }
            });
        }
        // Package Details     
        function GetPackingDetails() {
            var _gridData = [];
            ShipmentConsolePackingCtrl.ePage.Masters.Package.GridData = undefined;
            $timeout(function () {
                if (ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "OUT") {
                            value.Index = key;
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Package List is Empty");
                }
                ShipmentConsolePackingCtrl.ePage.Masters.Package.GridData = _gridData;
                ShipmentConsolePackingCtrl.ePage.Masters.Package.FormView = {};

                sum();
            });
        }

        function SelectedGridRow(item, type, index) {
            if (type == 'edit')
                AddNewPacking('edit', item, index);
            else
                PackageDeleteConfirmation(item, index);
        }
        // Add New For paackage
        function AddNewPacking(action, item, index) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "consolpacking right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eAxis/freight/shipment/console-and-packing/tabs/packing-modal.html",
                controller: 'ConsolPackingModalController',
                controllerAs: "ConsolPackingModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "currentShipment": ShipmentConsolePackingCtrl.currentShipment,
                            "currentFormView": item,
                            "action": action,
                            "index": index
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.index != undefined) {
                        ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIJobPackLines[response.data.Index] = response.data;
                        GetPackingDetails()
                    } else {
                        ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(response.data)
                        GetPackingDetails()
                    }
                }
            );
        }

        function sum() {
            var _PackageCount = 0, _ActualWeight = 0, _ActualVolume = 0;
            ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.OutPackageSum = [];
            if (ShipmentConsolePackingCtrl.ePage.Masters.Package.GridData.length > 0) {
                ShipmentConsolePackingCtrl.ePage.Masters.Package.GridData.map(function (Value, Key) {
                    if (Value.FreightMode == 'OUT') {
                        _PackageCount = _PackageCount + parseInt(Value.PackageCount)
                    }
                    if (Value.FreightMode == 'OUT') {
                        _ActualWeight = (parseFloat(_ActualWeight) + parseFloat(Value.ActualWeight)).toFixed(3);
                    }
                    if (Value.FreightMode == 'OUT') {
                        _ActualVolume = (parseFloat(_ActualVolume) + parseFloat(Value.ActualVolume)).toFixed(3);
                    }
                    ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].PackageCount = _PackageCount;
                    ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualWeight = _ActualWeight;
                    ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualVolume = _ActualVolume;
                    ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].InnerPackType = ShipmentConsolePackingCtrl.ePage.Masters.Package.GridData[0].F3_NKPackType;
                    ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].UnitOfWeight = ShipmentConsolePackingCtrl.ePage.Masters.Package.GridData[0].ActualWeightUQ;
                    ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].UnitOfVolume = ShipmentConsolePackingCtrl.ePage.Masters.Package.GridData[0].ActualVolumeUQ;
                    ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].IsLength = ShipmentConsolePackingCtrl.ePage.Masters.Package.GridData.length;
                });
            } else {
                ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.OutPackageSum = [{
                    "PackageCount": 0,
                    "ActualWeight": 0,
                    "ActualVolume": 0,
                    "IsLength": 0
                }];
            }
        }

        function PackageDeleteConfirmation($item, index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeletePacking($item, index);
                }, function () {
                    console.log("Cancelled");
                });
        }
        //Delete For Package
        function DeletePacking($item, index) {
            if (index !== -1) {
                apiService.get("eAxisAPI", appConfig.Entities.JobPackLines.API.Delete.Url + $item.PK).then(function (response) {
                    if (response.data.Response) {
                        ShipmentConsolePackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(index, 1);
                        GetPackingDetails();
                    }
                });
            }
        }
        // =======================Packing End=======================
        Init();
    }
})();