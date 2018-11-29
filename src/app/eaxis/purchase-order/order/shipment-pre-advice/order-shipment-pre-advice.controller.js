(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdShipmentPreAdviceController", OrdShipmentPreAdviceController);

    OrdShipmentPreAdviceController.$inject = ["$scope", "$window", "$injector", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "toastr", "appConfig"];

    function OrdShipmentPreAdviceController($scope, $window, $injector, $uibModal, APP_CONSTANT, apiService, helperService, toastr, appConfig) {
        var OrdShipmentPreAdviceCtrl = this;
        var Config = $injector.get("orderConfig");

        function Init() {
            var currentOrder = OrdShipmentPreAdviceCtrl.currentOrder[OrdShipmentPreAdviceCtrl.currentOrder.label].ePage.Entities;
            OrdShipmentPreAdviceCtrl.ePage = {
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
            OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker = {};
            OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            OrdShipmentPreAdviceCtrl.ePage.Masters.IsDisable = false;
            OrdShipmentPreAdviceCtrl.ePage.Masters.AddVessel = AddVessel;
            OrdShipmentPreAdviceCtrl.ePage.Masters.RemoveVessel = RemoveVessel;
            OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];

            if (OrdShipmentPreAdviceCtrl.currentOrder.isNew) {
                OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = [];
                OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];
            } else {
                VesselPlanningGridLoad();
                VesselPlanningHistory();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function VesselPlanningGridLoad() {
            var _filter = {
                "SourceRefKey": OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = response.data.Response;
                } else {
                    OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];
                }
            });
        }

        function VesselPlanningHistory() {
            var _filter = {
                "EntitySource": "SPA",
                "EntityRefKey": OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = response.data.Response;
                } else {
                    OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = [];
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
                templateUrl: "app/eAxis/purchase-order/order/shipment-pre-advice/vessel-planning/vessel-planning-modal.html",
                controller: 'OrdVesselModalController',
                controllerAs: "OrdVesselModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Input": data,
                            "Type": type,
                            "Mode": OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data,
                            "currentOrder": OrdShipmentPreAdviceCtrl.currentOrder
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
                    OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid.splice(index, 1);
                    toastr.success("Successfully removed...");
                }
            });
        }

        Init();
    }
})();