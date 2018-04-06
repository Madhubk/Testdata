(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SpaMailEditDirectiveController", SpaMailEditDirectiveController);

    SpaMailEditDirectiveController.$inject = ["$scope", "$uibModal", "$injector", "helperService", "apiService", "appConfig", "toastr"];

    function SpaMailEditDirectiveController($scope, $uibModal, $injector, helperService, apiService, appConfig, toastr) {
        var SpaMailEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            SpaMailEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SPA_Mail_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": SpaMailEditDirectiveCtrl.entityObj
                    }
                }
            };

            SpaMailEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            SPAMailInit();
        }

        function SPAMailInit() {
            SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj = SpaMailEditDirectiveCtrl.taskObj;
            SpaMailEditDirectiveCtrl.ePage.Masters.GridLoad = false;
            SpaMailEditDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            SpaMailEditDirectiveCtrl.ePage.Masters.Complete = Complete;
            SpaMailEditDirectiveCtrl.ePage.Masters.SendPreAdvice = SendPreAdvice;
            SpaMailEditDirectiveCtrl.ePage.Masters.VesselPlan = VesselPlan;

            FollowUpOrderGrid();
        }

        function FollowUpOrderGrid() {
            apiService.get("eAxisAPI", appConfig.Entities.VesselPlanning.API.GetOrdersByVesselPk.Url + SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.status = true;
                    });
                    SpaMailEditDirectiveCtrl.ePage.Masters.SpaOrderList = response.data.Response;
                    SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder = angular.copy(response.data.Response);
                    SpaMailEditDirectiveCtrl.ePage.Masters.GridLoad = true;
                } else {
                    SpaMailEditDirectiveCtrl.ePage.Masters.SpaOrderList = [];
                }
            });
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                if (SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                    SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                        if (value.POH_FK == _item.item.POH_FK) {
                            SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
                        }
                    });
                } else {
                    SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
                }
            } else {
                SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.POH_FK == _item.item.POH_FK) {
                        SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
        }

        function VesselPlan(type, data) {
            if (type == "New") {
                if (SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0 ) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        keyboard: false,
                        windowClass: "vessel-template",
                        scope: $scope,
                        // size : "sm",
                        templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-vessel-modal/spa-mail-vessel-modal.html",
                        controller: 'SPAVesselModalController',
                        controllerAs: "SPAVesselModalCtrl",
                        bindToController: true,
                        resolve: {
                            param: function () {
                                var exports = {
                                    "BulkInput" : data,
                                    "Mode" : type
                                };
                                return exports;
                            }
                        }
                    }).result.then(
                        function (response) {                       
                            FollowUpOrderGrid();
                            toastr.success("Successfully saved...")
                        },
                        function (response) {
                        }
                    );
                } else {
                    toastr.warning("Select atlest one order(s) to update vessel")
                }
            }
        }
        
        function SendPreAdvice() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "email-template",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-modal/spa-mail-modal.html",
                controller: 'SPASendModalController',
                controllerAs: "SPASendModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "SendList": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {

                },
                function (response) {}
            );
        }

        function Complete() {
            var _input = [];
            SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                var _inputData = {
                    "OrderNo": value.OrderNo,
                    "OrderSplitNo": value.OrderSplitNo,
                    "POH_FK": value.POH_FK,
                    "Buyer": value.Buyer,
                    "Supplier": value.Supplier,
                    "FollowUpDetailPK": value.FK
                }
                _input.push(_inputData);
            })
            var _filter = {
                "GroupPK": SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "GroupEntityRefKey": SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "GroupEntitySource": SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "GroupEntityRefCode": SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "UIVesselPlanningDetails": _input
            }
            apiService.post("eAxisAPI", appConfig.Entities.CargoReadiness.API.CompleteFollowUpTask.Url, _filter).then(function (response) {
                if (response.data.Status === "Success") {
                    toastr.success("Task Completed SuccesSpally...!");
                    var _data = {
                        IsCompleted: true,
                        Item: SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    SpaMailEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        Init();
    }
})();