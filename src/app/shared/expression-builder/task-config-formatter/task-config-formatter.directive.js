(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventTaskConfigFormatter", EventTaskConfigFormatter);

    EventTaskConfigFormatter.$inject = ["$location", "helperService", "appConfig", "apiService", "authService"];

    function EventTaskConfigFormatter($location, helperService, appConfig, apiService, authService) {
        var _exports = {
            restrict: 'AE',
            templateUrl: "app/shared/expression-builder/task-config-formatter/task-config-formatter.html",
            scope: {
                taskConfigList: "=",
                isDisableMultipleGroup: "=",
                processName: "=",
                config: "="
            },
            link: Link
        };

        return _exports;

        function Link(scope, element, attr) {
            scope.TaskConfig = {};
            scope.TaskConfig.ProcessName = angular.copy(scope.processName);
            scope.TaskConfig.Config = angular.copy(scope.config);

            scope.TaskConfig.AddTaskConfig = AddTaskConfig;
            scope.TaskConfig.DeleteTaskConfig = DeleteTaskConfig;
            scope.TaskConfig.AddDataSlotToObj = AddDataSlotToObj;
            scope.TaskConfig.OnProcessListSelect = OnProcessListSelect;
            scope.TaskConfig.GetProcessList = GetProcessList;
            scope.TaskConfig.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            scope.TaskConfig.ViewProcessSteps = ViewProcessSteps;

            scope.TaskConfig.ActionList = scope.config ? scope.config.ActionList : ["Init", "Complete", "Activate"];
            scope.TaskConfig.ProcessTypeList = scope.config ? scope.config.ProcessTypeList : ["Process", "Task"];

            scope.TaskConfig.DataSlotList = [];
            for (var i = 1; i <= 10; i++) {
                scope.TaskConfig.DataSlotList.push('Val' + i);
            }

            function GetProcessList($viewValue) {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.EBPMProcessMaster.API.FindAll.FilterID
                };

                return apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessMaster.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                    return response.data.Response;
                });
            }

            function OnProcessListSelect($item, $model, $label, $event) {
                scope.TaskConfig.ActiveProess = $item;
            }

            function OnBlurAutoCompleteList($event, $item) {
                $item.IsProcessLoading = false;
                $item.IsProcessNoResults = false;

                if (!$item.ProcessName) {
                    scope.TaskConfig.ActiveProess = undefined;
                }
            }

            function ViewProcessSteps() {
                if (scope.TaskConfig.ActiveProess) {
                    if (authService.getUserInfo().AppCode == "TC") {
                        var _location = $location.path().split("/").pop();
                        scope.TaskConfig.QueryString = JSON.parse(helperService.decryptData(_location));
                    }

                    var _queryString = {
                        AppCode: (authService.getUserInfo().AppCode == "TC") ? scope.TaskConfig.QueryString.AppCode : authService.getUserInfo().AppCode,
                        AppName: (authService.getUserInfo().AppCode == "TC") ? scope.TaskConfig.QueryString.AppName : authService.getUserInfo().AppName,
                        AppPk: (authService.getUserInfo().AppCode == "TC") ? scope.TaskConfig.QueryString.AppPk : authService.getUserInfo().AppPK
                    };
                    _queryString.BreadcrumbTitle = scope.TaskConfig.ActiveProess.ProcessDescription;
                    _queryString.PK = scope.TaskConfig.ActiveProess.PK;
                    _queryString.Item = scope.TaskConfig.ActiveProess;

                    window.open("#/TC/process-work-step/" + helperService.encryptData(_queryString), '_blank');
                }
            }

            function AddTaskConfig(exp) {
                var _group = {
                    ProcessType: "Process",
                    ProcessName: (scope.TaskConfig.ProcessName) ? scope.TaskConfig.ProcessName : "",
                    DataSlots: {},
                    Action: "Init",
                    QueryResults: [],
                    DataSlotKey: "Val1",
                    DataSlotValue: "",
                    DataSlotsDisplay: undefined
                };

                scope.taskConfigList.push(_group);
            }

            function DeleteTaskConfig(exp, $index) {
                scope.taskConfigList.splice($index, 1);
            }

            function AddDataSlotToObj($item) {
                if ($item.DataSlotValue) {
                    $item.DataSlots[$item.DataSlotKey] = $item.DataSlotValue;
                } else {
                    if ($item.DataSlots[$item.DataSlotKey] || $item.DataSlots[$item.DataSlotKey] == "" || $item.DataSlots[$item.DataSlotKey] == " ") {
                        delete $item.DataSlots[$item.DataSlotKey];
                    }
                }

                $item.DataSlotKey = "Val1";
                $item.DataSlotValue = "";

                $item.DataSlotsDisplay = angular.copy(JSON.stringify($item.DataSlots));
            }
        }
    }
})();
