(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessController", ProcessController);

    ProcessController.$inject = ["$scope", "$location", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function ProcessController($scope, $location, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
        /* jshint validthis: true */
        var ProcessCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ProcessCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Process",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ProcessCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            ProcessCtrl.ePage.Masters.emptyText = "-";

            try {
                ProcessCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ProcessCtrl.ePage.Masters.QueryString.AppPk) {
                    InitProcess();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function InitProcess() {
            ProcessCtrl.ePage.Masters.Process = {};
            ProcessCtrl.ePage.Masters.Process.ActiveProcess = {};

            ProcessCtrl.ePage.Masters.Process.RedirectPagetList = [{
                Code: "ProccessTask",
                Description: "Proccess Task",
                Icon: "fa fa-cog",
                Link: "TC/process-task",
                Color: "#333333"
            }];

            ProcessCtrl.ePage.Masters.Process.Edit = Edit;
            ProcessCtrl.ePage.Masters.Process.Save = Save;
            ProcessCtrl.ePage.Masters.Process.Cancel = Cancel;
            ProcessCtrl.ePage.Masters.Process.OnProcessClick = OnProcessClick;
            ProcessCtrl.ePage.Masters.Process.OnProcessListClick = OnProcessListClick;
            ProcessCtrl.ePage.Masters.Process.DeleteConfirmation = DeleteConfirmation;

            ProcessCtrl.ePage.Masters.Process.SaveBtnText = "OK";
            ProcessCtrl.ePage.Masters.Process.IsDisableSaveBtn = false;

            ProcessCtrl.ePage.Masters.Process.DeleteBtnText = "Delete";
            ProcessCtrl.ePage.Masters.Process.IsDisableDeleteBtn = false;

            GetProcessList();
        }

        function GetProcessList() {
            var _filter = {
                "SAP_FK": ProcessCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ProcessMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessCtrl.ePage.Masters.Process.ProcessList = response.data.Response;
                    if (ProcessCtrl.ePage.Masters.Process.ProcessList.length > 0) {
                        OnProcessClick(ProcessCtrl.ePage.Masters.Process.ProcessList[0]);
                    } else {
                        OnProcessClick();
                    }
                } else {
                    ProcessCtrl.ePage.Masters.Process.ProcessList = [];
                }
            });
        }

        function OnProcessClick($item) {
            ProcessCtrl.ePage.Masters.Process.ActiveProcess = angular.copy($item);
            if (!$item) {
                ProcessCtrl.ePage.Masters.Process.IsEdit = true;
            }
        }

        function Edit() {
            ProcessCtrl.ePage.Masters.Process.IsEdit = true;
            ProcessCtrl.ePage.Masters.Process.SaveBtnText = "OK";
            ProcessCtrl.ePage.Masters.Process.IsDisableSaveBtn = false;
        }

        function Save() {
            if (!ProcessCtrl.ePage.Masters.Process.ActiveProcess) {
                ProcessCtrl.ePage.Masters.Process.ActiveProcess = angular.copy(ProcessCtrl.ePage.Masters.Process.ProcessList[0]);
            } else {
                ProcessCtrl.ePage.Masters.Process.SaveBtnText = "Please Wait...";
                ProcessCtrl.ePage.Masters.Process.IsDisableSaveBtn = true;

                ProcessCtrl.ePage.Masters.Process.ActiveProcess.IsModified = true;
                ProcessCtrl.ePage.Masters.Process.ActiveProcess.IsDeleted = false;
                ProcessCtrl.ePage.Masters.Process.ActiveProcess.TenantCode = authService.getUserInfo().TenantCode;
                ProcessCtrl.ePage.Masters.Process.ActiveProcess.SAP_FK = ProcessCtrl.ePage.Masters.QueryString.AppPk;

                var _input = [ProcessCtrl.ePage.Masters.Process.ActiveProcess];
                apiService.post("eAxisAPI", appConfig.Entities.ProcessMaster.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        ProcessCtrl.ePage.Masters.Process.ActiveProcess = angular.copy(response.data.Response[0]);

                        var _index = ProcessCtrl.ePage.Masters.Process.ProcessList.map(function (e) {
                            return e.Process_PK;
                        }).indexOf(response.data.Response[0].Process_PK);

                        if (_index === -1) {
                            ProcessCtrl.ePage.Masters.Process.ProcessList.push(response.data.Response[0]);
                        } else {
                            ProcessCtrl.ePage.Masters.Process.ProcessList[_index] = response.data.Response[0];
                        }
                        ProcessCtrl.ePage.Masters.Process.IsEdit = false;
                    } else {
                        toastr.error("Could not Save...!");
                    }

                    ProcessCtrl.ePage.Masters.Process.SaveBtnText = "OK";
                    ProcessCtrl.ePage.Masters.Process.IsDisableSaveBtn = false;
                });
            }
        }

        function Cancel() {
            if (!ProcessCtrl.ePage.Masters.Process.ActiveProcess) {
                if (ProcessCtrl.ePage.Masters.Process.ProcessList.length > 0) {
                    ProcessCtrl.ePage.Masters.Process.ActiveProcess = angular.copy(ProcessCtrl.ePage.Masters.ProcessList[0]);
                } else {
                    ProcessCtrl.ePage.Masters.Process.ProcessList = undefined;
                }
            } else {
                var _index = ProcessCtrl.ePage.Masters.Process.ProcessList.map(function (value, key) {
                    return value.PK;
                }).indexOf(ProcessCtrl.ePage.Masters.Process.ActiveProcess.PK);

                if (_index !== -1) {
                    ProcessCtrl.ePage.Masters.Process.ActiveProcess = angular.copy(ProcessCtrl.ePage.Masters.Process.ProcessList[_index]);
                }
            }

            ProcessCtrl.ePage.Masters.Process.IsEdit = false;
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
            ProcessCtrl.ePage.Masters.Process.DeleteBtnText = "Please Wait...";
            ProcessCtrl.ePage.Masters.Process.IsDisableDeleteBtn = true;

            ProcessCtrl.ePage.Masters.Process.ActiveProcess.IsModified = true;
            ProcessCtrl.ePage.Masters.Process.ActiveProcess.IsDelete = true;
            ProcessCtrl.ePage.Masters.Process.ActiveProcess.TenantCode = authService.getUserInfo().TenantCode;

            var _input = [ProcessCtrl.ePage.Masters.Process.ActiveProcess];

            apiService.post("eAxisAPI", appConfig.Entities.ProcessMaster.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = ProcessCtrl.ePage.Masters.Process.ProcessList.map(function (value, key) {
                        return value.Process_PK;
                    }).indexOf(ProcessCtrl.ePage.Masters.Process.ActiveProcess.Process_PK);

                    if (_index !== -1) {
                        ProcessCtrl.ePage.Masters.Process.ProcessList.splice(_index, 1);
                        if (ProcessCtrl.ePage.Masters.Process.ProcessList.length > 0) {
                            ProcessCtrl.ePage.Masters.Process.ActiveProcess = angular.copy(ProcessCtrl.ePage.Masters.Process.ProcessList[0]);
                        } else {
                            OnProcessClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                ProcessCtrl.ePage.Masters.Process.DeleteBtnText = "Delete";
                ProcessCtrl.ePage.Masters.Process.IsDisableDeleteBtn = false;
            });
        }

        function OnProcessListClick($item) {
            var _queryString = ProcessCtrl.ePage.Masters.QueryString;
            _queryString.Process_PK = ProcessCtrl.ePage.Masters.Process.ActiveProcess.Process_PK;

            $location.path($item.Link + "/" + helperService.encryptData(_queryString));
        }
        Init();
    }
})();
