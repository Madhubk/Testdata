(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupDeliveryController", PickupDeliveryController);

    PickupDeliveryController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http", "$filter"];

    function PickupDeliveryController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http, $filter) {

        var PickupDeliveryCtrl = this;

        function Init() {

            var currentManifest = PickupDeliveryCtrl.currentManifest[PickupDeliveryCtrl.currentManifest.label].ePage.Entities;

            PickupDeliveryCtrl.ePage = {
                "Title": "",
                "Prefix": "Approve Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            if (PickupDeliveryCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                PickupDeliveryCtrl.ePage.Entities.Header.Data.MenuList = PickupDeliveryCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                PickupDeliveryCtrl.ePage.Entities.Header.Data.MenuList = PickupDeliveryCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            PickupDeliveryCtrl.ePage.Masters.StandardMenuConfig = StandardMenuConfig;
            // DatePicker
            PickupDeliveryCtrl.ePage.Masters.DatePicker = {};
            PickupDeliveryCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PickupDeliveryCtrl.ePage.Masters.DatePicker.isOpen = [];
            PickupDeliveryCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            PickupDeliveryCtrl.ePage.Masters.Empty = "-";
            PickupDeliveryCtrl.ePage.Masters.Config = dmsManifestConfig;
            PickupDeliveryCtrl.ePage.Masters.DocumentInput = [];

            var res = PickupDeliveryCtrl.menuvalue.split(" ");
            if (res[1] == "Pickup" || res[1] == "Vehicle" || res[2] == "Dispatch") {
                PickupDeliveryCtrl.ePage.Entities.Header.CheckPoints.IsPickup = true;
                PickupDeliveryCtrl.ePage.Entities.Header.CheckPoints.IsDelivery = false;
            } else if (res[1] == "Delivery" || res[1] == "Upload" || res[2] == "Delivery") {
                PickupDeliveryCtrl.ePage.Entities.Header.CheckPoints.IsDelivery = true;
                PickupDeliveryCtrl.ePage.Entities.Header.CheckPoints.IsPickup = false;
            }
            PickupDeliveryCtrl.ePage.Entities.Header.Data.ManifestConsignment = $filter('filter')(PickupDeliveryCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, { TMC_Receiver_ORG_FK: PickupDeliveryCtrl.orgfk })
        }

        function StandardMenuConfig(value, index) {
            PickupDeliveryCtrl.ePage.Masters.DocumentInput[index] = {
                // Entity
                "ParentEntityRefKey": value.TMC_FK,
                "ParentEntityRefCode": value.TMC_ConsignmentNumber,
                "ParentEntitySource": "TMC",
                // Parent Entity
                "EntityRefKey": PickupDeliveryCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
                "EntityRefCode": PickupDeliveryCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber,
                "EntitySource": "TMM",
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": undefined,
                "Config": undefined,
                "Entity": "TransportsManifest"
            };
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            PickupDeliveryCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        Init();
    }

})();