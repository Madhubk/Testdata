(function () {
    "use strict";

    angular
        .module("Application")
        .directive("taskAssignStartComplete", TaskAssignStartComplete);

    function TaskAssignStartComplete() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/task-assign-start-complete/task-assign-start-complete.html",
            controller: "TaskAssignStartCompleteController",
            controllerAs: "TaskAssignStartCompleteCtrl",
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                onSubmitResponse: "&"
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("TaskAssignStartCompleteController", TaskAssignStartCompleteController);

    TaskAssignStartCompleteController.$inject = ["appConfig", "helperService", "apiService", "authService", "toastr"];

    function TaskAssignStartCompleteController(appConfig, helperService, apiService, authService, toastr) {
        /* jshint validthis: true */
        var TaskAssignStartCompleteCtrl = this;

        function Init() {
            TaskAssignStartCompleteCtrl.ePage = {
                "Title": "",
                "Prefix": "TaskAssignStartComplete",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TaskAssignStartCompleteCtrl.ePage.Masters.LoginUser = authService.getUserInfo().UserId;

            if (TaskAssignStartCompleteCtrl.input) {
                TaskAssignStartCompleteCtrl.ePage.Masters.Task = TaskAssignStartCompleteCtrl.input;
            }

            TaskAssignStartCompleteCtrl.ePage.Masters.GetUserList = GetUserList;
            TaskAssignStartCompleteCtrl.ePage.Masters.Submit = Submit;
            TaskAssignStartCompleteCtrl.ePage.Masters.AbortWork = AbortWork;

            TaskAssignStartCompleteCtrl.ePage.Masters.SubmitBtnText = "Submit";
            TaskAssignStartCompleteCtrl.ePage.Masters.IsDisableSubmitBtn = false;
        }

        function GetUserList(val) {
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "Autocompletefield": val
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserTenantList.API.FindAll.FilterID
            };

            return apiService.post("authAPI", appConfig.Entities.UserTenantList.API.FindAll.Url, _input).then(function (response) {
                return response.data.Response;
            });
        }

        function Submit() {
            TaskAssignStartCompleteCtrl.ePage.Masters.SubmitBtnText = "Please Wait...";
            TaskAssignStartCompleteCtrl.ePage.Masters.IsDisableSubmitBtn = true;

            var _statusFun = {
                "AVAILABLE": AvailableStatus,
                "ASSIGNED": AssignedStatus,
                // "WORKSTARTED": WorkStartedStatus,
                // "COMPLETED": CompletedStatus,
            };
            TaskAssignStartCompleteCtrl.ePage.Masters.Task.RadioBtnOption

            switch (TaskAssignStartCompleteCtrl.ePage.Masters.Task.RadioBtnOption) {
                case "Me":
                    AvailableStatus();
                    break;
                case "MoveToQueue":
                    AssignedStatus();
                    break;
                case "Others":
                    AssignedStatus();
                    break;
                case "StartWork":
                    AssignedStatus();
                    break;
                case "AbortWork":
                    CancelKPI();
                    break;
                case "Complete":
                    CompleteProcess();
                    break;

                default:
                    break;
            }

            // if (TaskAssignStartCompleteCtrl.ePage.Masters.Task.RadioBtnOption == "AbortWork") {
            //     CancelKPI();
            // } else {
            //     _statusFun[TaskAssignStartCompleteCtrl.ePage.Masters.Task.Status]();
            // }
        }

        function AvailableStatus() {
            var _input = {
                "InstanceNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.PSI_InstanceNo,
                "StepNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.WSI_StepNo
            };

            if (TaskAssignStartCompleteCtrl.ePage.Masters.Task.RadioBtnOption == "Me") {
                _input.UserName = authService.getUserInfo().UserId;

                AssignToSave(_input);
            } else if (TaskAssignStartCompleteCtrl.ePage.Masters.Task.RadioBtnOption == "Others") {
                if (TaskAssignStartCompleteCtrl.ePage.Masters.Task.AssignToOthers) {
                    _input.UserName = TaskAssignStartCompleteCtrl.ePage.Masters.Task.AssignToOthers;

                    AssignToSave(_input);
                } else {
                    toastr.warning("Name Should not be Empty...!");
                    TaskAssignStartCompleteCtrl.ePage.Masters.SubmitBtnText = "Submit";
                    TaskAssignStartCompleteCtrl.ePage.Masters.IsDisableSubmitBtn = false;
                }
            }
        }

        function AssignedStatus() {
            if (TaskAssignStartCompleteCtrl.ePage.Masters.Task.RadioBtnOption == "MoveToQueue") {
                MoveToQueueSave();
            } else if (TaskAssignStartCompleteCtrl.ePage.Masters.Task.RadioBtnOption == "Others") {
                if (TaskAssignStartCompleteCtrl.ePage.Masters.Task.AssignToOthers) {
                    var _input = {
                        "InstanceNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.PSI_InstanceNo,
                        "StepNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.WSI_StepNo,
                        "IsMovetoQue": false
                    };
                    _input.UserName = TaskAssignStartCompleteCtrl.ePage.Masters.Task.AssignToOthers;

                    AssignToSave(_input);
                } else {
                    toastr.warning("Name Should not be Empty...!");
                    TaskAssignStartCompleteCtrl.ePage.Masters.SubmitBtnText = "Submit";
                    TaskAssignStartCompleteCtrl.ePage.Masters.IsDisableSubmitBtn = false;
                }
            } else if (TaskAssignStartCompleteCtrl.ePage.Masters.Task.RadioBtnOption == "StartWork") {
                StartKPI();
            }
        }

        function WorkStartedStatus() {
            if (TaskAssignStartCompleteCtrl.ePage.Masters.Task.RadioBtnOption == "AbortWork") {
                AbortWork();
            } else if (TaskAssignStartCompleteCtrl.ePage.Masters.Task.RadioBtnOption == "Completed") {
                CompleteProcessSave();
            }
        }

        function AbortWork() {
            TaskAssignStartCompleteCtrl.ePage.Masters.AbortBtnText = "Please Wait...";
            TaskAssignStartCompleteCtrl.ePage.Masters.IsDisableAbortBtn = true;

            CancelKPI();
        }

        function AssignToSave(input) {
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.ReAssignActivity.Url, input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response) {
                        OnCompleteAPICall(response);
                    } else {
                        toastr.error("Failed...!");
                    }
                } else {
                    toastr.error(response.data.Response);
                }

                TaskAssignStartCompleteCtrl.ePage.Masters.SubmitBtnText = "Submit";
                TaskAssignStartCompleteCtrl.ePage.Masters.IsDisableSubmitBtn = false;
            });
        }

        function MoveToQueueSave() {
            var _input = {
                "InstanceNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.PSI_InstanceNo,
                "StepNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.WSI_StepNo,
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.MovetoCommonQue.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response) {
                        OnCompleteAPICall(response);
                    } else {
                        toastr.error("Failed...!");
                    }
                } else {
                    toastr.error(response.data.Response);
                }

                TaskAssignStartCompleteCtrl.ePage.Masters.SubmitBtnText = "Submit";
                TaskAssignStartCompleteCtrl.ePage.Masters.IsDisableSubmitBtn = false;
            });
        }

        function StartKPI() {
            var _input = {
                "InstanceNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.PSI_InstanceNo,
                "StepNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.WSI_StepNo,
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.StartKPI.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response) {
                        OnCompleteAPICall(response);
                    } else {
                        toastr.error("Failed...!");
                    }
                } else {
                    toastr.error(response.data.Response);
                }

                TaskAssignStartCompleteCtrl.ePage.Masters.SubmitBtnText = "Submit";
                TaskAssignStartCompleteCtrl.ePage.Masters.IsDisableSubmitBtn = false;
            });
        }

        function CancelKPI() {
            var _input = {
                "InstanceNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.PSI_InstanceNo,
                "StepNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.WSI_StepNo,
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CancelKPI.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response) {
                        OnCompleteAPICall(response);
                    } else {
                        toastr.error("Failed...!");
                    }
                } else {
                    toastr.error(response.data.Response);
                }

                TaskAssignStartCompleteCtrl.ePage.Masters.SubmitBtnText = "Submit";
                TaskAssignStartCompleteCtrl.ePage.Masters.IsDisableSubmitBtn = false;
            });
        }

        function CompleteProcess() {
            var _input = {
                "CompleteInstanceNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.PSI_InstanceNo,
                "CompleteStepNo": TaskAssignStartCompleteCtrl.ePage.Masters.Task.WSI_StepNo
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response) {
                        OnCompleteAPICall(response);
                    } else {
                        toastr.error("Failed...!");
                    }
                } else {
                    toastr.error(response.data.Response);
                }

                TaskAssignStartCompleteCtrl.ePage.Masters.SubmitBtnText = "Submit";
                TaskAssignStartCompleteCtrl.ePage.Masters.IsDisableSubmitBtn = false;
            });
        }

        function OnCompleteAPICall(response) {
            // TaskAssignStartCompleteCtrl.input = response.data.Response;
            if (response.data.Response) {
                TaskAssignStartCompleteCtrl.onSubmitResponse({
                    $item: response.data.Response
                });
            }
        }

        Init();
    }
})();
