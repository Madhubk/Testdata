(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LoadItemsController", LoadItemsController);

    LoadItemsController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http", "$filter"];

    function LoadItemsController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http, $filter) {

        var LoadItemsCtrl = this;

        function Init() {

            var currentManifest = LoadItemsCtrl.currentManifest[LoadItemsCtrl.currentManifest.label].ePage.Entities;

            LoadItemsCtrl.ePage = {
                "Title": "",
                "Prefix": "Load_Items",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            LoadItemsCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(LoadItemsCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: LoadItemsCtrl.jobfk })

            if (LoadItemsCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                LoadItemsCtrl.ePage.Masters.MenuList = LoadItemsCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                LoadItemsCtrl.ePage.Masters.MenuList = LoadItemsCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            var res = LoadItemsCtrl.ePage.Masters.MenuList[LoadItemsCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].DisplayName.split(" ");
            if (res[1] == "Pickup") {
                LoadItemsCtrl.ePage.Masters.IsPickup = true;
            }
            else if (res[1] == "Delivery") {
                LoadItemsCtrl.ePage.Masters.IsDelivery = true;
            }

            LoadItemsCtrl.ePage.Masters.Empty = "-";
            LoadItemsCtrl.ePage.Masters.Config = dmsManifestConfig;

            LoadItemsCtrl.ePage.Masters.UpdateLoadedDateTime = UpdateLoadedDateTime;

            // DatePicker
            LoadItemsCtrl.ePage.Masters.DatePicker = {};
            LoadItemsCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            LoadItemsCtrl.ePage.Masters.DatePicker.isOpen = [];
            LoadItemsCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

        }

        $scope.filter1 = function (x) {
            if (!x.LoadedDateTime) {
                return true;
            } else {
                return;
            }
        };

        $scope.filter2 = function (x) {
            if (x.LoadedDateTime) {
                return true;
            } else {
                return;
            }
        };

        function UpdateLoadedDateTime(item) {
            angular.forEach(LoadItemsCtrl.ePage.Entities.Header.Data.TmsManifestItem, function (value, key) {
                if (value.TIT_ItemCode == item) {
                    value.LoadedDateTime = new Date();
                    if (!value.Quantity)
                        value.Quantity = 1;
                    else
                        value.Quantity = value.Quantity;
                    //LoadItemsCtrl.ePage.Entities.Header.Data.TmsManifestItem = moveElementInArray(LoadItemsCtrl.ePage.Entities.Header.Data.TmsManifestItem, value, -key);
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

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            LoadItemsCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        Init();
    }

})();