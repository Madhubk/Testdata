(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreeShipmentConsoleAndPackingController", oneThreeShipmentConsoleAndPackingController);

    oneThreeShipmentConsoleAndPackingController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "APP_CONSTANT", "authService", "apiService", "appConfig", "three_shipmentConfig", "helperService", "toastr", "confirmation", "$uibModal"];

    function oneThreeShipmentConsoleAndPackingController($rootScope, $scope, $state, $timeout, $location, APP_CONSTANT, authService, apiService, appConfig, three_shipmentConfig, helperService, toastr, confirmation, $uibModal) {
        /* jshint validthis: true */
        var oneThreeShipmentConsoleAndPackingCtrl = this;

        function Init() {
            var currentShipment = oneThreeShipmentConsoleAndPackingCtrl.currentShipment[oneThreeShipmentConsoleAndPackingCtrl.currentShipment.label].ePage.Entities;
            oneThreeShipmentConsoleAndPackingCtrl.ePage = {
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

            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.DropDownMasterList = three_shipmentConfig.Entities.Header.Meta;

            InitConsole();
            InitPacking();
        }
        // ==========================Console Details Begin ====================================
        function InitConsole() {
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.ShipmentConsol.DeleteConsole = DeleteConsole;
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.ShipmentConsol.ConsoleDeleteConfirmation = ConsoleDeleteConfirmation;
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.SelectedGridRowConsol = SelectedGridRowConsol;
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.SelectedConsoleData = SelectedConsoleData;

            if (!oneThreeShipmentConsoleAndPackingCtrl.currentShipment.isNew) {
                GetConsolListing();
            } else {
                oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIConShpMappings = [];
            }
        }

        function GetConsolListing() {
            var _filter = {
                "SHP_FK": oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    GetContainerList(response.data.Response);
                    $rootScope.GetRotingList();
                }
            });
        }

        function GetContainerList(data) {
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            if (data.length > 0) {
                data.map(function (value1, key1) {
                    value1.UICntContainerList.map(function (value2, key2) {
                        var _isExist = oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
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
                            oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                        }
                    });
                });
            } else {
                oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            }
        }

        function SelectedConsoleData($item) {
            var _tempArray = [];

            $item.map(function (val, key) {
                var _isExist = oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIConShpMappings.some(function (value, index) {
                    return value.CON_FK === val.PK;
                });

                if (!_isExist) {
                    var _tempObj = {
                        "SHP_FK": oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.PK,
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
                    if (response.data.Response) {}
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
            var _index = oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
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
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.FormView = {};
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.FormView.JobDangerousGoods = [];
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.FormView.JobLocation = [];
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.AddNewPacking = AddNewPacking;
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.DeletePacking = DeletePacking;
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.PackageDeleteConfirmation = PackageDeleteConfirmation;
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.SelectedGridRow = SelectedGridRow;

            $rootScope.GetPackingDetails = GetPackingDetails;

            if (!oneThreeShipmentConsoleAndPackingCtrl.currentShipment.isNew) {
                // GetPackingList();
                oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.GridData = [];
            } else {
                oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.GridData = [];
            }

            sum();
        }

        function GetPackingList() {
            var _filter = {
                "SHP_FK": oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        var _isExist = oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                            return value1.PK === value.PK;
                        });

                        if (!_isExist) {
                            oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                        }
                    });

                    GetPackingDetails();
                }
            });
        }
        // Package Details     
        function GetPackingDetails() {
            var _gridData = [];
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.GridData = undefined;
            $timeout(function () {
                if (oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "OUT") {
                            value.Index = key;
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Package List is Empty");
                }
                oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.GridData = _gridData;
                oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.FormView = {};

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
                templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/tabs/packing-modal.html",
                controller: 'oneThreeConsolPackingModalController',
                controllerAs: "oneThreeConsolPackingModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "currentShipment": oneThreeShipmentConsoleAndPackingCtrl.currentShipment,
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
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIJobPackLines[response.data.Index] = response.data;
                        GetPackingDetails()
                    } else {
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(response.data)
                        GetPackingDetails()
                    }
                }
            );
        }

        function sum() {
            var _PackageCount = 0,
                _ActualWeight = 0,
                _ActualVolume = 0;
            oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum = [];
            if (oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.GridData.length > 0) {
                oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.GridData.map(function (Value, Key) {
                    if (Value.FreightMode == 'OUT') {
                        _PackageCount = _PackageCount + parseInt(Value.PackageCount)
                    }
                    if (Value.FreightMode == 'OUT') {
                        _ActualWeight = (parseFloat(_ActualWeight) + parseFloat(Value.ActualWeight)).toFixed(3);
                    }
                    if (Value.FreightMode == 'OUT') {
                        _ActualVolume = (parseFloat(_ActualVolume) + parseFloat(Value.ActualVolume)).toFixed(3);
                    }
                    if (oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum.length > 0) {
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].PackageCount = _PackageCount;
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualWeight = _ActualWeight;
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualVolume = _ActualVolume;
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].InnerPackType = oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.GridData[0].F3_NKPackType;
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].UnitOfWeight = oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.GridData[0].ActualWeightUQ;
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].UnitOfVolume = oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.GridData[0].ActualVolumeUQ;
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum[0].IsLength = oneThreeShipmentConsoleAndPackingCtrl.ePage.Masters.Package.GridData.length;
                    } else {
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum = [{
                            "PackageCount": 0,
                            "ActualWeight": 0,
                            "ActualVolume": 0,
                            "IsLength": 0
                        }];
                    }
                });
            } else {
                oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.OutPackageSum = [{
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
                        oneThreeShipmentConsoleAndPackingCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(index, 1);
                        GetPackingDetails();
                    }
                });
            }
        }
        // =======================Packing End=======================
        Init();
    }
})();