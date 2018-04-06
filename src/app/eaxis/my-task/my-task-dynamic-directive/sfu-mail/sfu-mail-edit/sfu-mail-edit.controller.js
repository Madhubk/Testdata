(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SfuMailEditDirectiveController", SfuMailEditDirectiveController);

    SfuMailEditDirectiveController.$inject = ["$scope", "$uibModal", "$injector", "helperService", "apiService", "appConfig", "toastr"];

    function SfuMailEditDirectiveController($scope, $uibModal, $injector, helperService, apiService, appConfig, toastr) {
        var SfuMailEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            SfuMailEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_Mail_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": SfuMailEditDirectiveCtrl.entityObj
                    }
                }
            };

            SfuMailEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            SFUMailInit();
        }

        function SFUMailInit() {
            SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj = SfuMailEditDirectiveCtrl.taskObj;
            SfuMailEditDirectiveCtrl.ePage.Masters.GridLoad = false;
            SfuMailEditDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            SfuMailEditDirectiveCtrl.ePage.Masters.Complete = Complete;
            SfuMailEditDirectiveCtrl.ePage.Masters.SendFollowUp = SendFollowUp;

            FollowUpOrderGrid();
        }

        function FollowUpOrderGrid() {
            apiService.get("eAxisAPI", appConfig.Entities.CargoReadiness.API.GetOrdersByGroupId.Url + SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.status = true;
                    })
                    SfuMailEditDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder = angular.copy(response.data.Response);
                    SfuMailEditDirectiveCtrl.ePage.Masters.GridLoad = true;
                } else {
                    SfuMailEditDirectiveCtrl.ePage.Masters.SfuOrderList = [];
                }
            });
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                if (SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                    SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                        if (value.POH_FK == _item.item.POH_FK) {
                            SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
                        }
                    });
                } else {
                    SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
                }
            } else {
                SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.POH_FK == _item.item.POH_FK) {
                        SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
        }

        function SendFollowUp() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "email-template",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail-modal/sfu-mail-modal.html",
                controller: 'SFUSendModalController',
                controllerAs: "SFUSendModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "SendList": SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder
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
            SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
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
                "GroupPK": SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "GroupEntityRefKey": SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "GroupEntitySource": SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "GroupEntityRefCode": SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "UIVesselPlanningDetails": _input
            }
            apiService.post("eAxisAPI", appConfig.Entities.CargoReadiness.API.CompleteFollowUpTask.Url, _filter).then(function (response) {
                if (response.data.Status === "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    SfuMailEditDirectiveCtrl.onComplete({
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