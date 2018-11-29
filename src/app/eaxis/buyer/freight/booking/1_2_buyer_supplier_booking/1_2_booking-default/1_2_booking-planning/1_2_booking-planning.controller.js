(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bkgBuyerSupplierPlanningController", bkgBuyerSupplierPlanningController);

    bkgBuyerSupplierPlanningController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "three_BookingConfig", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal"];

    function bkgBuyerSupplierPlanningController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, three_BookingConfig, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal) {
        /* jshint validthis: true */
        var bkgBuyerSupplierPlanningCtrl = this;

        function Init() {
            var currentBooking;
            (bkgBuyerSupplierPlanningCtrl.currentBooking) ? currentBooking = bkgBuyerSupplierPlanningCtrl.currentBooking[bkgBuyerSupplierPlanningCtrl.currentBooking.label].ePage.Entities: currentBooking = bkgBuyerSupplierPlanningCtrl.obj[bkgBuyerSupplierPlanningCtrl.obj.label].ePage.Entities;
            bkgBuyerSupplierPlanningCtrl.currentBooking = currentBooking;
            bkgBuyerSupplierPlanningCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
            StandardMenuConfig()
            // DatePicker
            bkgBuyerSupplierPlanningCtrl.ePage.Masters.DatePicker = {};
            bkgBuyerSupplierPlanningCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            bkgBuyerSupplierPlanningCtrl.ePage.Masters.DatePicker.isOpen = [];
            bkgBuyerSupplierPlanningCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            bkgBuyerSupplierPlanningCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }



        function StandardMenuConfig() {
            bkgBuyerSupplierPlanningCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": bkgBuyerSupplierPlanningCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": bkgBuyerSupplierPlanningCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                "EntitySource": "SHP",
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
            bkgBuyerSupplierPlanningCtrl.ePage.Masters.ContainerHeader = {
                "HeaderProperties": [{
                        "columnname": "Container Count",
                        "isenabled": true,
                        "property": "containercount",
                        "position": "1",
                        "width": "300",
                        "display": false
                    },
                    {
                        "columnname": "Container Type",
                        "isenabled": true,
                        "property": "containertype",
                        "position": "2",
                        "width": "300",
                        "display": false
                    },
                    {
                        "columnname": "Commodity",
                        "isenabled": true,
                        "property": "Commodity",
                        "position": "3",
                        "width": "300",
                        "display": false
                    }
                ],
                "containercount": {
                    "isenabled": true,
                    "position": "1",
                    "width": "300"
                },
                "containertype": {
                    "isenabled": true,
                    "position": "2",
                    "width": "300"
                },
                "Commodity": {
                    "isenabled": true,
                    "position": "3",
                    "width": "300"
                }
            };
           
        }



        Init();
    }
})();