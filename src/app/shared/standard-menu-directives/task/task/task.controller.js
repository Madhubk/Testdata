(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TaskController", TaskController);

    TaskController.$inject = ["$scope", "$injector", "$uibModal", "helperService"];

    function TaskController($scope, $injector, $uibModal, helperService) {
        /* jshint validthis: true */
        var TaskCtrl = this;

        function Init() {
            TaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": TaskCtrl.input
            };

            if (TaskCtrl.ePage.Entities) {
                InitTask();
            }
        }

        function InitTask() {
            TaskCtrl.ePage.Masters.Task = {};
            TaskCtrl.ePage.Masters.Task.dataentryName = "WorkItemDetails";

            TaskCtrl.ePage.Masters.Task.SelectedGridRow = SelectedGridRow;
            TaskCtrl.ePage.Masters.Task.CloseEditActivityModal = CloseEditActivityModal;
            TaskCtrl.ePage.Masters.Task.OnTaskComplete = OnTaskComplete;
            TaskCtrl.ePage.Masters.Task.CloseInstanceFlowModal = CloseInstanceFlowModal;

            TaskCtrl.ePage.Masters.Task.IsLoadDynamicList = true;
            TaskCtrl.ePage.Masters.Task.DefaultFilter = {
                EntityRefKey: TaskCtrl.ePage.Entities.EntityRefKey,
                EntitySource: TaskCtrl.ePage.Entities.EntitySource,
                EntityRefCode: TaskCtrl.ePage.Entities.EntityRefCode,
            };

            if (TaskCtrl.ePage.Entities.ParentEntityRefKey) {
                TaskCtrl.ePage.Masters.Task.DefaultFilter.ParentEntityRefKey = TaskCtrl.ePage.Entities.ParentEntityRefKey;
                TaskCtrl.ePage.Masters.Task.DefaultFilter.ParentEntitySource = TaskCtrl.ePage.Entities.ParentEntitySource;
                TaskCtrl.ePage.Masters.Task.DefaultFilter.ParentEntityRefCode = TaskCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (TaskCtrl.ePage.Entities.AdditionalEntityRefKey) {
                TaskCtrl.ePage.Masters.Task.DefaultFilter.AdditionalEntityRefKey = TaskCtrl.ePage.Entities.AdditionalEntityRefKey;
                TaskCtrl.ePage.Masters.Task.DefaultFilter.AdditionalEntitySource = TaskCtrl.ePage.Entities.AdditionalEntitySource;
                TaskCtrl.ePage.Masters.Task.DefaultFilter.AdditionalEntityRefCode = TaskCtrl.ePage.Entities.AdditionalEntityRefCode;
            }
        }

        function SelectedGridRow($item) {
            if ($item.action === "link") {
                ViewInstanceFlow($item.data.entity);
            } else if ($item.action === "editActivity") {
                EditActivity($item.data.entity);
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

            TaskCtrl.ePage.Masters.Task.EditActivityItem = $item;

            return TaskCtrl.ePage.Masters.Task.EditActivityModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: _templateName + " right",
                scope: $scope,
                template: `<div class="modal-header">
                                        <button type="button" class="close" ng-click="TaskCtrl.ePage.Masters.Task.CloseEditActivityModal()">&times;</button>
                                        <h5 class="modal-title" id="modal-title">
                                            <strong>{{TaskCtrl.ePage.Masters.Task.EditActivityItem.WSI_StepName}} - {{TaskCtrl.ePage.Masters.Task.EditActivityItem.KeyReference}}</strong>
                                        </h5>
                                    </div>
                                    <div class="modal-body pt-10" id="modal-body">
                                        <my-task-dynamic-edit-directive task-obj='TaskCtrl.ePage.Masters.Task.EditActivityItem' entity-obj='' tab-obj='' on-complete="TaskCtrl.ePage.Masters.Task.OnTaskComplete($item)"></my-task-dynamic-edit-directive>
                                    </div>`
            });
        }

        function EditActivity($item) {
            EditActivityModalInstance($item).result.then(function (response) {}, function () {
                console.log("Cancelled");
            });
        }

        function CloseEditActivityModal() {
            TaskCtrl.ePage.Masters.Task.EditActivityModal.dismiss('cancel');
        }

        function OnTaskComplete($item) {
            CloseEditActivityModal();

            TaskCtrl.ePage.Masters.Task.IsLoadDynamicList = false;
            $timeout(function () {
                TaskCtrl.ePage.Masters.Task.IsLoadDynamicList = true;
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
            TaskCtrl.ePage.Masters.InstanceFlowInput = _tab;

            return TaskCtrl.ePage.Masters.Task.InstanceFlowModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "instance-flow-modal right",
                scope: $scope,
                template: `<div class="modal-header">
                                        <button type="button" class="close" ng-click="TaskCtrl.ePage.Masters.Task.CloseInstanceFlowModal()">&times;</button>
                                        <h5 class="modal-title" id="modal-title">
                                            <strong>Instance Flow</strong>
                                        </h5>
                                    </div>
                                    <div class="modal-body" id="modal-body">
                                        <process-instance-work-item-details current-process-instance="TaskCtrl.ePage.Masters.InstanceFlowInput" mode="2"></process-instance-work-item-details>
                                    </div>`
            });
        }

        function ViewInstanceFlow($item) {
            ViewInstanceFlowModal($item).result.then(function (response) {}, function () {
                console.log("Cancelled");
            });
        }

        function CloseInstanceFlowModal() {
            TaskCtrl.ePage.Masters.Task.InstanceFlowModal.dismiss('cancel');
        }

        Init();
    }
})();
