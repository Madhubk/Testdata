(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RelatedShipmentController", RelatedShipmentController);

    RelatedShipmentController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "shipmentConfig", "helperService", "toastr", "confirmation"];

    function RelatedShipmentController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, shipmentConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var RelatedShipmentCtrl = this;
        function Init() {
            var currentShipment = RelatedShipmentCtrl.currentShipment[RelatedShipmentCtrl.currentShipment.label].ePage.Entities;
            RelatedShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_RelatedShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };
            RelatedShipmentCtrl.ePage.Masters.RelatedShipment = {};
            RelatedShipmentCtrl.ePage.Masters.RelatedShipment.IsSelected = false;

            RelatedShipmentCtrl.ePage.Masters.RelatedShipment.gridConfig = RelatedShipmentCtrl.ePage.Entities.RelatedShipment.Grid.GridConfig;
            RelatedShipmentCtrl.ePage.Masters.RelatedShipment.gridConfig.columnDef = RelatedShipmentCtrl.ePage.Entities.RelatedShipment.Grid.ColumnDef;

            RelatedShipmentCtrl.ePage.Masters.RelatedShipment.DeleteRelatedShipment = DeleteRelatedShipment;
            RelatedShipmentCtrl.ePage.Masters.RelatedShipment.DeleteConfirmation = DeleteConfirmation;
            RelatedShipmentCtrl.ePage.Masters.RelatedShipment.SelectedGridRow = SelectedGridRow;
            RelatedShipmentCtrl.ePage.Masters.GetRelatedShipmentDetails = GetRelatedShipmentDetails;
            RelatedShipmentCtrl.ePage.Masters.GridRefreshFun = GridRefreshFun;
            RelatedShipmentCtrl.ePage.Masters.SelectedData = SelectedData;

            if (!RelatedShipmentCtrl.currentShipment.isNew) {
                GetRelatedShipmentList();
            } else {
                RelatedShipmentCtrl.ePage.Masters.RelatedShipment.GridData = [];
            }
        }

        function GetRelatedShipmentList() {
            var _filter = {
                "RelatedShipment_FK": RelatedShipmentCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ShipmentHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    RelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments = response.data.Response;

                    GetRelatedShipmentDetails();
                }
            });
        }

        function GetRelatedShipmentDetails() {
            var _gridData = [];
            RelatedShipmentCtrl.ePage.Masters.RelatedShipment.GridData = undefined;
            $timeout(function () {
                if (RelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.length > 0) {
                    RelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("RelatedShipment List is Empty");
                }

                RelatedShipmentCtrl.ePage.Masters.RelatedShipment.GridData = _gridData;
            });
        }

        function GridRefreshFun($item) {
            var _tempArray = [];
            $item.map(function (val, key) {
                var _isExist = RelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.some(function (value, index) {
                    return value.PK === val.PK;
                });
                if (!_isExist) {
                    var _tempObj = {
                        "EntityRefPK": val.PK,
                        "Properties": [{
                            "PropertyName": "SHP_RelatedShipment_FK",
                            "PropertyNewValue": RelatedShipmentCtrl.ePage.Entities.Header.Data.PK
                        }]
                    };
                    if (val.SHP_FK == null || val.SHP_FK == '') {
                        _tempArray.push(_tempObj)
                    } else {
                        toastr.warning(val.ShipmentNo + " Already attached another shipment...!");
                    }
                } else {
                    toastr.warning(val.ShipmentNo + " Already Available...!");
                }
            });
            apiService.post("eAxisAPI", RelatedShipmentCtrl.ePage.Entities.RelatedShipment.API.ShipmentAttach.Url, _tempArray).then(function (response) {
                if (response.data.Response) {
                    GetRelatedShipmentList();
                }
            });
            // var _isExist = RelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.some(function (value, index) {
            //     return value.PK === $item.data.PK;
            // });

            // if (!_isExist) {
            //     if ($item.data.PK !== RelatedShipmentCtrl.ePage.Entities.Header.Data.PK) {
            //         RelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.push($item.data);

            //         RelatedShipmentCtrl.ePage.Masters[$item.functionName]();
            //         toastr.success("Record Added Successfully...!");
            //     } else {
            //         toastr.warning("You cannot add the same opened shipment...!");
            //     }
            // } else {
            //     toastr.warning("Record Already Available...!");
            // }
        }

        function SelectedData($item) {
            GridRefreshFun($item)
        }

        function SelectedGridRow($item) {
            // body...
        }

        function DeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteRelatedShipment($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteRelatedShipment($item) {

            var _index = RelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.map(function (value, key) {
                return value.PK;
            }).indexOf($item.PK);
            var _input = [{
                "EntityRefPK": $item.PK,
                "Properties": [{
                    "PropertyName": "SHP_RelatedShipment_FK",
                    "PropertyNewValue": '00000000-0000-0000-0000-000000000000'
                }]
            }]
            apiService.post("eAxisAPI", RelatedShipmentCtrl.ePage.Entities.RelatedShipment.API.ShipmentAttach.Url, _input).then(function (response) {
                if (response.data.Response) {
                    RelatedShipmentCtrl.ePage.Masters.RelatedShipment.GridData.splice(_index, 1);
                }
            });
        }

        Init();
    }
})();
