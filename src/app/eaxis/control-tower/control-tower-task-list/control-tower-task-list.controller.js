(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ControlTowerTaskListController", ControlTowerTaskListController);

    ControlTowerTaskListController.$inject = ["$scope", "$timeout", "$location", "$injector", "$uibModal", "$uibModalInstance", "helperService", "param", "$ocLazyLoad"];

    function ControlTowerTaskListController($scope, $timeout, $location, $injector, $uibModal, $uibModalInstance, helperService, param, $ocLazyLoad) {
        /* jshint validthis: true */
        var ControlTowerTaskListCtrl = this;

        function Init() {
            ControlTowerTaskListCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTaskSentItems",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ControlTowerTaskListCtrl.ePage.Masters.Param = param;
            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList = {};
            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.CloseModal = CloseModal;
            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.SelectedGridRow = SelectedGridRow;
            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.CloseEditActivityModal = CloseEditActivityModal;
            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.CloseInstanceFlowModal = CloseInstanceFlowModal;
            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.OnTaskComplete = OnTaskComplete;

            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.DefaultFilter = ControlTowerTaskListCtrl.ePage.Masters.Param._filter;

            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.dataentryName = ControlTowerTaskListCtrl.ePage.Masters.Param.ListingPageName;
            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.IsLoadDynamicList = true;

            if ($location.path().indexOf("my-task") != -1) {
                ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.ProcessInstanceMode = 2;
            } else if ($location.path().indexOf("control-tower") != -1) {
                ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.ProcessInstanceMode = 3;
            }
        }

        function CloseModal() {
            $uibModalInstance.dismiss('cancel');
        }

        function SelectedGridRow($item) {
            if ($item.action === "link") {
                $ocLazyLoad.load(["ProcessInstanceWorkItemDetails"]).then(function () {
                    ViewInstanceFlow($item.data.entity);
                });
            } else if ($item.action === "editActivity") {
                $ocLazyLoad.load(["dynamicListModal", "dynamicList", "dynamicControl", "dynamicGrid", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "DelayReason", "DelayReasonModal", "Checklist", "ChecklistModal", "MyTaskDynamicDirective"]).then(function () {
                    var _arr = [];
                    if ($item.data.entity.OtherConfig) {
                        if ($item.data.entity.OtherConfig.Directives) {
                            if ($item.data.entity.OtherConfig.Directives.ActivityPage) {
                                var _index = $item.data.entity.OtherConfig.Directives.ActivityPage.indexOf(",");
                                if (_index != -1) {
                                    _arr = $item.data.entity.OtherConfig.Directives.ActivityPage.split(",");
                                } else {
                                    _arr.push($item.data.entity.OtherConfig.Directives.ActivityPage);
                                }
                            }

                            if (!$item.data.entity.OtherConfig.Directives.ListPage) {
                                console.log("Task Form Not Yet Configured...!");
                            }
                        } else {
                            console.log("Task Form Not Yet Configured...!");
                        }
                    } else {
                        console.log("Task Form Not Yet Configured...!");
                    }

                    if (_arr.length > 0) {
                        _arr = _arr.filter(function (e) {
                            return e;
                        });
                        $ocLazyLoad.load(_arr).then(function () {
                            EditActivity($item.data.entity);
                        });
                    } else {
                        EditActivity($item.data.entity);
                    }
                });
            } else if ($item.action == "redirect") {
                if ($item.param1 && $item.param2 && $item.param3) {
                    var _queryString = {
                        "PK": $item.data.entity[$item.param3],
                        "Code": $item.data.entity[$item.param2]
                    };
                    _queryString = helperService.encryptData(_queryString);

                    window.open($item.param1 + _queryString, "_blank");
                }
            }
        }

        function EditActivityModalInstance($item) {
            var _templateName = "mytaskdefault-edit-modal",
                _templateNameTemp;
            if ($item.WSI_StepCode) {
                _templateName = $item.WSI_StepCode.replace(/ +/g, "").toLowerCase();

                if (_templateName.indexOf("_") != -1) {
                    _templateNameTemp = angular.copy(_templateName.split("_").join("") + "edit");
                    _templateName = _templateName.split("_").join("") + "-edit-modal";
                }
            }

            var _isExist = $injector.has(_templateNameTemp + "Directive");
            if (!_isExist) {
                _templateName = "mytaskdefault-edit-modal";
            }

            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.EditActivityItem = $item;

            return ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.EditActivityModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: _templateName + " right",
                scope: $scope,
                template: `<div class="modal-header">
                                        <button type="button" class="close" ng-click="ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.CloseEditActivityModal()">&times;</button>
                                        <h5 class="modal-title" id="modal-title">
                                            <strong>{{ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.EditActivityItem.WSI_StepName}} - {{ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.EditActivityItem.KeyReference}}</strong>
                                        </h5>
                                    </div>
                                    <div class="modal-body pt-10" id="modal-body">
                                        <my-task-dynamic-edit-directive task-obj='ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.EditActivityItem' entity-obj='' tab-obj='' on-complete="ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.OnTaskComplete($item)"></my-task-dynamic-edit-directive>
                                    </div>`
            });
        }

        function EditActivity($item) {
            EditActivityModalInstance($item).result.then(function (response) {}, function () {
                console.log("Cancelled");
            });
        }

        function CloseEditActivityModal() {
            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.EditActivityModal.dismiss('cancel');
        }

        function OnTaskComplete($item) {
            CloseEditActivityModal();
            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.IsLoadDynamicList = false;
            $timeout(function () {
                ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.IsLoadDynamicList = true;
            });
        }

        function ViewInstanceFlowModal($item) {
            var _tab = {
                [$item.PSI_InstanceNo]: {
                    ePage: {
                        Entities: {
                            Header: {
                                Data: $item
                            }
                        }
                    }
                },
                isNew: false,
                label: $item.PSI_InstanceNo
            };
            _tab[$item.PSI_InstanceNo].ePage.Entities.Header.Data.InstanceNo = _tab[$item.PSI_InstanceNo].ePage.Entities.Header.Data.PSI_InstanceNo;
            ControlTowerTaskListCtrl.ePage.Masters.InstanceFlowInput = _tab;

            return ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.InstanceFlowModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "instance-flow-modal right",
                scope: $scope,
                template: `<div class="modal-header">
                                        <button type="button" class="close" ng-click="ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.CloseInstanceFlowModal()">&times;</button>
                                        <h5 class="modal-title" id="modal-title">
                                            <strong>Instance Flow</strong>
                                        </h5>
                                    </div>
                                    <div class="modal-body" id="modal-body">
                                        <process-instance-work-item-details current-process-instance="ControlTowerTaskListCtrl.ePage.Masters.InstanceFlowInput" mode="ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.ProcessInstanceMode"></process-instance-work-item-details>
                                    </div>`
            });
        }

        function ViewInstanceFlow($item) {
            ViewInstanceFlowModal($item).result.then(function (response) {}, function () {
                console.log("Cancelled");
            });
        }

        function CloseInstanceFlowModal() {
            ControlTowerTaskListCtrl.ePage.Masters.ControlTowerTaskList.InstanceFlowModal.dismiss('cancel');
        }

        Init();
    }
})();
