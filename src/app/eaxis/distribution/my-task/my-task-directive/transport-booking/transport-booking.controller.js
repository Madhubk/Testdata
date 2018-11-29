(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransportBookingDirectiveController", TransportBookingDirectiveController);

    TransportBookingDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function TransportBookingDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var TransportBookingCtrl = this;

        function Init() {
            TransportBookingCtrl.ePage = {
                "Title": "",
                "Prefix": "Transport_Booking",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TransportBookingCtrl.ePage.Masters.MyTask = TransportBookingCtrl.taskObj;
            getManifestDetails();
        }

        function getManifestDetails() {
            var _filter = {
                "PK": TransportBookingCtrl.ePage.Masters.MyTask.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TmsManifestList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TransportBookingCtrl.ePage.Masters.ManifestDetails = response.data.Response[0];
                }
            });
        }

        Init();
    }
})();
