(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCManageStaticListingController", TCManageStaticListingController);

    TCManageStaticListingController.$inject = ["$scope", "$location", "$timeout", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCManageStaticListingController($scope, $location, $timeout, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        /* jshint validthis: true */
        var TCManageStaticListingCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCManageStaticListingCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_User",
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

        // ========================Application Start========================

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

            InitModule();
            InitStaticListType();
            InitStaticListTypeList();

        }

        // ========================Module Start========================

        function InitModule() {
            TCManageStaticListingCtrl.ePage.Masters.Module = {};
            TCManageStaticListingCtrl.ePage.Masters.SubModule = {};
            TCManageStaticListingCtrl.ePage.Masters.Module.OnModuleChange = OnModuleChange;
            TCManageStaticListingCtrl.ePage.Masters.SubModule.OnSubModuleChange = OnSubModuleChange;

            GetModuleList();
        }

        function GetModuleList() {
            var _filter = {
                TypeCode: "MODULE_MASTER",
                SAP_FK: TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url +  TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function (response) {
                if (response.data.Response) {
                    TCManageStaticListingCtrl.ePage.Masters.Module.ListSource = response.data.Response;
                    if (TCManageStaticListingCtrl.ePage.Masters.Module.ListSource.length > 0) {
                        OnModuleChange(TCManageStaticListingCtrl.ePage.Masters.Module.ListSource[0])
                    } else {
                        TCManageStaticListingCtrl.ePage.Masters.SubModule.ListSource = [];
                        TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource = [];
                        TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = [];
                    }
                } else {
                    TCManageStaticListingCtrl.ePage.Masters.SubModule.ListSource = [];
                    TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource = [];
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = [];
                }
            });
        }

        function OnModuleChange($item) {
            TCManageStaticListingCtrl.ePage.Masters.Module.ActiveModule = angular.copy($item);

            GetSubModuleList();
        }

        function GetSubModuleList() {
            TCManageStaticListingCtrl.ePage.Masters.SubModule.ListSource = undefined;

            var _filter = {
                "PropertyName": "TYP_Group",
                "Module": TCManageStaticListingCtrl.ePage.Masters.Module.ActiveModule.Key,
                "SAP_FK": TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.GetColumnValuesWithFilters.Url + TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function (response) {
                if (response.data.Response) {
                    TCManageStaticListingCtrl.ePage.Masters.SubModule.ListSource = response.data.Response;
                    if (TCManageStaticListingCtrl.ePage.Masters.SubModule.ListSource.length > 0) {
                        OnSubModuleChange(TCManageStaticListingCtrl.ePage.Masters.SubModule.ListSource[0])
                    } else {
                        TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource = [];
                        TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = [];

                        TCManageStaticListingCtrl.ePage.Masters.SubModule.ActiveSubModule = undefined;
                        TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType = undefined;
                        TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = undefined;
                    }
                } else {
                    TCManageStaticListingCtrl.ePage.Masters.SubModule.ListSource = [];
                    TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource = [];
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource = [];

                    TCManageStaticListingCtrl.ePage.Masters.SubModule.ActiveSubModule = undefined;
                    TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType = undefined;
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = undefined;
                }
            });
        }

        function OnSubModuleChange($item) {
            TCManageStaticListingCtrl.ePage.Masters.SubModule.ActiveSubModule = angular.copy($item);

            GetStaticListType();
        }

        // ========================Module End========================

        // ========================Static List Type Start========================

        function InitStaticListType() {
            TCManageStaticListingCtrl.ePage.Masters.StaticListType = {};
            TCManageStaticListingCtrl.ePage.Masters.StaticListType.OnStaticListTypeClick = OnStaticListTypeClick;
            TCManageStaticListingCtrl.ePage.Masters.StaticListType.AddNew = AddNew;
        }

        function GetStaticListType() {
            TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource = undefined;
            var _filter = {
                "PropertyName": "TYP_TypeCode",
                "Module": TCManageStaticListingCtrl.ePage.Masters.Module.ActiveModule.Key,
                "Group": TCManageStaticListingCtrl.ePage.Masters.SubModule.ActiveSubModule,
                "SAP_FK": TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK
            };

            if (authService.getUserInfo().AppCode == 'EA') {
                _filter.TypeCode = "USERCFXTYPES"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.GetColumnValuesWithFilters.Url + TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function (response) {
                if (response.data.Response) {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource = response.data.Response;

                    if (TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource.length > 0) {
                        OnStaticListTypeClick(TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource[0]);
                    } else {
                        OnStaticListTypeClick();
                    }
                } else {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource = [];
                }
            });
        }

        function OnStaticListTypeClick($item) {
            TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType = angular.copy($item);

            if ($item) {
                GetStaticListTypeList();
            }
        }

        function AddNew() {
            if (TCManageStaticListingCtrl.ePage.Masters.Module.ActiveModule) {
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = {};
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.Module = TCManageStaticListingCtrl.ePage.Masters.Module.ActiveModule.Key;
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.Group = TCManageStaticListingCtrl.ePage.Masters.SubModule.ActiveSubModule;
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.TypeCode = TCManageStaticListingCtrl.ePage.Masters.StaticListType.ActiveStaticListType;

                Edit();
            }
        }

        // ========================Static List Type End========================

        // ========================Static List Type List Start========================

        function InitStaticListTypeList() {
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList = {};
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.OnStaticListTypeListClick = OnStaticListTypeListClick;

            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.Cancel = Cancel;
            TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.Save = Save;
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
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function (response) {
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

            EditModalInstance().result.then(function (response) { }, function () {
                Cancel();
            });
        }

        function Save() {
            if (!TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList) {
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = angular.copy(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource[0]);
            } else {
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.SaveBtnText = "Please Wait...";
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.IsDisableSaveBtn = true;

                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.TenantCode = authService.getUserInfo().TenantCode;
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.SAP_FK = TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK;
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.IsModified = true;
                TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList.IsDeleted = false;

                var _input = [TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList];

                apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.Upsert.Url + TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function (response) {
                    if (response.data.Response) {
                        var _response = response.data.Response[0];
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
        }

        function Cancel() {
            if (!TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList) {
                if (TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.length > 0) {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = angular.copy(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource[0]);
                } else {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = undefined;
                }
            } else if (TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeListCopy) {
                if (TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.length > 0) {
                    var _index = TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeListCopy.PK);

                    if (_index !== -1) {
                        TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = angular.copy(TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ListSource[_index]);
                    }
                } else {
                    TCManageStaticListingCtrl.ePage.Masters.StaticListTypeList.ActiveStaticListTypeList = undefined;
                }
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

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.Upsert.Url + TCManageStaticListingCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function (response) {
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

                                OnStaticListTypeClick(TCManageStaticListingCtrl.ePage.Masters.StaticListType.ListSource[0]);
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

        // ========================Static List Type List End========================

        Init();
    }
})();
