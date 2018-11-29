(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessScenariosController", ProcessScenariosController);

    ProcessScenariosController.$inject = ["$location", "authService", "apiService", "helperService", "trustCenterConfig"];

    function ProcessScenariosController($location, authService, apiService, helperService, trustCenterConfig) {
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
                    InitModuleList();
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
                Code: "dashboard",
                Description: "Dashboard",
                Link: "TC/dashboard",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": ProcessScenariosCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ProcessScenariosCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ProcessScenariosCtrl.ePage.Masters.QueryString.AppName
                },
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

        //====================== Init ModuleList ===========================

        function InitModuleList() {
            ProcessScenariosCtrl.ePage.Masters.Module = {};
            ProcessScenariosCtrl.ePage.Masters.Module.OnModuleChange = OnModuleChange;

            GetModuleList();
        }


        function GetModuleList() {
            var _filter = {
                SortColumn: "TYP_Sequence",
                SortType: "ASC",
                PageNumber: "1",
                PageSize: "1000",
                TypeCode: "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + ProcessScenariosCtrl.ePage.Masters.QueryString.AppPk, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessScenariosCtrl.ePage.Masters.Module.ListSource = response.data.Response;
                    if (ProcessScenariosCtrl.ePage.Masters.Module.ListSource.length > 0) {
                        OnModuleChange(ProcessScenariosCtrl.ePage.Masters.Module.ListSource[0])
                    }
                }
            });
        }

        function OnModuleChange($item) {
            ProcessScenariosCtrl.ePage.Masters.Module.ActiveModule = $item;
            if ($item) {
                GetProcessScenariosList();
            }
        }



        //======================================================================


        function InitProcessScenarios() {
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios = {};
            ProcessScenariosCtrl.ePage.Masters.Module = {};
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.SelectedCompany = {};
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.Save = Save;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.AddNewRow = AddNewRow;
            ProcessScenariosCtrl.ePage.Masters.RemoveRecord = RemoveRecord;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetCompanyList = GetCompanyList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnCompanySelect = OnCompanySelect;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetBranchList = GetBranchList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetDepartmentList = GetDepartmentList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetWarehouseList = GetWarehouseList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetOrganizationList = GetOrganizationList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetCountryList = GetCountryList;

            GetProcessScenariosList();
        }

        function GetCompanyList($viewValue) {
            var _filter = {
                "Name": $viewValue
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CmpCompany.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CmpCompany.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnCompanySelect($item, $model, $label, $event) {
            if ($item) {
                // ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.SelectedCompany = $item;
                //  GetBranchList("");

            }
        }

        function GetBranchList($viewValue, $item) {
            var _filter = {
                "Autocompletefield": $viewValue,
                "CMP_Code": $item.CMP_Code
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CmpBranch.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CmpBranch.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnBranchSelect($item, $model, $label, $event) {
            return GetBranchList($item);
        }


        function GetDepartmentList($viewValue) {
            var _filter = {
                "Autocompletefield": $viewValue,

            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CmpDepartment.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CmpDepartment.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }


        function GetWarehouseList($viewValue) {
            var _filter = {
                "Autocompletefield": $viewValue,

            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.WmsWarehouse.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function GetOrganizationList($viewValue) {
            var _filter = {
                "Autocompletefield": $viewValue,

            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.OrgHeader.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function GetCountryList($viewValue) {
            var _filter = {
                "Autocompletefield": $viewValue,

            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.MstCountry.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.MstCountry.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function GetProcessScenariosList() {
            var _filter = {
                "SAP_FK": ProcessScenariosCtrl.ePage.Masters.QueryString.AppPk,
                "PSM_FK": ProcessScenariosCtrl.ePage.Masters.QueryString.PK,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMProcessScenario.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMProcessScenario.API.FindAll.Url, _input).then(function (response) {
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
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.map(function (value, key) {
                value.IsModified = true;
                value.IsDeleted = false;
                value.PSM_FK = ProcessScenariosCtrl.ePage.Masters.QueryString.PK;
                value.SAP_FK = ProcessScenariosCtrl.ePage.Masters.QueryString.AppPk;
                value.STDName = ProcessScenariosCtrl.ePage.Masters.QueryString.Item.ProcessDescription;

            });

            var _input = ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMProcessScenario.API.Upsert.Url, _input).then(function (response) {
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

                apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMProcessScenario.API.Upsert.Url, _input).then(function (response) {

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
