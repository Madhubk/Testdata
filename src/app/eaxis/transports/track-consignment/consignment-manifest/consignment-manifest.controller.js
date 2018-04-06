(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentManifestController", ConsignmentManifestController);

    ConsignmentManifestController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "consignmentConfig", "helperService", "toastr", "$injector", "$window", "confirmation"];

    function ConsignmentManifestController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, consignmentConfig, helperService, toastr, $injector, $window, confirmation) {

        var ConsignmentManifestCtrl = this;

        function Init() {
            var currentConsignment = ConsignmentManifestCtrl.currentConsignment[ConsignmentManifestCtrl.currentConsignment.label].ePage.Entities;

            ConsignmentManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment,
            };

            ConsignmentManifestCtrl.ePage.Masters.Config = consignmentConfig;

            ConsignmentManifestCtrl.ePage.Masters.emptyText = "-";
            ConsignmentManifestCtrl.ePage.Masters.selectedRow = -1;

            ConsignmentManifestCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ConsignmentManifestCtrl.ePage.Masters.Edit = Edit;
            // ConsignmentManifestCtrl.ePage.Masters.RemoveRow = RemoveRow;
            // ConsignmentManifestCtrl.ePage.Masters.Attach = Attach;
            ConsignmentManifestCtrl.ePage.Masters.AddNew = AddNew;
        }

        function setSelectedRow(index) {
            ConsignmentManifestCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNew() {
            var _queryString = {
                PK: null,
                ManifestNumber: null
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/manifest/" + _queryString, "_blank");
        }

        // function Attach($item) {
        //     $item.some(function (value, index) {
        //         var _isExist = ConsignmentManifestCtrl.ePage.Entities.Header.Data.TmsConsignmentManifest.some(function (value1, index1) {
        //             return value1.PK === value.PK;
        //         });
        //         if (!_isExist) {
        //             var obj = {
        //                 "TMM_FK": value.PK,
        //                 "TMM_ManifestNumber": value.ManifestNumber,
        //                 "TMM_ManifestType": value.ManifestType,
        //                 "TMM_ManifestStatus": value.ManifestStatus,
        //                 "TMM_ManifestUTC": value.ManifestUTC,
        //                 "TMM_Sender_ORG_FK": value.Sender_ORG_FK,
        //                 "TMM_Receiver_ORG_FK": value.Receiver_ORG_FK,
        //                 "TMM_TotalWeight": value.TotalWeight,
        //                 "TMM_TotalVolume": value.TotalVolume,
        //                 "TMM_Quantity": value.Quantity,
        //                 "TMM_TotalAmount": value.TotalAmount,
        //                 "TMM_VehicleNo": value.VehicleNo,
        //                 "TMM_VehicleType": value.VehicleType,
        //                 "TMM_DriveName": value.TMM_DriveName,
        //                 "TMM_DriverContactNo": value.TMM_DriverContactNo,
        //                 "TMM_SealNo": value.TMM_SealNo,
        //                 "TMM_ShipmentNo": value.TMM_ShipmentNo,
        //                 "TMM_ConsolNo": value.ConsolNo,
        //                 "TMM_VesselName": value.VesselName,
        //                 "TMM_ShipmentArrivalDate": value.ShipmentArrivalDate,
        //                 "TMM_EstimatedDispatchDate": value.EstimatedDispatchDate,
        //                 "TMM_ActualDispatchDate": value.ActualDispatchDate,
        //                 "TMM_EstimatedDeliveryDate": value.EstimatedDeliveryDate,
        //                 "TMM_ActualDeliveryDate": value.ActualDeliveryDate,
        //                 "IsDeleted": value.IsDeleted,
        //                 "IsModified": value.IsModified
        //             }
        //             ConsignmentManifestCtrl.ePage.Entities.Header.Data.TmsConsignmentManifest.push(obj);
        //         } else {
        //             toastr.warning(value.ManifestNumber + " Already Available...!");
        //         }
        //     });
        // }

        function Edit(obj) {
            var _queryString = {
                PK: obj.PK,
                ManifestNumber: obj.ManifestNumber
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/manifest/" + _queryString, "_blank");
        }

        // function RemoveRow() {
        //     var item = ConsignmentManifestCtrl.ePage.Entities.Header.Data.TmsConsignmentManifest[ConsignmentManifestCtrl.ePage.Masters.selectedRow]
        //     var modalOptions = {
        //         closeButtonText: 'Cancel',
        //         actionButtonText: 'Ok',
        //         headerText: 'Delete?',
        //         bodyText: 'Are you sure?'
        //     };
        //     confirmation.showModal({}, modalOptions)
        //         .then(function (result) {
        //             // if (item.PK) {
        //             //     apiService.get("eAxisAPI", ConsignmentManifestCtrl.ePage.Entities.Header.API.LineDelete.Url + item.PK).then(function(response) {
        //             //     });
        //             // }
        //             ConsignmentManifestCtrl.ePage.Entities.Header.Data.TmsConsignmentManifest.splice(ConsignmentManifestCtrl.ePage.Masters.selectedRow, 1);
        //             toastr.success('Record Removed Successfully');
        //             ConsignmentManifestCtrl.ePage.Masters.selectedRow = ConsignmentManifestCtrl.ePage.Masters.selectedRow - 1;
        //         }, function () {
        //             console.log("Cancelled");
        //         });
        // }

        Init();
    }

})();