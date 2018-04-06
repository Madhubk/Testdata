(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessController", ProcessController);

    ProcessController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function ProcessController($scope, $location, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
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
                    InitBreadcrumb();
                    InitProcess();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            ProcessCtrl.ePage.Masters.Breadcrumb = {};
            ProcessCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            ProcessCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "configuration",
                Description: "Configuration",
                Link: "TC/dashboard/" + helperService.encryptData('{"Type":"Configuration", "BreadcrumbTitle": "Configuration"}'),
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "process",
                Description: "Process",
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj));
            }
        }

        // ========================Breadcrumb End========================

        // ========================Process Start========================


        function InitProcess() {
            ProcessCtrl.ePage.Masters.Process = {};
            ProcessCtrl.ePage.Masters.Process.ActiveProcess = {};

            ProcessCtrl.ePage.Masters.Process.Edit = Edit;
            ProcessCtrl.ePage.Masters.Process.Save = Save;
            ProcessCtrl.ePage.Masters.Process.AddNew = AddNew;
            ProcessCtrl.ePage.Masters.Process.Cancel = Cancel;
            ProcessCtrl.ePage.Masters.Process.OnProcessClick = OnProcessClick;
            ProcessCtrl.ePage.Masters.Process.OnProcessListClick = OnProcessListClick;
            ProcessCtrl.ePage.Masters.Process.DeleteConfirmation = DeleteConfirmation;
            ProcessCtrl.ePage.Masters.Process.GetUserList = GetUserList;
            ProcessCtrl.ePage.Masters.Process.GetModuleList = GetModuleList;

            ProcessCtrl.ePage.Masters.Process.SaveBtnText = "OK";
            ProcessCtrl.ePage.Masters.Process.IsDisableSaveBtn = false;

            ProcessCtrl.ePage.Masters.Process.DeleteBtnText = "Delete";
            ProcessCtrl.ePage.Masters.Process.IsDisableDeleteBtn = false;

            GetRedirecrLinkList();
            GetProcessTypeList();
            GetProcessList();
        }

        function GetProcessTypeList() {
            var _filter = {
                "TypeCode": "PROCESSTYPE",
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + ProcessCtrl.ePage.Masters.QueryString.AppPk, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessCtrl.ePage.Masters.Process.TypeList = response.data.Response;
                } else {
                    ProcessCtrl.ePage.Masters.Process.TypeList = [];
                }
            });
        }

        function GetProcessList() {
            var _filter = {
                "SAP_FK": ProcessCtrl.ePage.Masters.QueryString.AppPk,
                //"TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessCtrl.ePage.Masters.Process.ProcessList = response.data.Response;
                    if (ProcessCtrl.ePage.Masters.Process.ProcessList.length > 0) {
                        OnProcessClick(ProcessCtrl.ePage.Masters.Process.ProcessList[0]);
                    } else {
                        OnProcessClick();
                    }
                } else {
                    ProcessCtrl.ePage.Masters.Process.ProcessList = [];
                    OnProcessClick();
                }
            });
        }

        function AddNew() {
            ProcessCtrl.ePage.Masters.Process.ActiveProcess = {};
            Edit();
        }

        function OnProcessClick($item) {
            ProcessCtrl.ePage.Masters.Process.ActiveProcess = angular.copy($item);
            ProcessCtrl.ePage.Masters.Process.ActiveProcessCopy = angular.copy($item);
        }

        function EditModalInstance() {
            return ProcessCtrl.ePage.Masters.Process.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'processEdit'"></div>`
            });
        }

        function Edit() {
            ProcessCtrl.ePage.Masters.Process.SaveBtnText = "OK";
            ProcessCtrl.ePage.Masters.Process.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            ProcessCtrl.ePage.Masters.Process.SaveBtnText = "Please Wait...";
            ProcessCtrl.ePage.Masters.Process.IsDisableSaveBtn = true;

            var _input = angular.copy(ProcessCtrl.ePage.Masters.Process.ActiveProcess);

            _input.IsModified = true;
            _input.IsDeleted = false;
           // _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.SAP_FK = ProcessCtrl.ePage.Masters.QueryString.AppPk;

            apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessMaster.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    ProcessCtrl.ePage.Masters.Process.ActiveProcess = angular.copy(_response);

                    var _index = ProcessCtrl.ePage.Masters.Process.ProcessList.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        ProcessCtrl.ePage.Masters.Process.ProcessList.push(_response);
                    } else {
                        ProcessCtrl.ePage.Masters.Process.ProcessList[_index] = _response;
                    }

                    OnProcessClick(ProcessCtrl.ePage.Masters.Process.ActiveProcess)
                } else {
                    toastr.error("Could not Save...!");
                }

                ProcessCtrl.ePage.Masters.Process.SaveBtnText = "OK";
                ProcessCtrl.ePage.Masters.Process.IsDisableSaveBtn = false;
                ProcessCtrl.ePage.Masters.Process.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!ProcessCtrl.ePage.Masters.Process.ActiveProcess) {
                if (ProcessCtrl.ePage.Masters.Process.ProcessList.length > 0) {
                    ProcessCtrl.ePage.Masters.Process.ActiveProcess = angular.copy(ProcessCtrl.ePage.Masters.ProcessList[0]);
                } else {
                    ProcessCtrl.ePage.Masters.Process.ProcessList = undefined;
                }
            } else if (ProcessCtrl.ePage.Masters.Process.ActiveProcessCopy) {
                var _index = ProcessCtrl.ePage.Masters.Process.ProcessList.map(function (value, key) {
                    return value.PK;
                }).indexOf(ProcessCtrl.ePage.Masters.Process.ActiveProcessCopy.PK);

                if (_index !== -1) {
                    ProcessCtrl.ePage.Masters.Process.ActiveProcess = angular.copy(ProcessCtrl.ePage.Masters.Process.ProcessList[_index]);
                }
            }

            ProcessCtrl.ePage.Masters.Process.EditModal.dismiss('cancel');
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

            var _input = angular.copy(ProcessCtrl.ePage.Masters.Process.ActiveProcess);

            _input.IsModified = true;
            _input.IsDeleted = true;
           // _input.TenantCode = authService.getUserInfo().TenantCode;

            apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessMaster.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = ProcessCtrl.ePage.Masters.Process.ProcessList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(ProcessCtrl.ePage.Masters.Process.ActiveProcess.PK);

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

        function GetUserList($viewValue) {
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "DisplayName": $viewValue,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserExtended.API.FindAll.FilterID
            };

            return apiService.post("authAPI", appConfig.Entities.UserExtended.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function GetModuleList($viewValue) {
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "DisplayName": $viewValue,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserExtended.API.FindAll.FilterID
            };

            return apiService.post("authAPI", appConfig.Entities.UserExtended.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function GetRedirecrLinkList() {
            ProcessCtrl.ePage.Masters.Process.RedirectPagetList = [
                //     {
                //     Code: "Scenarios",
                //     Description: "Scenarios",
                //     Icon: "fa fa-cog",
                //     Link: "TC/process-scenarios",
                //     Color: "#333333"
                // },
                {
                    Code: "WorkSteps",
                    Description: "Configure Steps",
                    Icon: "fa fa-cog",
                    Link: "TC/process-work-step",
                    Color: "#333333"
                }, {
                    Code: "ProcessInstance",
                    Description: "Instance",
                    Icon: "fa fa-cog",
                    Link: "TC/process-instance",
                    Color: "#333333"
                }
            ];
        }

        function OnProcessListClick($item) {
            var _queryString = ProcessCtrl.ePage.Masters.QueryString;
            _queryString.BreadcrumbTitle = ProcessCtrl.ePage.Masters.Process.ActiveProcess.ProcessName;
            _queryString.Item = ProcessCtrl.ePage.Masters.Process.ActiveProcess;

            $location.path($item.Link + "/" + helperService.encryptData(_queryString));
        }

        // ========================Process End========================

        Init();
    }
})();
