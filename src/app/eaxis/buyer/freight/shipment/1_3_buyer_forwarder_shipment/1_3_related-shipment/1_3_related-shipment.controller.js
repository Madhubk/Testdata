(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreeRelatedShipmentController", oneThreeRelatedShipmentController);

        oneThreeRelatedShipmentController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "three_shipmentConfig", "helperService", "toastr", "confirmation"];

    function oneThreeRelatedShipmentController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, three_shipmentConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var oneThreeRelatedShipmentCtrl = this;
        function Init() {
            var currentShipment = oneThreeRelatedShipmentCtrl.currentShipment[oneThreeRelatedShipmentCtrl.currentShipment.label].ePage.Entities;
            oneThreeRelatedShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_RelatedShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };
            oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment = {};
            oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment.IsSelected = false;

            oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment.gridConfig = oneThreeRelatedShipmentCtrl.ePage.Entities.RelatedShipment.Grid.GridConfig;
            oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment.gridConfig.columnDef = oneThreeRelatedShipmentCtrl.ePage.Entities.RelatedShipment.Grid.ColumnDef;

            oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment.DeleteRelatedShipment = DeleteRelatedShipment;
            oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment.DeleteConfirmation = DeleteConfirmation;
            oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment.SelectedGridRow = SelectedGridRow;
            oneThreeRelatedShipmentCtrl.ePage.Masters.GetRelatedShipmentDetails = GetRelatedShipmentDetails;
            oneThreeRelatedShipmentCtrl.ePage.Masters.GridRefreshFun = GridRefreshFun;
            oneThreeRelatedShipmentCtrl.ePage.Masters.SelectedData = SelectedData;

            if (!oneThreeRelatedShipmentCtrl.currentShipment.isNew) {
                GetRelatedShipmentList();
            } else {
                oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment.GridData = [];
            }
        }

        function GetRelatedShipmentList() {
            var _filter = {
                "RelatedShipment_FK": oneThreeRelatedShipmentCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ShipmentHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    oneThreeRelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments = response.data.Response;

                    GetRelatedShipmentDetails();
                }
            });
        }

        function GetRelatedShipmentDetails() {
            var _gridData = [];
            oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment.GridData = undefined;
            $timeout(function () {
                if (oneThreeRelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.length > 0) {
                    oneThreeRelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("RelatedShipment List is Empty");
                }

                oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment.GridData = _gridData;
            });
        }

        function GridRefreshFun($item) {
            var _tempArray = [];
            $item.map(function (val, key) {
                var _isExist = oneThreeRelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.some(function (value, index) {
                    return value.PK === val.PK;
                });
                if (!_isExist) {
                    var _tempObj = {
                        "EntityRefPK": val.PK,
                        "Properties": [{
                            "PropertyName": "SHP_RelatedShipment_FK",
                            "PropertyNewValue": oneThreeRelatedShipmentCtrl.ePage.Entities.Header.Data.PK
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
            apiService.post("eAxisAPI", oneThreeRelatedShipmentCtrl.ePage.Entities.RelatedShipment.API.ShipmentAttach.Url, _tempArray).then(function (response) {
                if (response.data.Response) {
                    GetRelatedShipmentList();
                }
            });
            // var _isExist = oneThreeRelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.some(function (value, index) {
            //     return value.PK === $item.data.PK;
            // });

            // if (!_isExist) {
            //     if ($item.data.PK !== oneThreeRelatedShipmentCtrl.ePage.Entities.Header.Data.PK) {
            //         oneThreeRelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.push($item.data);

            //         oneThreeRelatedShipmentCtrl.ePage.Masters[$item.functionName]();
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

            var _index = oneThreeRelatedShipmentCtrl.ePage.Entities.Header.Data.UIRelatedShipments.map(function (value, key) {
                return value.PK;
            }).indexOf($item.PK);
            var _input = [{
                "EntityRefPK": $item.PK,
                "Properties": [{
                    "PropertyName": "SHP_RelatedShipment_FK",
                    "PropertyNewValue": '00000000-0000-0000-0000-000000000000'
                }]
            }]
            apiService.post("eAxisAPI", oneThreeRelatedShipmentCtrl.ePage.Entities.RelatedShipment.API.ShipmentAttach.Url, _input).then(function (response) {
                if (response.data.Response) {
                    oneThreeRelatedShipmentCtrl.ePage.Masters.RelatedShipment.GridData.splice(_index, 1);
                }
            });
        }

        Init();
    }
})();
