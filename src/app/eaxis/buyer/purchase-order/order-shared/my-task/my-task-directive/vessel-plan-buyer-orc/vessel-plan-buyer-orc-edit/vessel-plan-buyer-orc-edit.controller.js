(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VesselPlanBuyerOrcEditDirectiveController", VesselPlanBuyerOrcEditDirectiveController);

    VesselPlanBuyerOrcEditDirectiveController.$inject = ["$scope", "$uibModal", "helperService", "apiService", "appConfig", "APP_CONSTANT", "myTaskActivityConfig", "toastr"];

    function VesselPlanBuyerOrcEditDirectiveController($scope, $uibModal, helperService, apiService, appConfig, APP_CONSTANT, myTaskActivityConfig, toastr) {
        var VesselPlanBuyerOrcEditDirectiveCtrl = this;

        function Init() {
            var obj = myTaskActivityConfig.Entities.Order[myTaskActivityConfig.Entities.Order.label].ePage.Entities;
            VesselPlanBuyerOrcEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SPA_Mail_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": obj
                // "Entities": {
                //     "Header": {
                //         "Data": {
                //             "UIOrderList": [],
                //             "VesselPlanningGrid": []
                //         }
                //     }
                // }
            };

            SPAMailInit();
            // DatePicker
            VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function SPAMailInit() {
            VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
            VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Entities.Header.Data.VesselPlanningGrid = [];
            VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Masters.AddVessel = AddVessel;
            VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Masters.RemoveVessel = RemoveVessel;
            VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Masters.IsDisabledSend = false;

            VesselPlanningGridLoad();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function VesselPlanningGridLoad() {
            var _filter = {
                "SourceRefKey": VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Entities.Header.Data.VesselPlanningGrid = response.data.Response;
                    }
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
                templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-modal/vessel-plan-modal.html",
                controller: 'VesselPlanModalController',
                controllerAs: "VesselPlanModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Input": data,
                            "Type": type,
                            "ParentObj": VesselPlanBuyerOrcEditDirectiveCtrl.ePage
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
                    VesselPlanBuyerOrcEditDirectiveCtrl.ePage.Entities.Header.Data.VesselPlanningGrid.splice(index, 1);
                    toastr.success("Successfully removed...");
                }
            });
        }

        Init();
    }
})();