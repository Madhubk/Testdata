(function () {
    "use strict";

    angular
        .module("Application")
        .directive("task", Task);

    Task.$inject = ["$templateCache"];

    function Task($templateCache) {
        let _template = `<div class="clearfix sm-task-container">
            <dynamic-list dataentry-name="TaskCtrl.ePage.Masters.Task.dataentryName" selected-grid-row="TaskCtrl.ePage.Masters.Task.SelectedGridRow($item)"
                mode="1" default-filter="TaskCtrl.ePage.Masters.Task.DefaultFilter" dataentry-object="TaskCtrl.ePage.Masters.Task.DataEntryObject"
                data-ng-if="TaskCtrl.ePage.Masters.Task.IsLoadDynamicList"></dynamic-list>
        </div>`;
        $templateCache.put("Task.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "Task.html",
            controller: 'TaskController',
            controllerAs: 'TaskCtrl',
            bindToController: true,
            scope: {
                input: "="
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("TaskController", TaskController);

    TaskController.$inject = ["$scope", "$injector", "$templateCache", "$uibModal", "helperService"];

    function TaskController($scope, $injector, $templateCache, $uibModal, helperService) {
        /* jshint validthis: true */
        let TaskCtrl = this;

        let _activityTemplate = `<div class="modal-header">
                <button type="button" class="close" ng-click="TaskCtrl.ePage.Masters.Task.CloseEditActivityModal()">&times;</button>
                <h5 class="modal-title" id="modal-title">
                    <strong>{{TaskCtrl.ePage.Masters.Task.EditActivityItem.WSI_StepName}} - {{TaskCtrl.ePage.Masters.Task.EditActivityItem.KeyReference}}</strong>
                </h5>
            </div>
            <div class="modal-body pt-10" id="modal-body">
                <my-task-dynamic-edit-directive task-obj='TaskCtrl.ePage.Masters.Task.EditActivityItem' entity-obj='' tab-obj='' on-complete="TaskCtrl.ePage.Masters.Task.OnTaskComplete($item)"></my-task-dynamic-edit-directive>
            </div>`;
        let _instanceFlowTemplate = `<div class="modal-header">
                <button type="button" class="close" ng-click="TaskCtrl.ePage.Masters.Task.CloseInstanceFlowModal()">&times;</button>
                <h5 class="modal-title" id="modal-title">
                    <strong>Instance Flow</strong>
                </h5>
            </div>
            <div class="modal-body" id="modal-body">
                <process-instance-work-item-details current-process-instance="TaskCtrl.ePage.Masters.InstanceFlowInput" mode="2"></process-instance-work-item-details>
            </div>`;
        $templateCache.put("EditActivityModal.html", _activityTemplate);
        $templateCache.put("InstanceFlowModal.html", _instanceFlowTemplate);

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
                ParentEntityRefKey: TaskCtrl.ePage.Entities.ParentEntityRefKey,
                AdditionalEntityRefKey: TaskCtrl.ePage.Entities.AdditionalEntityRefKey
            };
        }

        function SelectedGridRow($item) {
            if ($item.action === "link") {
                ViewInstanceFlow($item.data.entity);
            } else if ($item.action === "editActivity") {
                EditActivity($item.data.entity);
            }
        }

        function EditActivityModalInstance($item) {
            let _templateName = "mytaskdefault-edit-modal",
                _templateNameTemp;
            if ($item.WSI_StepCode) {
                _templateName = $item.WSI_StepCode.replace(/ +/g, "").toLowerCase();

                if (_templateName.indexOf("_") != -1) {
                    _templateNameTemp = angular.copy(_templateName.split("_").join("") + "edit");
                    _templateName = _templateName.split("_").join("") + "-edit-modal";
                }
            }

            let _isExist = $injector.has(_templateNameTemp + "Directive");
            if (!_isExist) {
                _templateName = "mytaskdefault-edit-modal";
            }

            TaskCtrl.ePage.Masters.Task.EditActivityItem = $item;

            return TaskCtrl.ePage.Masters.Task.EditActivityModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: _templateName + " right",
                scope: $scope,
                templateUrl: "EditActivityModal.html"
            });
        }

        function EditActivity($item) {
            EditActivityModalInstance($item).result.then(response => {}, () => {});
        }

        function CloseEditActivityModal() {
            TaskCtrl.ePage.Masters.Task.EditActivityModal.dismiss('cancel');
        }

        function OnTaskComplete($item) {
            CloseEditActivityModal();

            TaskCtrl.ePage.Masters.Task.IsLoadDynamicList = false;
            $timeout(() => TaskCtrl.ePage.Masters.Task.IsLoadDynamicList = true);
        }

        function ViewInstanceFlowModal($item) {
            let _tab = {
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
                templateUrl: "InstanceFlowModal.html"
            });
        }

        function ViewInstanceFlow($item) {
            ViewInstanceFlowModal($item).result.then(response => {}, () => {});
        }

        function CloseInstanceFlowModal() {
            TaskCtrl.ePage.Masters.Task.InstanceFlowModal.dismiss('cancel');
        }

        Init();
    }
})();
