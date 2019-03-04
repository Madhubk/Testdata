(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeOneConsolShipmentController", ThreeOneConsolShipmentController);

    ThreeOneConsolShipmentController.$inject = ["$rootScope", "$timeout", "apiService", "appConfig", "helperService", "toastr", "confirmation"];

    function ThreeOneConsolShipmentController($rootScope, $timeout, apiService, appConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var ThreeOneConsolShipmentCtrl = this;

        function Init() {
            var currentConsol = ThreeOneConsolShipmentCtrl.currentConsol[ThreeOneConsolShipmentCtrl.currentConsol.label].ePage.Entities;
            ThreeOneConsolShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };

            ThreeOneConsolShipmentCtrl.ePage.Masters.ConsolShipment = {};
            ThreeOneConsolShipmentCtrl.ePage.Masters.DeleteShipment = DeleteShipment;
            ThreeOneConsolShipmentCtrl.ePage.Masters.ShipmentDeleteConfirmation = ShipmentDeleteConfirmation;
            ThreeOneConsolShipmentCtrl.ePage.Masters.GetShipmentDetails = GetShipmentDetails;
            ThreeOneConsolShipmentCtrl.ePage.Masters.GridRefreshFun = GridRefreshFun;
            ThreeOneConsolShipmentCtrl.ePage.Masters.SelectedData = SelectedShipmentData;
            ThreeOneConsolShipmentCtrl.ePage.Masters.packlist = {
                "PackCount": 0,
                "Weight": 0,
                "Volume": 0,
                "Chargeable": 0
            };
            if (!ThreeOneConsolShipmentCtrl.currentConsol.isNew) {
                GetShipmentListing();
            } else {
                ThreeOneConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData = [];
            }

        }

        function GetShipmentListing() {
            var _filter = {
                "CON_FK": ThreeOneConsolShipmentCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.BuyerConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length == 0) {
                        ThreeOneConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData = [];
                        ThreeOneConsolShipmentCtrl.ePage.Masters.packlist = {
                            "PackCount": 0,
                            "Weight": 0,
                            "Volume": 0,
                            "Chargeable": 0
                        };
                    } else {
                        ThreeOneConsolShipmentCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
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
                "FilterID": appConfig.Entities.BuyerShipmentHeader.API.FindAll.FilterID
            };
            if (dynamicFindAllInput.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.BuyerShipmentHeader.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ThreeOneConsolShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeaders = response.data.Response;
                        GetShipmentDetails();
                    }
                });
            } else {
                GetShipmentDetails();
            }

        }

        function GetShipmentDetails() {
            ThreeOneConsolShipmentCtrl.ePage.Masters.packlist = {
                "PackCount": 0,
                "Weight": 0,
                "Volume": 0,
                "Chargeable": 0
            };
            var _gridData = [];
            ThreeOneConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData = undefined;
            $timeout(function () {
                if (ThreeOneConsolShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeaders.length > 0) {
                    ThreeOneConsolShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeaders.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    ThreeOneConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData = [];
                    console.log("ThreeOneConsolShipment List is Empty");
                }

                ThreeOneConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData = _gridData;
                ThreeOneConsolShipmentCtrl.ePage.Masters.ConsolShipment.FormView = {};
                if (ThreeOneConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData.length > 0) {
                    ThreeOneConsolShipmentCtrl.ePage.Masters.ConsolShipment.GridData.map(function (value, key) {
                        ThreeOneConsolShipmentCtrl.ePage.Masters.packlist.PackCount = (parseInt(ThreeOneConsolShipmentCtrl.ePage.Masters.packlist.PackCount) + parseInt(value.InnerPackCount));
                        ThreeOneConsolShipmentCtrl.ePage.Masters.packlist.Weight = (parseFloat(ThreeOneConsolShipmentCtrl.ePage.Masters.packlist.Weight) + parseFloat(value.Weight)).toFixed(3);
                        ThreeOneConsolShipmentCtrl.ePage.Masters.packlist.Volume = (parseFloat(ThreeOneConsolShipmentCtrl.ePage.Masters.packlist.Volume) + parseFloat(value.Volume)).toFixed(3);
                        ThreeOneConsolShipmentCtrl.ePage.Masters.packlist.Chargeable = (parseFloat(ThreeOneConsolShipmentCtrl.ePage.Masters.packlist.Chargeable) + parseFloat(value.Chargeable)).toFixed(3);
                    });
                }
            });
        }

        function GridRefreshFun($item) {
            var _tempArray = [];
            $item.map(function (val, key) {
                var _isExist = ThreeOneConsolShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeaders.some(function (value, index) {
                    return value.PK === val.PK;
                });


                if (!_isExist) {
                    var _tempObj = {
                        "SHP_FK": val.PK,
                        "CON_FK": ThreeOneConsolShipmentCtrl.ePage.Entities.Header.Data.PK,
                        "PK": ""
                    };
                    _tempArray.push(_tempObj)
                } else {
                    toastr.warning(val.ShipmentNo + " Already Available...!");
                }
            });
            if (_tempArray.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.BuyerConShpMapping.API.Insert.Url, _tempArray).then(function (response) {
                    if (response.data.Response) {
                        GetShipmentListing();
                    }
                });
            }
        }

        function SelectedShipmentData($item) {
            if ($item[0].TransportMode == ThreeOneConsolShipmentCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode)
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
            var _index = ThreeOneConsolShipmentCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
                return value.SHP_FK;
            }).indexOf($item.PK);
            if (_index !== -1) {
                apiService.get("eAxisAPI", appConfig.Entities.BuyerConShpMapping.API.Delete.Url + ThreeOneConsolShipmentCtrl.ePage.Entities.Header.Data.UIConShpMappings[_index].PK).then(function (response) {
                    if (response.data.Response) {
                        GetShipmentListing();
                        toastr.success($item.ShipmentNo + " Detached Successfully...!");
                    }
                });
            }
        }
        Init();
    }
})();