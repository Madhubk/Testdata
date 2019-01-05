(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessScenariosController", ProcessScenariosController);

    ProcessScenariosController.$inject = ["$location", "authService", "apiService", "helperService",  "confirmation", "toastr", "trustCenterConfig"];

    function ProcessScenariosController($location, authService, apiService, helperService, confirmation, toastr, trustCenterConfig) {
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
    //================================Module Code End=================================

         function InitProcessScenarios() {
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios = {};
            ProcessScenariosCtrl.ePage.Masters.Module = {};
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.SelectedCompany = {};
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.Save = Save;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.AddNewRow = AddNewRow;
            ProcessScenariosCtrl.ePage.Masters.RemoveRecord = DeleteConfirmation;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetCountryList = GetCountryList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnBlurAutoCompleteListCountry = OnBlurAutoCompleteListCountry;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnSelectAutoCompleteListCountry =
            OnSelectAutoCompleteListCountry;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetCompanyList = GetCompanyList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnBlurAutoCompleteCompanyList = OnBlurAutoCompleteCompanyList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnSelectAutoCompleteCompanyList = OnSelectAutoCompleteCompanyList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetCmpBranchList = GetCmpBranchList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnBlurAutoCompleteListBranch = OnBlurAutoCompleteListBranch;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnSelectAutoCompleteListBranch = OnSelectAutoCompleteListBranch;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetCmpDepartmentList = GetCmpDepartmentList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnBlurAutoCompleteListDepartment = OnBlurAutoCompleteListDepartment;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnSelectAutoCompleteListDepartment = OnSelectAutoCompleteListDepartment;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetWarehouseList = GetWarehouseList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnBlurAutoCompleteListWarehouse = OnBlurAutoCompleteListWarehouse;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnSelectAutoCompleteListWarehouse = OnSelectAutoCompleteListWarehouse;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.GetOrganizationList = GetOrganizationList;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnBlurAutoCompleteListOrganization = OnBlurAutoCompleteListOrganization;
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.OnSelectAutoCompleteListOrganization = OnSelectAutoCompleteListOrganization;

            GetProcessScenariosList();
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

        function GetCountryList($viewValue) {
            if ($viewValue !== "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
            }

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

        function OnBlurAutoCompleteListCountry($event, row) {
            row.IsCountryNoResults = false;
            row.IsCountryLoading = false;
        }

        function OnSelectAutoCompleteListCountry($item, $model, $label, $event, row) {
            row.Country = $item.Code;
        }

        function GetCompanyList($viewValue) {
            if ($viewValue !== "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
            }

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

        function OnBlurAutoCompleteCompanyList($event, row) {
            row.IsCompanyCodeNoResults = false;
            row.IsCompanyCodeLoading = false;
        }

        function OnSelectAutoCompleteCompanyList($item, $model, $label, $event, row) {
            row.CMP_Code = $item.Code;
        }

        function GetCmpBranchList($viewValue, row) {
            var _filter = {
                "CMP_Code": row.CMP_Code
            };
            if ($viewValue !== "#") {
                _filter.Autocompletefield = $viewValue;
            }
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

        function OnBlurAutoCompleteListBranch($event, row) {
            row.IsCmpBranchNoResults = false;
            row.IsCmpBranchLoading = false;
        }

        function OnSelectAutoCompleteListBranch($item, $model, $label, $event, row) {
            row.BRN_Code = $item.Code;
        }

        function GetCmpDepartmentList($viewValue) {
            if ($viewValue !== "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
            }
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

        function OnBlurAutoCompleteListDepartment($event, row) {
            row.IsCmpDepartmentNoResults = false;
            row.IsCmpDepartmentLoading = false;
        }

        function OnSelectAutoCompleteListDepartment($item, $model, $label, $event, row) {
            row.DEP_Code = $item.Code;
        }

        function GetWarehouseList($viewValue) {
            if ($viewValue !== "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
            }
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

        function OnBlurAutoCompleteListWarehouse($event, row) {
            row.IsWarehouseNoResults = false;
            row.IsWarehouseLoading = false;
        }

        function OnSelectAutoCompleteListWarehouse($item, $model, $label, $event, row) {
            row.WAR_Code = $item.WarehouseCode;
        }

        function GetOrganizationList($viewValue) {
            if ($viewValue !== "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.OrgHeader.API.MasterFindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.OrgHeader.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnBlurAutoCompleteListOrganization($event, row) {
            row.IsOrganizationNoResults = false;
            row.IsOrganizationLoading = false;
        }

        function OnSelectAutoCompleteListOrganization($item, $model, $label, $event, row) {
            row.ORG_Code = $item.Code;
        }

       function AddNewRow() {
            var _obj = {};
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.push(_obj);
        }

        function Save(row) {
            if (row.PK) {
                UpdateProcessScenariosAppTenant(row);
            } else {
                InsertProcessScenariosAppTenant(row);
            }
        }

        function InsertProcessScenariosAppTenant(row) {
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.SaveBtnText = "Please Wait...";
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.IsDisableSaveBtn = true;
            var _input = angular.copy(row);
            _input.PSM_FK = ProcessScenariosCtrl.ePage.Masters.QueryString.Item.PK;
            _input.ModuleCode = row.ModuleCode;
            _input.CMP_Code = row.CMP_Code;
            _input.BRN_Code = row.BRN_Code;
            _input.DEP_Code = row.DEP_Code;
            _input.WAR_Code = row.WAR_Code;
            _input.ORG_Code = row.ORG_Code;
            _input.STDName = ProcessScenariosCtrl.ePage.Masters.QueryString.Item.ProcessDescription;
            _input.IsActive = true;
            _input.IsModified = true;
            _input.SAP_FK = ProcessScenariosCtrl.ePage.Masters.QueryString.AppPk;
            _input.SAP_Code = ProcessScenariosCtrl.ePage.Masters.QueryString.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;
            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMProcessScenario.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.push(_response);
                        } else {
                            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList[_index] = _response;
                        }

                        GetProcessScenariosList();
                    }
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Could not Save...!");
                }

            });
        }

        function UpdateProcessScenariosAppTenant(row) {
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.SaveBtnText = "Please Wait...";
            ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.IsDisableSaveBtn = true;

            var _input = angular.copy(row);
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMProcessScenario.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.push(_response);
                    } else {
                        ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList[_index] = _response;
                    }
                    GetProcessScenariosList();

                    toastr.success("Updated Successfully...!");
                } else {
                    toastr.error("Could not Update...!");
                }

            });
        }


        function DeleteConfirmation(row) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    RemoveRecord(row);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function RemoveRecord(row) {
            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.EBPMProcessScenario.API.Delete.Url + row.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(row.PK);

                    if (_index !== -1) {
                        ProcessScenariosCtrl.ePage.Masters.ProcessScenarios.ProcessScenariosList.splice(_index, 1);
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }
                GetProcessScenariosList();
            });
        }

        Init();
    }
})();