(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessTaskController", ProcessTaskController);

    ProcessTaskController.$inject = ["$scope", "$location", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function ProcessTaskController($scope, $location, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
        /* jshint validthis: true */
        var ProcessTaskCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ProcessTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ProcessTask",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ProcessTaskCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            ProcessTaskCtrl.ePage.Masters.emptyText = "-";

            try {
                ProcessTaskCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ProcessTaskCtrl.ePage.Masters.QueryString.AppPk) {
                    InitProcessTask();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function InitProcessTask() {
            ProcessTaskCtrl.ePage.Masters.ProcessTask = {};
            ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask = {};
            ProcessTaskCtrl.ePage.Masters.ProcessTask.Edit = Edit;
            ProcessTaskCtrl.ePage.Masters.ProcessTask.Save = Save;
            ProcessTaskCtrl.ePage.Masters.ProcessTask.Cancel = Cancel;
            ProcessTaskCtrl.ePage.Masters.ProcessTask.OnProcessTaskClick = OnProcessTaskClick;
            ProcessTaskCtrl.ePage.Masters.ProcessTask.DeleteConfirmation = DeleteConfirmation;

            ProcessTaskCtrl.ePage.Masters.ProcessTask.SaveBtnText = "OK";
            ProcessTaskCtrl.ePage.Masters.ProcessTask.IsDisableSaveBtn = false;

            ProcessTaskCtrl.ePage.Masters.ProcessTask.DeleteBtnText = "Delete";
            ProcessTaskCtrl.ePage.Masters.ProcessTask.IsDisableDeleteBtn = false;

            GetProcessTaskList();
            GetProcessList();
            GetDataEntryList();
        }

        function GetProcessList() {
            var _filter = {
                "SAP_FK": ProcessTaskCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ProcessMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessList = response.data.Response;
                } else {
                    ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessList = [];
                    console.log("Empty Response");
                }
            });
        }

        function GetDataEntryList() {
            var _filter = {
                "SAP_FK": ProcessTaskCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessTaskCtrl.ePage.Masters.ProcessTask.DataEntryList = response.data.Response;
                } else {
                    ProcessTaskCtrl.ePage.Masters.ProcessTask.DataEntryList = [];
                    console.log("Empty Response");
                }
            });
        }

        function GetProcessTaskList() {
            var _filter = {
                "SAP_FK": ProcessTaskCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
                "Process_FK": ProcessTaskCtrl.ePage.Masters.QueryString.Process_PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntryProcessTaskMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryProcessTaskMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList = response.data.Response;
                    if (ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList.length > 0) {
                        OnProcessTaskClick(ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList[0]);
                    } else {
                        OnProcessTaskClick();
                    }
                } else {
                    ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList = [];
                }
            });
        }

        function OnProcessTaskClick($item) {
            ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask = angular.copy($item);
            if (!$item) {
                ProcessTaskCtrl.ePage.Masters.ProcessTask.IsEdit = true;
            }
        }

        function Edit() {
            ProcessTaskCtrl.ePage.Masters.ProcessTask.IsEdit = true;
            ProcessTaskCtrl.ePage.Masters.ProcessTask.SaveBtnText = "OK";
            ProcessTaskCtrl.ePage.Masters.ProcessTask.IsDisableSaveBtn = false;
        }

        function Save() {
            if (!ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask) {
                ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask = angular.copy(ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList[0]);
            } else {
                ProcessTaskCtrl.ePage.Masters.ProcessTask.SaveBtnText = "Please Wait...";
                ProcessTaskCtrl.ePage.Masters.ProcessTask.IsDisableSaveBtn = true;

                ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask.IsModified = true;
                ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask.IsDelete = false;
                ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask.TenantCode = authService.getUserInfo().TenantCode;
                ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask.SAP_FK = ProcessTaskCtrl.ePage.Masters.QueryString.AppPk;

                var _input = [ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask];
                apiService.post("eAxisAPI", appConfig.Entities.DataEntryProcessTaskMapping.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask = angular.copy(response.data.Response[0]);
                        var _index = ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList.map(function (e) {
                            return e.ProcessTaskMapping_PK;
                        }).indexOf(response.data.Response[0].ProcessTaskMapping_PK);

                        if (_index === -1) {
                            ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList.push(response.data.Response[0]);
                        } else {
                            ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList[_index] = response.data.Response[0];
                        }
                        ProcessTaskCtrl.ePage.Masters.ProcessTask.IsEdit = false;
                    } else {
                        toastr.error("Could not Save...!");
                    }

                    ProcessTaskCtrl.ePage.Masters.ProcessTask.SaveBtnText = "OK";
                    ProcessTaskCtrl.ePage.Masters.ProcessTask.IsDisableSaveBtn = false;
                });
            }
        }

        function Cancel() {
            if (!ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask) {
                if (ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList.length > 0) {
                    ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask = angular.copy(ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList[0]);
                } else {
                    ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask = undefined;
                }
            } else {
                var _index = ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList.map(function (value, key) {
                    return value.PK;
                }).indexOf(ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask.PK);

                if (_index !== -1) {
                    ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask = angular.copy(ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList[_index]);
                }
            }

            ProcessTaskCtrl.ePage.Masters.ProcessTask.IsEdit = false;
        }

        function DeleteConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    Delete();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Delete() {
            ProcessTaskCtrl.ePage.Masters.ProcessTask.DeleteBtnText = "Please Wait...";
            ProcessTaskCtrl.ePage.Masters.ProcessTask.IsDisableDeleteBtn = true;

            ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask.IsModified = true;
            ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask.IsDelete = true;

            var _input = [ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask];

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryProcessTaskMapping.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList.map(function (value, key) {
                        return value.ProcessTaskMapping_PK;
                    }).indexOf(ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask.ProcessTaskMapping_PK);

                    if (_index !== -1) {
                        ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList.splice(_index, 1);
                        if (ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList.length > 0) {
                            ProcessTaskCtrl.ePage.Masters.ProcessTask.ActiveProcessTask = angular.copy(ProcessTaskCtrl.ePage.Masters.ProcessTask.ProcessTaskList[0]);
                        } else {
                            OnProcessTaskClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                ProcessTaskCtrl.ePage.Masters.ProcessTask.DeleteBtnText = "Delete";
                ProcessTaskCtrl.ePage.Masters.ProcessTask.IsDisableDeleteBtn = false;
            });
        }

        Init();
    }
})();
