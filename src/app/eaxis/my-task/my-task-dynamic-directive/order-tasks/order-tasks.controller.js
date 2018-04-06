(function () {
    "use strict";
    angular
        .module("Application")
        .controller("GroupSfu1DirectiveController", GroupSfu1DirectiveController);

    GroupSfu1DirectiveController.$inject = ["$scope", "$timeout", "$window", "APP_CONSTANT", "apiService", "helperService", "appConfig"];

    function GroupSfu1DirectiveController($scope, $timeout, $window, APP_CONSTANT, apiService, helperService, appConfig) {
        var GroupSfu1DirectiveCtrl = this;

        function Init() {
            GroupSfu1DirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Default",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            GroupSfu1DirectiveCtrl.ePage.Masters.MyTask = GroupSfu1DirectiveCtrl.taskObj;
            GroupSfu1DirectiveCtrl.ePage.Masters.openActivity = OpenActivity;
            GroupSfu1DirectiveCtrl.ePage.Masters.openActivityUpdateVessel = OpenActivityUpdateVessel;
            GroupSfu1DirectiveCtrl.ePage.Masters.OpenEditModal = OpenEditModal;
            GroupSfu1DirectiveCtrl.ePage.Masters.CancelEditModal = CancelEditModal;

            CheckEntitySource();
            StandardMenuConfig();
            TaskGetById();
        }

        function CheckEntitySource() {
            switch (GroupSfu1DirectiveCtrl.ePage.Masters.MyTask.EntitySource) {
                case "SHP":
                    GroupSfu1DirectiveCtrl.ePage.Masters.EntityName = "Shipment"
                    break;
                case "ORD":
                    GroupSfu1DirectiveCtrl.ePage.Masters.EntityName = "Order"
                    break;
                default:
                    GroupSfu1DirectiveCtrl.ePage.Masters.EntityName = "Shipment"
                    break;
            }
        }

        function StandardMenuConfig() {
            GroupSfu1DirectiveCtrl.ePage.Masters.StandardMenuInput = {
                "keyObject": "UI" + GroupSfu1DirectiveCtrl.ePage.Masters.EntityName + "Header",
                "keyObjectNo": GroupSfu1DirectiveCtrl.ePage.Masters.EntityName + "No",
                "entity": GroupSfu1DirectiveCtrl.ePage.Masters.EntityName,
                "entitySource": GroupSfu1DirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "obj": {
                    [GroupSfu1DirectiveCtrl.ePage.Masters.MyTask.KeyReference]: {
                        ePage: {
                            Entities: {
                                Header: {
                                    Data: {
                                        PK: GroupSfu1DirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                                        ["UI" + GroupSfu1DirectiveCtrl.ePage.Masters.EntityName + "Header"]: {
                                            [GroupSfu1DirectiveCtrl.ePage.Masters.EntityName + "No"]: GroupSfu1DirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                                            Communication: null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    label: GroupSfu1DirectiveCtrl.ePage.Masters.MyTask.KeyReference
                }
            };
        }

        function TaskGetById() {
            if (GroupSfu1DirectiveCtrl.ePage.Masters.MyTask.EntityRefKey) {
                var stepCode = GroupSfu1DirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode;
                if (stepCode == "GROUPSFU_1" || stepCode == "GROUPSFU_3") {
                    var url = "CargoReadiness/FollowUpGroup/GetGroupHeaderByGroupId/"
                    var UI = "UIOrderFollowUpHeader"
                } else if (stepCode == "GROUPPPA_1") {
                    // url = "PreAdviceList/GetById/"
                    url = appConfig.Entities.VesselPlanning.API.GetOrdersByVesselPk.Url
                    UI = "UIPreAdviceHeader"
                }
                apiService.get("eAxisAPI", url + GroupSfu1DirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        GroupSfu1DirectiveCtrl.ePage.Masters.MyTask["Buyer"] = response.data.Response.Buyer;
                        GroupSfu1DirectiveCtrl.ePage.Masters.MyTask["Shipper"] = response.data.Response.Supplier;
                        GroupSfu1DirectiveCtrl.ePage.Masters.MyTask["FollowUpDate"] = response.data.Response.FollowUpDate;
                        GroupSfu1DirectiveCtrl.ePage.Masters.MyTask["POs"] = response.data.Response.POs;
                        GroupSfu1DirectiveCtrl.ePage.Masters.MyTask["CargoReadyDate"] = response.data.Response.CargoReadyDate;
                    }
                });
            }
        }

        function OpenActivity(obj) {
            var _queryString = {
                SFH_FK: obj.EntityRefKey,
                Buyer: obj.Buyer,
                Shipper: obj.Shipper
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/supplier/" + _queryString, "_blank");
        }

        function OpenActivityUpdateVessel(obj) {
            var _queryString = {
                SPH_FK: obj.EntityRefKey,
                Buyer: obj.Buyer,
                Shipper: obj.Shipper
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/preadvice/" + _queryString, "_blank");
        }

        function EditModalInstance() {
            return GroupSfu1DirectiveCtrl.ePage.Masters.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "order-task-edit-modal right",
                scope: $scope,
                template: `<div class="modal-header">
                                        <button type="button" class="close" ng-click="GroupSfu1DirectiveCtrl.ePage.Masters.CancelEditModal()">&times;</button>
                                        <h5 class="modal-title" id="modal-title">
                                            <strong>{{GroupSfu1DirectiveCtrl.taskObj.WSI_StepName}} - {{GroupSfu1DirectiveCtrl.taskObj.KeyReference}}</strong>
                                        </h5>
                                    </div>
                                    <div class="modal-body pt-10" id="modal-body">
                                        <my-task-dynamic-edit-directive task-obj='GroupSfu1DirectiveCtrl.taskObj' entity-obj=''></my-task-dynamic-edit-directive>
                                    </div>`
            });
        }

        function OpenEditModal() {
            EditModalInstance().result.then(function (response) {}, function () {
                console.log("Cancelled");
            });
        }

        function CancelEditModal() {
            GroupSfu1DirectiveCtrl.ePage.Masters.EditModal.dismiss('cancel');
        }

        Init();
    }
})();
