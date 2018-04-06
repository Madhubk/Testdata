(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReceiveItemsController", ReceiveItemsController);

    ReceiveItemsController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "manifestConfig", "helperService", "$window", "$uibModal"];

    function ReceiveItemsController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, manifestConfig, helperService, $window, $uibModal) {

        var ReceiveItemsCtrl = this;

        function Init() {

            var currentManifest = ReceiveItemsCtrl.currentManifest[ReceiveItemsCtrl.currentManifest.label].ePage.Entities;

            ReceiveItemsCtrl.ePage = {
                "Title": "",
                "Prefix": "Receive_Items",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };
            // DatePicker
            ReceiveItemsCtrl.ePage.Masters.DatePicker = {};
            ReceiveItemsCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ReceiveItemsCtrl.ePage.Masters.DatePicker.isOpen = [];
            ReceiveItemsCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ReceiveItemsCtrl.ePage.Masters.Config = manifestConfig;

            ReceiveItemsCtrl.ePage.Masters.UpdateReceivedDateTime = UpdateReceivedDateTime;

        }

         function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ReceiveItemsCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function UpdateReceivedDateTime(item) {
            angular.forEach(ReceiveItemsCtrl.ePage.Entities.Header.Data.TmsManifestItem, function (value, key) {
                if (value.TIT_ItemCode == item) {
                    ReceiveItemsCtrl.ePage.Entities.Header.Data.TmsManifestItem = moveElementInArray(ReceiveItemsCtrl.ePage.Entities.Header.Data.TmsManifestItem, value, -key);
                    value.DeliveryDateTime = new Date();
                    value.Quantity = 1;
                }
            });
        }

        function moveElementInArray(array, value, positionChange) {
            var oldIndex = array.indexOf(value);
            if (oldIndex > -1) {
                var newIndex = (oldIndex + positionChange);

                if (newIndex < 0) {
                    newIndex = 0
                } else if (newIndex >= array.length) {
                    newIndex = array.length
                }

                var arrayClone = array.slice();
                arrayClone.splice(oldIndex, 1);
                arrayClone.splice(newIndex, 0, value);

                return arrayClone
            }
            return array
        }

        Init();
    }

})();