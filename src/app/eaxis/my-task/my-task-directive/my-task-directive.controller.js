(function () {
    "use strict"

    angular
        .module("Application")
        .directive("myTaskDirective", MyTaskDirective)

    MyTaskDirective.$inject = [];

    function MyTaskDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-directive/my-task-directive.html",
            controller: "MyTaskDirectiveController",
            controllerAs: "MyTaskDirectiveCtrl",
            bindToController: true,
            scope: {
                mode: "=",
                taskObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&",
                editActivity: "&",
                assignStartCompleteResponse: "&",
                getErrorWarningList: "&"
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("MyTaskDirectiveController", MyTaskDirectiveController);

    MyTaskDirectiveController.$inject = ["$timeout", "helperService", "authService", "apiService", "appConfig"];

    function MyTaskDirectiveController($timeout, helperService, authService, apiService, appConfig) {
        var MyTaskDirectiveCtrl = this;

        function Init() {
            MyTaskDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "My_Task_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitMyTaskDirective();
        }

        function InitMyTaskDirective() {
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective = {};
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.TaskObj = angular.copy(MyTaskDirectiveCtrl.taskObj);

            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.OnTaskComplete = OnTaskComplete;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.OnRefreshStatusCount = OnRefreshStatusCount;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.OnRefreshTask = OnRefreshTask;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.EditActivity = EditActivity;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.OverrideKPI = OverrideKPI;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.OnOverrideKPIClick = OnOverrideKPIClick;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.GetErrorWarningList = GetErrorWarningList;

            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.AssignStartCompleteResponse = AssignStartCompleteResponse;

            InitAdhoc();
        }

        function GetErrorWarningList($item) {
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.TaskObj.ErrorWarningList = $item;
        }

        function OnTaskComplete($item) {
            MyTaskDirectiveCtrl.onComplete({
                $item: $item
            });
        }

        function OnRefreshStatusCount($item) {
            MyTaskDirectiveCtrl.onRefreshStatusCount({
                $item: $item
            });
        }

        function OnRefreshTask($item) {
            MyTaskDirectiveCtrl.onRefreshTask({
                $item: $item
            });
        }

        function EditActivity($item) {
            MyTaskDirectiveCtrl.editActivity({
                $item: $item
            });
        }

        function OnOverrideKPIClick() {
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.IsShowOverrideDirective = false;

            $timeout(function () {
                MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.IsShowOverrideDirective = true;
            });
        }

        function OverrideKPI($item) {
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.TaskObj.DueDate = $item.DueDate;
        }

        function AssignStartCompleteResponse($item) {
            for (var x in $item) {
                if ($item[x] != null && $item[x] != undefined) {
                    if (x == "OtherConfig" || x == "RelatedProcess") {
                        if (typeof $item[x] == "string") {
                            $item[x] = JSON.parse($item[x]);
                        }
                    }
                    MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.TaskObj[x] = $item[x];
                }
            }

            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.TaskObj.IsChanged = true;

            MyTaskDirectiveCtrl.assignStartCompleteResponse({
                $item: $item
            });
        }

        function InitAdhoc() {
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc = {};
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.OnAdhocProcessSave = OnAdhocProcessSave;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.OnProcessSelectClick = OnProcessSelectClick;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.GetUserList = GetUserList;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.IsLoading = false;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.NoRecords = false;
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.SaveBtnText = "Submit";
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.IsDisableSaveBtn = false;
        }

        function OnProcessSelectClick($item, obj) {
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.ActiveAdhocItem = angular.copy(obj);
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.ActiveWorkItem = angular.copy($item);
        }

        function GetUserList($viewValue) {
            var _filter = {
                "Autocompletefield": $viewValue
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserExtended.API.FindAll.FilterID
            };

            return apiService.post("authAPI", appConfig.Entities.UserExtended.API.FindAll.Url, _input).then(function (response) {
                return response.data.Response;
            });
        }

        function OnAdhocProcessSave($item, obj) {
            if ($item.AdhocObj.AssignTo != undefined && $item.AdhocObj.AssignTo != null && $item.AdhocObj.AssignTo != "") {
                OnAdhocProcessSubmit($item, obj);
            } else {
                toastr.warning("Assign To is Empty...!");
            }
        }

        function OnAdhocProcessSubmit($item, obj) {
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.SaveBtnText = "Please Wait...";
            MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.IsDisableSaveBtn = true;

            var _input = {
                ProcessName: obj.ProcessName,
                InitBy: "RELPROCESS",
                AssignTo: $item.AdhocObj.AssignTo,
                InitByInstanceNo: $item.PSI_InstanceNo,
                InitByWorkItemNo: $item.WorkItemNo,
                InitByStepNo: $item.WSI_StepNo,

                EntitySource: $item.EntitySource,
                EntityRefCode: $item.EntityRefCode,
                EntityRefKey: $item.EntityRefKey,

                ParentEntitySource: $item.EntitySource,
                ParentEntityRefCode: $item.WSI_StepCode,
                ParentEntityRefKey: $item.EntityRefKey,

                AdditionalEntityRefKey: $item.ParentEntityRefKey,
                AdditionalEntitySource: $item.ParentEntitySource,
                AdditionalEntityRefCode: $item.ParentEntityRefCode
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.InitiateProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (_input.AssignTo == authService.getUserInfo().UserId) {
                        // RefreshStatusCount();
                    }

                    MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.ActiveAdhocItem = undefined;
                    toastr.success("Instance " + response.data.Response.InstanceNo + " Created Successfully...!");
                }

                MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.SaveBtnText = "Submit";
                MyTaskDirectiveCtrl.ePage.Masters.MyTaskDirective.Adhoc.IsDisableSaveBtn = false;
            });
        }

        Init();
    }
})();
