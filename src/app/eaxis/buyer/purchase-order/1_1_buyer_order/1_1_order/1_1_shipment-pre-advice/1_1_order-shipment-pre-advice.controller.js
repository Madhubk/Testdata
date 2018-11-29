(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrdShipmentPreAdviceController", one_one_OrdShipmentPreAdviceController);

    one_one_OrdShipmentPreAdviceController.$inject = ["$scope", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "toastr", "appConfig"];

    function one_one_OrdShipmentPreAdviceController($scope, $uibModal, APP_CONSTANT, apiService, helperService, toastr, appConfig) {
        var one_one_OrdShipmentPreAdviceCtrl = this;

        function Init() {
            var currentOrder = one_one_OrdShipmentPreAdviceCtrl.currentOrder[one_one_OrdShipmentPreAdviceCtrl.currentOrder.label].ePage.Entities;
            one_one_OrdShipmentPreAdviceCtrl.ePage = {
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
            one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker = {};
            one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.IsDisable = false;
            one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.AddVessel = AddVessel;
            one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.RemoveVessel = RemoveVessel;
            one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];

            if (one_one_OrdShipmentPreAdviceCtrl.currentOrder.isNew) {
                one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = [];
                one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];
            } else {
                VesselPlanningGridLoad();
                VesselPlanningHistory();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function VesselPlanningGridLoad() {
            var _filter = {
                "SourceRefKey": one_one_OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = response.data.Response;
                } else {
                    one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];
                }
            });
        }

        function VesselPlanningHistory() {
            var _filter = {
                "EntitySource": "SPA",
                "EntityRefKey": one_one_OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = response.data.Response;
                } else {
                    one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = [];
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
                templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment-pre-advice/1_1_vessel-planning/1_1_vessel-planning-modal.html",
                controller: 'one_one_OrdVesselModalController',
                controllerAs: "one_one_OrdVesselModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Input": data,
                            "Type": type,
                            "Mode": one_one_OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data,
                            "currentOrder": one_one_OrdShipmentPreAdviceCtrl.currentOrder
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
                    one_one_OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid.splice(index, 1);
                    toastr.success("Successfully removed...");
                }
            });
        }

        Init();
    }
})();