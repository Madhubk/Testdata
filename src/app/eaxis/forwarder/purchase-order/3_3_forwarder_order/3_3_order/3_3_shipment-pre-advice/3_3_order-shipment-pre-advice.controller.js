(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrdShipmentPreAdviceController", three_three_OrdShipmentPreAdviceController);

    three_three_OrdShipmentPreAdviceController.$inject = ["$scope", "$window", "$injector", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "toastr", "appConfig"];

    function three_three_OrdShipmentPreAdviceController($scope, $window, $injector, $uibModal, APP_CONSTANT, apiService, helperService, toastr, appConfig) {
        var three_three_OrdShipmentPreAdviceCtrl = this;
        var Config = $injector.get("three_order_listConfig");

        function Init() {
            var currentOrder = three_three_OrdShipmentPreAdviceCtrl.currentOrder[three_three_OrdShipmentPreAdviceCtrl.currentOrder.label].ePage.Entities;
            three_three_OrdShipmentPreAdviceCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Shipment_Pre_Advice",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitShipmentPreAdvice();
        }

        function InitShipmentPreAdvice() {
            // DatePicker
            three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker = {};
            three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.isOpen = [];
            three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.IsDisable = false;
            three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.AddVessel = AddVessel;
            three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.RemoveVessel = RemoveVessel;
            three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];

            if (three_three_OrdShipmentPreAdviceCtrl.currentOrder.isNew) {
                three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = [];
                three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];
            } else {
                VesselPlanningGridLoad();
                VesselPlanningHistory();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function VesselPlanningGridLoad() {
            var _filter = {
                "SourceRefKey": three_three_OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = response.data.Response;
                } else {
                    three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];
                }
            });
        }

        function VesselPlanningHistory() {
            var _filter = {
                "EntitySource": "SPA",
                "EntityRefKey": three_three_OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = response.data.Response;
                } else {
                    three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = [];
                }
            });
        }

        function AddVessel(data, type) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "vessel-modal right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment-pre-advice/3_3_vessel-planning/3_3_vessel-planning-modal.html",
                controller: 'three_three_OrdVesselModalController',
                controllerAs: "three_three_OrdVesselModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Input": data,
                            "Type": type,
                            "Mode": three_three_OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data,
                            "currentOrder": three_three_OrdShipmentPreAdviceCtrl.currentOrder
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    VesselPlanningGridLoad();
                    toastr.success("Successfully saved...");
                },
                function (response) {}
            );
        }

        function RemoveVessel(data, index) {
            apiService.get('eAxisAPI', appConfig.Entities.JobRoutes.API.Delete.Url + data.PK).then(function (response) {
                if (response.data.Response) {
                    three_three_OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid.splice(index, 1);
                    toastr.success("Successfully removed...");
                }
            });
        }

        Init();
    }
})();