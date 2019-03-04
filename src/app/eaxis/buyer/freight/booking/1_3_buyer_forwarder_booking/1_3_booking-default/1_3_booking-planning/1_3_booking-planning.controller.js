(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bkgBuyerForwarderPlanningController", bkgBuyerForwarderPlanningController);

    bkgBuyerForwarderPlanningController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "three_BookingConfig", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal"];

    function bkgBuyerForwarderPlanningController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, three_BookingConfig, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal) {
        /* jshint validthis: true */
        var bkgBuyerForwarderPlanningCtrl = this;

        function Init() {
            var currentBooking;
            (bkgBuyerForwarderPlanningCtrl.currentBooking) ? currentBooking = bkgBuyerForwarderPlanningCtrl.currentBooking[bkgBuyerForwarderPlanningCtrl.currentBooking.label].ePage.Entities: currentBooking = bkgBuyerForwarderPlanningCtrl.obj[bkgBuyerForwarderPlanningCtrl.obj.label].ePage.Entities;
            bkgBuyerForwarderPlanningCtrl.currentBooking = currentBooking;
            bkgBuyerForwarderPlanningCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
            StandardMenuConfig()
            // DatePicker
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DatePicker = {};
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DatePicker.isOpen = [];
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }



        function StandardMenuConfig() {
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
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
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.ContainerHeader = {
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
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.RoutingHeader = {

                "HeaderProperties": [{
                        "columnname": "Checkbox",
                        "isenabled": false,
                        "property": "routingcheckbox",
                        "position": "1",
                        "width": "45",
                        "display": false
                    }, {
                        "columnname": "Job #",
                        "isenabled": false,
                        "property": "jobno",
                        "position": "2",
                        "width": "1600",
                        "display": false
                    },
                    {
                        "columnname": "Leg Order #",
                        "isenabled": false,
                        "property": "legorder",
                        "position": "3",
                        "width": "40",
                        "display": true
                    },
                    {
                        "columnname": "T.Mode",
                        "isenabled": true,
                        "property": "mode",
                        "position": "4",
                        "width": "160",
                        "display": true
                    },
                    {
                        "columnname": "Transport Type",
                        "isenabled": false,
                        "property": "transporttype",
                        "position": "5",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "Status",
                        "isenabled": false,
                        "property": "status",
                        "position": "6",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "Vessel",
                        "isenabled": true,
                        "property": "vessel",
                        "position": "7",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "Voyage/Flight",
                        "isenabled": true,
                        "property": "voyageflight",
                        "position": "8",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "LoadPort",
                        "isenabled": true,
                        "property": "pol",
                        "position": "9",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "DischargePort",
                        "isenabled": true,
                        "property": "pod",
                        "position": "10",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ETD",
                        "isenabled": true,
                        "property": "etd",
                        "position": "11",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ETA",
                        "isenabled": true,
                        "property": "eta",
                        "position": "12",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ATD",
                        "isenabled": false,
                        "property": "atd",
                        "position": "13",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ATA",
                        "isenabled": false,
                        "property": "ata",
                        "position": "14",
                        "width": "120",
                        "display": true
                    }
                ],
                "routingcheckbox": {
                    "isenabled": false,
                    "position": "1",
                    "width": "45"
                },
                "jobno": {
                    "isenabled": false,
                    "position": "2",
                    "width": "40"
                },
                "legorder": {
                    "isenabled": false,
                    "position": "3",
                    "width": "160"
                },
                "mode": {
                    "isenabled": true,
                    "position": "4",
                    "width": "160"
                },
                "transporttype": {
                    "isenabled": false,
                    "position": "5",
                    "width": "160"
                },
                "status": {
                    "isenabled": false,
                    "position": "6",
                    "width": "120"
                },
                "vessel": {
                    "isenabled": true,
                    "position": "7",
                    "width": "120"
                },
                "voyageflight": {
                    "isenabled": true,
                    "position": "8",
                    "width": "120"
                },
                "pol": {
                    "isenabled": true,
                    "position": "9",
                    "width": "120"
                },
                "pod": {
                    "isenabled": true,
                    "position": "10",
                    "width": "120"
                },
                "etd": {
                    "isenabled": true,
                    "position": "11",
                    "width": "120"
                },
                "eta": {
                    "isenabled": true,
                    "position": "12",
                    "width": "120"
                },
                "atd": {
                    "isenabled": false,
                    "position": "13",
                    "width": "120"
                },
                "ata": {
                    "isenabled": false,
                    "position": "14",
                    "width": "120"
                }
            }
        }



        Init();
    }
})();