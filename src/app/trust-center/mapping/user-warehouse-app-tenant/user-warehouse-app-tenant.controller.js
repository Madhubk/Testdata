(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCUserWarehouseAppTenantController", TCUserWarehouseAppTenantController);

    TCUserWarehouseAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCUserWarehouseAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCUserWarehouseAppTenantCtrl = this;

        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCUserWarehouseAppTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_User_Warehouse_App_Tenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCUserWarehouseAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.emptyText = "-";


            try {
                TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitUserWarehouseAppTenant();

                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCUserWarehouseAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCUserWarehouseAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCUserWarehouseAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "userList",
                Description: "User",
                Link: "TC/user-list",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "userWarehouseAppTenant",
                Description: "User Warehouse App Tenant (" + "USER_CMP_BRAN_WH_APP_TNT" + ")" + " - " + TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.DisplayName,
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

        // ========================Application Start========================
        function InitApplication() {
            TCUserWarehouseAppTenantCtrl.ePage.Masters.Application = {};
            TCUserWarehouseAppTenantCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCUserWarehouseAppTenantCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);
            if (!TCUserWarehouseAppTenantCtrl.ePage.Masters.Application.ActiveApplication) {
                TCUserWarehouseAppTenantCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.AppName
                };
            }
            GetUserWarehouseAppTenantList();
        }

        // ========================Breadcrumb End========================

        function InitUserWarehouseAppTenant() {
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant = {};
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.GetCompanyList = GetCompanyList;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.GetCmpBranchList = GetCmpBranchList;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.GetWarehouseList = GetWarehouseList;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.OnBlurAutoCompleteComapanyList = OnBlurAutoCompleteComapanyList;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.OnSelectAutoCompleteCompanyList = OnSelectAutoCompleteCompanyList;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.OnBlurAutoCompleteListBranch = OnBlurAutoCompleteListBranch;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.OnSelectAutoCompleteListBranch =
                OnSelectAutoCompleteListBranch;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.OnSelectAutoCompleteListWarehouse = OnSelectAutoCompleteListWarehouse;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.OnBlurAutoCompleteListWarehouse =
                OnBlurAutoCompleteListWarehouse;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.AddNewRow = AddNewRow;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.Save = Save;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.Delete = DeleteConfirmation;
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.CheckUIControl = CheckUIControl;

            if (TCUserWarehouseAppTenantCtrl.ePage.Masters.ActiveApplication == "EA") {
                OnApplicationChange();
            }
            GetUIControlList();
        }

        function GetUIControlList() {
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UIControlList = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "USR_FK": authService.getUserInfo().UserPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CompUserRoleAccess.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.CompUserRoleAccess.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    var _controlList = [];
                    if (_response.length > 0) {
                        _response.map(function (value, key) {
                            if (value.SOP_Code) {
                                _controlList.push(value.SOP_Code);
                            }
                        });
                    }
                    TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UIControlList = _controlList;
                } else {
                    TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UIControlList, controlId);
        }

        function GetUserWarehouseAppTenantList() {
            var _filter = {
                "SAP_FK": TCUserWarehouseAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "Item_FK": TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserCompanyBranchWarehouse.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserCompanyBranchWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList = response.data.Response;
                    TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantListCopy = angular.copy(response.data.Response);

                    TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList.map(function(value,key){
                        SetGenerateScriptInput(value)
                    })
                } else {
                    TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList = [];
                    console.log("Empty Response");
                }
            });
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

        function OnBlurAutoCompleteComapanyList($event, row) {
            row.IsAccessCodeNoResults = false;
            row.IsAccessCodeLoading = false;
        }

        function OnSelectAutoCompleteCompanyList($item, $model, $label, $event, row) {
            row.Access_FK = $item.PK;
            row.AccessCode = $item.Code;
            row.AccessTo = "CMP";
        }

        function GetCmpBranchList($viewValue, row) {
            var _filter = {
                "CMP_FK": row.Access_FK
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
            row.BasedOn_FK = $item.PK;
            row.BasedOnCode = $item.Code;
            row.BasedOn = "BRN"
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
            row.OtherEntity_FK = $item.PK;
            row.OtherEntityCode = $item.WarehouseCode;
            row.OtherEntitySource = "WMS";
        }

        function AddNewRow() {
            var _obj = {};
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList.push(_obj);
        }

        function SetGenerateScriptInput(row) {
            if (row) {
                row.GenerateScriptInput = {
                    ObjectName: "SECMAPPINGS",
                    ObjectId: row.PK
                };
                row.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function Save(row) {
            if (row.PK) {
                UpdateUserWarehouseAppTenant(row);
            } else {
                InsertUserWarehouseAppTenant(row);
            }
        }

        function InsertUserWarehouseAppTenant(row) {
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.SaveBtnText = "Please Wait...";
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.IsDisableSaveBtn = true;

            var _input = angular.copy(row);
            _input.Item_FK = TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCUserWarehouseAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = "USER";
            _input.AccessCode = row.AccessCode;
            _input.AccessTo = "CMP";
            _input.Access_FK = row.Access_FK;
            _input.BasedOnCode = row.BasedOnCode;
            _input.BasedOn = "BRN";
            _input.BasedOn_FK = row.BasedOn_FK;
            _input.OtherEntity_FK = row.OtherEntity_FK;
            _input.OtherEntitySource = "WMS";
            _input.OtherEntityCode = row.OtherEntityCode;
            _input.IsModified = true;
            _input.SAP_FK = TCUserWarehouseAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.SAP_Code = TCUserWarehouseAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserCompanyBranchWarehouse.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        if(!TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList){
                            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList = [];
                        }
                        var _index = TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList.push(_response);

                        if (_index === -1) {
                            SetGenerateScriptInput(TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList[0]);
                        } else {
                            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList[_index] = _response;
                        }

                        GetUserWarehouseAppTenantList(_response);
                    }
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Could not Save...!");
                }
            });
        }

        function UpdateUserWarehouseAppTenant(row) {
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.SaveBtnText = "Please Wait...";
            TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.IsDisableSaveBtn = true;

            var _input = angular.copy(row);
            _input.IsModified = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserCompanyBranchWarehouse.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList.push(_response);
                    } else {
                        TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList[_index] = _response;
                    }

                    GetUserWarehouseAppTenantList(_response);
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
                    Delete(row);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Delete(row) {
            apiService.get("authAPI", trustCenterConfig.Entities.API.UserCompanyBranchWarehouse.API.Delete.Url + row.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(row.PK);

                    if (_index !== -1) {
                        TCUserWarehouseAppTenantCtrl.ePage.Masters.UserWarehouseAppTenant.UserWarehouseAppTenantList.splice(_index, 1);
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }
                GetUserWarehouseAppTenantList();
            });
        }

        Init();

    }

})();