(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessScenariosController", ProcessScenariosController);

    ProcessScenariosController.$inject = ["$scope", "$location", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function ProcessScenariosController($scope, $location, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
        /* jshint validthis: true */
        var ProcessScenariosCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ProcessScenariosCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ProcessTask",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ProcessScenariosCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            ProcessScenariosCtrl.ePage.Masters.emptyText = "-";

            try {
                ProcessScenariosCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ProcessScenariosCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitProcessScenarios();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            ProcessScenariosCtrl.ePage.Masters.Breadcrumb = {};
            ProcessScenariosCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (ProcessScenariosCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + ProcessScenariosCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            ProcessScenariosCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                Link: "TC/process",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": ProcessScenariosCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ProcessScenariosCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ProcessScenariosCtrl.ePage.Masters.QueryString.AppName,
                },
                IsActive: false
            }, {
                Code: "processscenaios",
                Description: "Process Scenarios" + _breadcrumbTitle,
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

        function InitProcessScenarios() {
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios = {};
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.Save = Save;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.AddNewRow = AddNewRow;
            ProcessScenariosCtrl.ePage.Masters.RemoveRecord = RemoveRecord;

            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnCompanyChange = OnCompanyChange;

            GetModuleList();
            GetCompanyList();
            GetBranchList();
            GetDepartmentList();
            GetWarehouseList();
            // GetOrganizationList();

            GetProcessScenariosList();
        }

        function GetModuleList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CmpCompany.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CmpCompany.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ModuleList = response.data.Response;
                } else {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ModuleList = [];
                }
            });
        }

        function GetCompanyList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CmpCompany.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CmpCompany.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.CompanyList = response.data.Response;
                } else {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.CompanyList = [];
                }
            });
        }

        function OnCompanyChange($item) {
            console.log($item);
        }

        function GetBranchList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CmpBranch.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CmpBranch.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.BranchList = response.data.Response;
                } else {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.BranchList = [];
                }
            });
        }

        function GetDepartmentList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CmpDepartment.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CmpDepartment.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.DepartmentList = response.data.Response;
                } else {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.DepartmentListList = [];
                }
            });
        }

        function GetWarehouseList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.WarehouseList = response.data.Response;
                } else {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.WarehouseList = [];
                }
            });
        }

        function GetOrganizationList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OrganizationList = response.data.Response;
                } else {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OrganizationList = [];
                }
            });
        }

        function GetProcessScenariosList() {
            var _filter = {
                "SAP_FK": ProcessScenariosCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMProcessScenario.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessScenario.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList = response.data.Response;

                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosListCopy = angular.copy(response.data.Response);

                } else {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList = [];
                    console.log("Empty Response");
                }
            });
        }

        function AddNewRow() {
            var _obj = {};
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.push(_obj);
        }

        function Save() {
            // var _isEquals = angular.equals(ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosListCopy, ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList);
            // console.log(_isEquals, ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosListCopy, ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList);

            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.map(function (value, key) {
                value.IsModified = true;
                value.IsDeleted = false;
            });

            var _input = ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList;

            apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessScenario.API.Upsert.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList = response.data.Response;
                }
            });
        }

        function RemoveRecord($item, $index) {


            if ($item.PK) {
                $item.IsModified = true;
                $item.IsDeleted = true;

                var _input = [$item];

                apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessScenario.API.Upsert.Url, _input).then(function (response) {

                    if (response.data.Response) {
                        ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.splice($index, 1);
                    }
                });
            } else {
                ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.splice($index, 1);
            }
        }

        Init();
    }
})();
