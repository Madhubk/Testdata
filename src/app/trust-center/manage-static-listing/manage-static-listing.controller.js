(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCManageStaticListingController", TCManageStaticListingController);

        TCManageStaticListingController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "$timeout", "trustCenterConfig"];

    function TCManageStaticListingController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, $timeout, trustCenterConfig) {
        var TCManageStaticListingCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCManageStaticListingCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ManageStaticListing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCManageStaticListingCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCManageStaticListingCtrl.ePage.Masters.emptyText = "-";

            try {
                TCManageStaticListingCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCManageStaticListingCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                  
                    InitApplication();
                    InitModule();
                    InitStaticListType();
                    InitStaticListTypeList();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCManageStaticListingCtrl.ePage.Masters.Breadcrumb = {};
            TCManageStaticListingCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCManageStaticListingCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCManageStaticListingCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCManageStaticListingCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCManageStaticListingCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "managestaticlisting",
                Description: "Manage Static Listing",
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
        // ========================Application Start=====================
        function InitApplication() {
            TCManageStaticListingCtrl.ePage.Masters.Application = {};
            TCManageStaticListingCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication) {
                TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCManageStaticListingCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCManageStaticListingCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCManageStaticListingCtrl.ePage.Masters.QueryString.AppName
                };
            }
            if (TCManageStaticListingCtrl.ePage.Masters.ActiveModule || TCManageStaticListingCtrl.ePage.Masters.ActiveSubModule) {
                GetStaticListType();
            } else {
                TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource = [];
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = [];
            }
        }

         // ========================Module Start========================

         function InitModule() {
            TCManageStaticListingCtrl.ePage.Masters.OnModuleChange = OnModuleChange;
            TCManageStaticListingCtrl.ePage.Masters.OnSubModuleChange = OnSubModuleChange;

            GetModuleList();
        }

        function GetModuleList() {
            var _filter = {
                TypeCode: "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    TCManageStaticListingCtrl.ePage.Masters.ModuleList = response.data.Response;
                }
            });
        }

        function OnModuleChange($item) {
            TCManageStaticListingCtrl.ePage.Masters.ActiveModule = angular.copy($item);

            if (TCManageStaticListingCtrl.ePage.Masters.ActiveModule) {
                GetSubModuleList();
            } else {
                TCManageStaticListingCtrl.ePage.Masters.SubModuleList = [];
            }

            GetStaticListType();
        }

        function GetSubModuleList() {
            TCManageStaticListingCtrl.ePage.Masters.SubModuleList = undefined;

            var _filter = {
                "PropertyName": "TYP_Group",
                "Module": TCManageStaticListingCtrl.ePage.Masters.ActiveModule.Key,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.GetColumnValuesWithFilters.Url + TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function (response) {
                if (response.data.Response) {
                    TCManageStaticListingCtrl.ePage.Masters.SubModuleList = response.data.Response;
                }
            });
        }

        function OnSubModuleChange($item) {
            TCManageStaticListingCtrl.ePage.Masters.ActiveSubModule = angular.copy($item);
            GetStaticListType();
        }

        // ============== Manage Static List Operation Type =========== //

        function InitStaticListType() {
            TCManageStaticListingCtrl.ePage.Masters.StaticListType = {};
            TCManageStaticListingCtrl.ePage.Masters.StaticListType.OnStaticListTypeClick = OnStaticListTypeClick;
        }

        function GetStaticListType() {
            var _filter = {
                "PropertyName": "TYP_TypeCode",
                "SAP_FK": TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK
            };

            if (TCManageStaticListingCtrl.ePage.Masters.ActiveModule) {
                _filter.Module = TCManageStaticListingCtrl.ePage.Masters.ActiveModule.Key;
            }
            if (TCManageStaticListingCtrl.ePage.Masters.ActiveSubModule) {
                _filter.Group = TCManageStaticListingCtrl.ePage.Masters.ActiveSubModule;
            }
            if (authService.getUserInfo().AppCode == 'EA') {
                _filter.TypeCode = "USERCFXTYPES"
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.GetColumnValuesWithFilters.Url + TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource = response.data.Response;

                    if (TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource.length > 0) {
                        OnStaticListTypeClick(TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource[0]);
                    } else {
                        OnStaticListTypeClick();
                    }
                } else {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = [];
                }
            });
        }

        function OnStaticListTypeClick($item) {
            TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType = $item;

            if ($item) {
                GetStaticListTypeList();
            } else {
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = [];
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = undefined;
            }
        }

        // ========================Manage Static List Type End========================

        // ========================Manage Static List Type List Start========================

        function InitStaticListTypeList() {
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList = {};
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.OnStaticListTypeListClick = OnStaticListTypeListClick;
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.Cancel = Cancel;
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.Save = Save;
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.AddNew = AddNew;
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.Edit = Edit;
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.DeleteConfirmation = DeleteConfirmation;
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.Delete = Delete;
           
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.SaveBtnText = "OK";
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.IsDisableSaveBtn = false;

            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.DeleteBtnText = "Delete";
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.IsDisableDeleteBtn = false;
        }

        function GetStaticListTypeList() {
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = undefined;
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = undefined;

            var _filter = {
                "TypeCode": TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType,
                "SAP_FK": TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = response.data.Response;

                    if (TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.length > 0) {
                        OnStaticListTypeListClick(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource[0]);
                    } else {
                        OnStaticListTypeListClick();
                    }
                } else {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = [];
                }
            });
        }

        function OnStaticListTypeListClick($item) {
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = angular.copy($item);
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeListCopy = angular.copy($item);

            if (TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList) {
                TCManageStaticListingCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "CfxTypes",
                    ObjectId: TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.PK
                };
                TCManageStaticListingCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function AddNew() {
            if (TCManageStaticListingCtrl.ePage.Masters.ActiveModule) {
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = {};
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.Module = TCManageStaticListingCtrl.ePage.Masters.ActiveModule.Key;
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.Group = TCManageStaticListingCtrl.ePage.Masters.ActiveSubModule;
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.TypeCode = TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListType;

                Edit();
            }
        }

        function EditModalInstance() {
            return TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.EditModal = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'manageStaticListingEdit'"></div>`
            });
        }

        function Edit() {
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.SaveBtnText = "OK";
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.SaveBtnText = "Please Wait...";
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.IsDisableSaveBtn = true;

            var _input = angular.copy(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList);

            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.SAP_FK = TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.IsModified = true;
            _input.IsDeleted = false;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.Upsert.Url + TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    if (_response.OtherConfig) {
                        if (typeof _response.OtherConfig == "object") {
                            _response.OtherConfig = JSON.stringify(_response.OtherConfig);
                        }
                    }
                    var _indexTypeCode = TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource.map(function (e) {
                        return e;
                    }).indexOf(_response.TypeCode);

                    if (_indexTypeCode !== -1) {
                        TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType = _response.TypeCode;
                        OnStaticListTypeClick(_response.TypeCode);

                        $timeout(function () {
                            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = angular.copy(_response);
                            var _index = TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.map(function (e) {
                                return e.PK;
                            }).indexOf(_response.PK);

                            if (_index === -1) {
                                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.push(_response);
                            } else {
                                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource[_index] = _response;
                            }

                            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.EditModal.dismiss('cancel');
                        }, 1000);
                    } else {
                        TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType = _response.TypeCode;
                        TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource.push(_response.TypeCode);

                        TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = [];
                        TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = angular.copy(_response);
                        TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.push(_response);

                        TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.EditModal.dismiss('cancel');
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.SaveBtnText = "OK";
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.IsDisableSaveBtn = false;
            });
        }

        function Cancel() {
            if (!TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList) {
                if (TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.length > 0) {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = angular.copy(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource[0]);
                } else {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = undefined;
                }
            } else if (TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeListCopy) {
                var _index = TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeListCopy.PK);

                if (_index !== -1) {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = angular.copy(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource[_index]);
                }
            } else if (!TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeListCopy) {
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = undefined;
            }
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.EditModal.dismiss('cancel');
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
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.DeleteBtnText = "Please Wait...";
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.IsDisableDeleteBtn = true;

            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.IsModified = true;
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.IsDeleted = true;

            var _input = [TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList];

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.Upsert.Url +  TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.map(function (e) {
                        return e.PK
                    }).indexOf(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.PK);

                    if (_index !== -1) {
                        TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.splice(_index, 1);

                        if (TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.length > 0) {
                            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = angular.copy(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource[0]);
                        } else {
                            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = undefined;

                            var _typeIndex = TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource.indexOf(TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType);
                            if (_typeIndex !== -1) {
                                TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource.splice(_typeIndex, 1);
                                TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType = TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource[0];

                                OnStaticListTypeClick(TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType);
                            }
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.DeleteBtnText = "Delete";
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.IsDisableDeleteBtn = false;
            });
        }

       
        Init();
    }
})();
