(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolShipmentController", ConsolShipmentController);

    ConsolShipmentController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "confirmation"];

    function ConsolShipmentController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var ConsolShipmentCtrl = this;

        function Init() {
            var currentConsol = ConsolShipmentCtrl.currentConsol[ConsolShipmentCtrl.currentConsol.label].ePage.Entities;
            ConsolShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };
            ConsolShipmentCtrl.ePage.Masters.ConsolShipment = {}
            ConsolShipmentCtrl.ePage.Masters.DeleteShipment = DeleteShipment;
            ConsolShipmentCtrl.ePage.Masters.ShipmentDeleteConfirmation = ShipmentDeleteConfirmation;
            ConsolShipmentCtrl.ePage.Masters.GetShipmentDetails = GetShipmentDetails;
            ConsolShipmentCtrl.ePage.Masters.GridRefreshFun = GridRefreshFun;
            ConsolShipmentCtrl.ePage.Masters.SelectedData = SelectedShipmentData;
            ConsolShipmentCtrl.ePage.Masters.GetNewShipment = GetNewShipment;
            ConsolShipmentCtrl.ePage.Masters.packlist = {
                "PackCount": 0,
                "Weight": 0,
                "Volume": 0,
                "Chargeable": 0
            };
            if (!ConsolShipmentCtrl.currentConsol.isNew) {
                GetShipmentListing();
            } else {
                ConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData = [];
            }

        }

        function GetShipmentListing() {
            var _filter = {
                "CON_FK": ConsolShipmentCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsolShipmentCtrl.ePage.Entities.ConsolShipment.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", ConsolShipmentCtrl.ePage.Entities.ConsolShipment.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length == 0) {
                        ConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData = [];
                        ConsolShipmentCtrl.ePage.Masters.packlist = {
                            "PackCount": 0,
                            "Weight": 0,
                            "Volume": 0,
                            "Chargeable": 0
                        };
                    }
                    else {
                        ConsolShipmentCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                        $rootScope.GetRotingList();
                        var shpFkList = response.data.Response;
                        GetRelatedShipmentDetails(shpFkList);
                    }
                }
            });
        }

        function GetRelatedShipmentDetails(shpFkList) {
            var dynamicFindAllInput = [];

            shpFkList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "SHP_PKS",
                    "value": value.SHP_FK
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": ConsolShipmentCtrl.ePage.Entities.ConsolShipment.API.GetShipment.FilterID
            };
            if (dynamicFindAllInput.length > 0) {
                apiService.post("eAxisAPI", ConsolShipmentCtrl.ePage.Entities.ConsolShipment.API.GetShipment.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ConsolShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeaders = response.data.Response;
                        GetShipmentDetails();
                    }
                });
            } else {
                GetShipmentDetails();
            }

        }

        function GetShipmentDetails() {
            ConsolShipmentCtrl.ePage.Masters.packlist = {
                "PackCount": 0,
                "Weight": 0,
                "Volume": 0,
                "Chargeable": 0
            };
            var _gridData = [];
            ConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData = undefined;
            $timeout(function () {
                if (ConsolShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeaders.length > 0) {
                    ConsolShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeaders.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    ConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData = [];
                    console.log("ConsolShipment List is Empty");
                }

                ConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData = _gridData;
                ConsolShipmentCtrl.ePage.Masters.ConsolShipment.FormView = {};
                if (ConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData.length > 0) {
                    ConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData.map(function (value, key) {
                        ConsolShipmentCtrl.ePage.Masters.packlist.PackCount = (parseInt(ConsolShipmentCtrl.ePage.Masters.packlist.PackCount) + parseInt(value.InnerPackCount));
                        ConsolShipmentCtrl.ePage.Masters.packlist.Weight = (parseFloat(ConsolShipmentCtrl.ePage.Masters.packlist.Weight) + parseFloat(value.Weight)).toFixed(3);
                        ConsolShipmentCtrl.ePage.Masters.packlist.Volume = (parseFloat(ConsolShipmentCtrl.ePage.Masters.packlist.Volume) + parseFloat(value.Volume)).toFixed(3);
                        ConsolShipmentCtrl.ePage.Masters.packlist.Chargeable = (parseFloat(ConsolShipmentCtrl.ePage.Masters.packlist.Chargeable) + parseFloat(value.Chargeable)).toFixed(3);
                    });
                }
            });
        }

        function GridRefreshFun($item) {
            var _tempArray = [];
            $item.map(function (val, key) {
                var _isExist = ConsolShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeaders.some(function (value, index) {
                    return value.PK === val.PK;
                });

                if (!_isExist) {
                    var _tempObj = {
                        "SHP_FK": val.PK,
                        "CON_FK": ConsolShipmentCtrl.ePage.Entities.Header.Data.PK,
                        "PK": ""
                    };
                    _tempArray.push(_tempObj)
                } else {
                    toastr.warning(val.ShipmentNo + " Already Available...!");
                }
            });
            if (_tempArray.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.Insert.Url, _tempArray).then(function (response) {
                    if (response.data.Response) {
                        GetShipmentListing();
                    }
                });
            }
        }

        function SelectedShipmentData($item) {
            if ($item[0].TransportMode == ConsolShipmentCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode)
                GridRefreshFun($item);
            else
                toastr.error("Consol & shipment Transport must be same!")

        }

        function ShipmentDeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteShipment($item);

                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteShipment($item) {
            var _index = ConsolShipmentCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
                return value.SHP_FK;
            }).indexOf($item.PK);
            if (_index !== -1) {
                apiService.get("eAxisAPI", appConfig.Entities.ConShpMapping.API.Delete.Url + ConsolShipmentCtrl.ePage.Entities.Header.Data.UIConShpMappings[_index].PK).then(function (response) {
                    if (response.data.Response) {
                        GetShipmentListing();
                        toastr.success($item.ShipmentNo + " Detached Successfully...!");
                    }
                });
            }
        }

        function GetNewShipment() {
            helperService.getFullObjectUsingGetById(appConfig.Entities.ShipmentList.API.GetById.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        keyboard: false,
                        windowClass: "Concontainer right",
                        scope: $scope,
                        // size : "sm",
                        templateUrl: "app/eaxis/freight/consolidation/consol-new-shipment/consol-new-shipment.html",
                        controller: 'ConsolcreateshipmentModalController',
                        controllerAs: "ConsolcreateshipmentModalCtrl",
                        bindToController: true,
                        resolve: {
                            param: function () {
                                var exports = {
                                    "newshipment": response.data.Response,
                                    "conpk": ConsolShipmentCtrl.ePage.Entities.Header.Data.UIConConsolHeader.PK
                                };
                                return exports;
                            }
                        }
                    }).result.then(
                        function (response) {
                            if (response) {
                                GetShipmentListing();
                            }
                        });
                }
            });
        }
        Init();
    }
})();