(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackingStatusController", TrackingStatusController);

    TrackingStatusController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http", "$filter"];

    function TrackingStatusController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http, $filter) {

        var TrackingStatusCtrl = this;

        function Init() {

            var currentManifest = TrackingStatusCtrl.currentManifest[TrackingStatusCtrl.currentManifest.label].ePage.Entities;

            TrackingStatusCtrl.ePage = {
                "Title": "",
                "Prefix": "Tracking_Status",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };
            TrackingStatusCtrl.ePage.Masters.Empty = "-";
            TrackingStatusCtrl.ePage.Masters.CarrierReference = [];
            GetCarrierReference();
        }
        function GetCarrierReference() {
            // Take Distinct from Carrier Reference
            TrackingStatusCtrl.ePage.Masters.DistinctCarrierRef = $filter('unique')(TrackingStatusCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, 'TMC_ReceiverRef');

            // Taking Distinct Reference Number from consignment for input
            angular.forEach(TrackingStatusCtrl.ePage.Masters.DistinctCarrierRef, function (value, key) {
                TrackingStatusCtrl.ePage.Masters.CarrierReference.push(value.TMC_ReceiverRef);
            });

            // comma seperator input
            TrackingStatusCtrl.ePage.Masters.InputReference = TrackingStatusCtrl.ePage.Masters.CarrierReference.join(",")

            GetStatusDetails();
        }

        function GetStatusDetails() {
            // if consignment has reference send input as consignment reference else send manifest reference
            if (TrackingStatusCtrl.ePage.Masters.InputReference) {
                var _filter = {
                    "TransportReferenceNo": TrackingStatusCtrl.ePage.Masters.InputReference
                };
            } else {
                var _filter = {
                    "TransportReferenceNo": TrackingStatusCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransportRefNo
                };
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": TrackingStatusCtrl.ePage.Entities.Header.API.TrackingStatusFindAll.FilterID
            };

            apiService.post("eAxisAPI", TrackingStatusCtrl.ePage.Entities.Header.API.TrackingStatusFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackingStatusCtrl.ePage.Masters.TrackingStatusDetails = response.data.Response;
                    var GroupedStatusDetails = $filter('groupBy')(TrackingStatusCtrl.ePage.Masters.TrackingStatusDetails, 'TransportReferenceNo');

                    // for taking last status of the carrier reference
                    angular.forEach(GroupedStatusDetails, function (value, key) {
                        GroupedStatusDetails[key] = $filter('orderBy')(value, '-Date');
                    });
                    TrackingStatusCtrl.ePage.Masters.GroupedStatusDetails = GroupedStatusDetails;
                }
            });
        }

        Init();
    }

})();