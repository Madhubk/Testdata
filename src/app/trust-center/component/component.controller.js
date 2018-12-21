(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ComponentController", ComponentController);

    ComponentController.$inject = ["$scope", "$location", "$timeout", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function ComponentController($scope, $location, $timeout, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        /* jshint validthis: true */
        var ComponentCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ComponentCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Component",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ComponentCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            ComponentCtrl.ePage.Masters.emptyText = "-";

            try {
                ComponentCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (ComponentCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitComponentListType();
                    InitComponentListTypeList();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            ComponentCtrl.ePage.Masters.Breadcrumb = {};
            ComponentCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (ComponentCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + ComponentCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle + ")";
            }

            ComponentCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": ComponentCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ComponentCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ComponentCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "component",
                Description: "Component (" + ComponentCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle + ")",
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
            ComponentCtrl.ePage.Masters.Application = {};
            ComponentCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            ComponentCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!ComponentCtrl.ePage.Masters.Application.ActiveApplication) {
                ComponentCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": ComponentCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ComponentCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ComponentCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetComponentListType();
            GetRedirectionPageList();
        }

        // ============== Component List Operation Type =========== 

        function InitComponentListType() {
            ComponentCtrl.ePage.Masters.ComponentListType = {};
            ComponentCtrl.ePage.Masters.ComponentListType.OnComponentListTypeClick = OnComponentListTypeClick;
        }

        function GetComponentListType() {
            var _filter = {
                "PropertyName": "SOP_OperationType",
                "SAP_FK": ComponentCtrl.ePage.Masters.Application.ActiveApplication.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecOperation.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecOperation.API.GetColumnValuesWithFilters.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    ComponentCtrl.ePage.Masters.ComponentListType.ListSource = response.data.Response;

                    if (ComponentCtrl.ePage.Masters.ComponentListType.ListSource.length > 0) {
                        ComponentCtrl.ePage.Masters.ComponentListType.ListSource.map(function (value, key) {
                            if (ComponentCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code == "API") {
                                ComponentCtrl.ePage.Masters.ComponentListType.ListSource = ["API"];
                            } else {
                                if (value == "API") {
                                    ComponentCtrl.ePage.Masters.ComponentListType.ListSource.splice(key, 1);
                                }
                            }
                        });
                        OnComponentListTypeClick(ComponentCtrl.ePage.Masters.ComponentListType.ListSource[0]);
                    } else {
                        OnComponentListTypeClick();
                        ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource = [];
                    }
                } else {
                    ComponentCtrl.ePage.Masters.ComponentListType.ListSource = [];
                    ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource = [];
                }
            });
        }

        function OnComponentListTypeClick($item) {
            ComponentCtrl.ePage.Masters.ComponentListType.ActiveComponentListType = $item;
            ComponentCtrl.ePage.Masters.ComponentListType.ActiveComponentListTypeCopy = $item;

            if ($item) {
                GetComponentListTypeList();
            }
        }

        // ========================Component List Type End========================

        // ========================Component List Type List Start========================
        function InitComponentListTypeList() {
            ComponentCtrl.ePage.Masters.ComponentListTypeList = {};

            ComponentCtrl.ePage.Masters.ComponentListTypeList.OnComponentListTypeListClick = OnComponentListTypeListClick;
            ComponentCtrl.ePage.Masters.ComponentListTypeList.Cancel = Cancel;
            ComponentCtrl.ePage.Masters.ComponentListTypeList.Save = Save;
            ComponentCtrl.ePage.Masters.ComponentListTypeList.Edit = Edit;
            ComponentCtrl.ePage.Masters.ComponentListTypeList.DeleteConfirmation = DeleteConfirmation;
            ComponentCtrl.ePage.Masters.ComponentListTypeList.Delete = Delete;
            ComponentCtrl.ePage.Masters.ComponentListTypeList.OnRedirectListClick = OnRedirectListClick;
            ComponentCtrl.ePage.Masters.ComponentListTypeList.AddNew = AddNew;

            ComponentCtrl.ePage.Masters.ComponentListTypeList.SaveBtnText = "OK";
            ComponentCtrl.ePage.Masters.ComponentListTypeList.IsDisableSaveBtn = false;

            ComponentCtrl.ePage.Masters.ComponentListTypeList.DeleteBtnText = "Delete";
            ComponentCtrl.ePage.Masters.ComponentListTypeList.IsDisableDeleteBtn = false;
        }

        function GetComponentListTypeList() {
            ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource = undefined;
            var _filter = {
                "OperationType": ComponentCtrl.ePage.Masters.ComponentListType.ActiveComponentListType,
                "SAP_FK": ComponentCtrl.ePage.Masters.Application.ActiveApplication.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecOperation.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecOperation.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource = response.data.Response;
                    if (ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource.length > 0) {
                        OnComponentListTypeListClick(ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource[0]);
                    } else {
                        OnComponentListTypeListClick();
                    }
                } else {
                    ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource = [];
                }
            });
        }

        function AddNew() {
            ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList = {
                OperationType: ComponentCtrl.ePage.Masters.ComponentListType.ActiveComponentListType
            };
            Edit();
        }

        function OnComponentListTypeListClick($item) {
            ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList = angular.copy($item);
            ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeListCopy = angular.copy($item);
        }

        function EditModalInstance() {
            return ComponentCtrl.ePage.Masters.ComponentListTypeList.EditModal = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'componentEdit'"></div>`
            });
        }

        function Edit() {
            ComponentCtrl.ePage.Masters.ComponentListTypeList.SaveBtnText = "OK";
            ComponentCtrl.ePage.Masters.ComponentListTypeList.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) { }, function () {
                Cancel();
            });
        }

        function Save() {
            ComponentCtrl.ePage.Masters.ComponentListTypeList.SaveBtnText = "Please Wait...";
            ComponentCtrl.ePage.Masters.ComponentListTypeList.IsDisableSaveBtn = true;

            var _input = angular.copy(ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList);

            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.SAP_FK = ComponentCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.IsModified = true;
            _input.IsDeleted = false;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecOperation.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    var _indexOperationType = ComponentCtrl.ePage.Masters.ComponentListType.ListSource.map(function (e) {
                        return e;
                    }).indexOf(_response.OperationType);

                    if (_indexOperationType !== -1) {
                        ComponentCtrl.ePage.Masters.ComponentListType.ActiveComponentListType = _response.OperationType;
                        OnComponentListTypeClick(_response.OperationType);

                        $timeout(function () {
                            ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList = angular.copy(_response);
                            var _index = ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource.map(function (e) {
                                return e.PK;
                            }).indexOf(_response.PK);

                            if (_index === -1) {
                                ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource.push(_response);
                            } else {
                                ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource[_index] = _response;
                            }

                            ComponentCtrl.ePage.Masters.ComponentListTypeList.EditModal.dismiss('cancel');
                        }, 1000);
                    } else {
                        ComponentCtrl.ePage.Masters.ComponentListType.ActiveComponentListType = _response.OperationType;
                        ComponentCtrl.ePage.Masters.ComponentListType.ListSource.push(_response.OperationType);

                        ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource = [];
                        ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList = angular.copy(_response);
                        ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource.push(_response);

                        ComponentCtrl.ePage.Masters.ComponentListTypeList.EditModal.dismiss('cancel');
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                ComponentCtrl.ePage.Masters.ComponentListTypeList.SaveBtnText = "OK";
                ComponentCtrl.ePage.Masters.ComponentListTypeList.IsDisableSaveBtn = false;
            });
        }

        function Cancel() {
            if (!ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList) {
                if (ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource.length > 0) {
                    ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList = angular.copy(ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource[0]);
                } else {
                    ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList = undefined;
                }
            } else if (ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeListCopy) {
                var _index = ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeListCopy.PK);

                if (_index !== -1) {
                    ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList = angular.copy(ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource[_index]);
                }
            }

            ComponentCtrl.ePage.Masters.ComponentListTypeList.EditModal.dismiss('cancel');
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
            ComponentCtrl.ePage.Masters.ComponentListTypeList.DeleteBtnText = "Please Wait...";
            ComponentCtrl.ePage.Masters.ComponentListTypeList.IsDisableDeleteBtn = true;

            ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList.IsModified = true;
            ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList.IsDeleted = true;

            var _input = [ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList];

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecOperation.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource.map(function (e) {
                        return e.PK
                    }).indexOf(ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList.PK);

                    if (_index !== -1) {
                        ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource.splice(_index, 1);

                        if (ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource.length > 0) {
                            ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList = angular.copy(ComponentCtrl.ePage.Masters.ComponentListTypeList.ListSource[0]);
                        } else {
                            ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList = undefined;

                            var _typeIndex = ComponentCtrl.ePage.Masters.ComponentListType.ListSource.indexOf(ComponentCtrl.ePage.Masters.ComponentListType.ActiveComponentListType);
                            if (_typeIndex !== -1) {
                                ComponentCtrl.ePage.Masters.ComponentListType.ListSource.splice(_typeIndex, 1);
                                ComponentCtrl.ePage.Masters.ComponentListType.ActiveComponentListType = ComponentCtrl.ePage.Masters.ComponentListType.ListSource[0];

                                OnComponentListTypeClick(ComponentCtrl.ePage.Masters.ComponentListType.ActiveComponentListType);
                            }
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                ComponentCtrl.ePage.Masters.ComponentListTypeList.DeleteBtnText = "Delete";
                ComponentCtrl.ePage.Masters.ComponentListTypeList.IsDisableDeleteBtn = false;
            });
        }

        function GetRedirectionPageList() {
            ComponentCtrl.ePage.Masters.ComponentListTypeList.RedirectPagetList = [{
                Code: "OrganizationAccess",
                Description: "Organization Access",
                Icon: "fa fa-sign-in",
                Link: "TC/comp-org-app-tenant",
                Color: "#bd081c",
                BreadcrumbTitle: ComponentCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle +  " - "+"COMP_ORG_APP_TNT",
                Type: 1
            }, {
                Code: "RoleAccess",
                Description: "Role Access",
                Icon: "fa fa-sign-in",
                Link: "TC/comp-role-app-tenant",
                Color: "#bd081c",
                BreadcrumbTitle:  ComponentCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle   + " - " + "COMP_ROLE_APP_TNT",
                Type: 1
            }];
        }

        function OnRedirectListClick($item) {
            if (ComponentCtrl.ePage.Masters.Application.ActiveApplication) {
                var _queryString = {
                    "AppPk": ComponentCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    "AppCode": ComponentCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                    "AppName": ComponentCtrl.ePage.Masters.Application.ActiveApplication.AppName
                };
            } else {
                var _queryString = {
                    "AppPk": ComponentCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ComponentCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ComponentCtrl.ePage.Masters.QueryString.AppName
                };
            }

            if ($item.Type === 1) {
                
                _queryString.DisplayName = ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList.OperationDescription;
                _queryString.ItemPk = ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList.PK;
                _queryString.ItemCode = ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList.OperationName;
                _queryString.ItemName =  ComponentCtrl.ePage.Masters.ComponentListTypeList.ActiveComponentListTypeList.OperationType;
               _queryString.AdditionalData = ComponentCtrl.ePage.Masters.QueryString.AdditionalData;
                _queryString.BreadcrumbTitle = $item.BreadcrumbTitle;
            }

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }
     Init();
    }
})();
