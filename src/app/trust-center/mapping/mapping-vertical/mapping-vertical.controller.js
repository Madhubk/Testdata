(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MappingVerticalController", MappingVerticalController);

    MappingVerticalController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "trustCenterConfig", "toastr", "confirmation", "tcMappingConfig"];

    function MappingVerticalController($scope, $location, $uibModal, authService, apiService, helperService, trustCenterConfig, toastr, confirmation, tcMappingConfig) {
        /* jshint validthis: true */
        var MappingVerticalCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            MappingVerticalCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Mapping_Vertical",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            MappingVerticalCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            MappingVerticalCtrl.ePage.Masters.emptyText = "-";

            try {
                MappingVerticalCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (MappingVerticalCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitMappingList();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            MappingVerticalCtrl.ePage.Masters.Breadcrumb = {};
            MappingVerticalCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (MappingVerticalCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + MappingVerticalCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            MappingVerticalCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": MappingVerticalCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": MappingVerticalCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": MappingVerticalCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "mapping",
                Description: "Mapping" + _breadcrumbTitle + " - " + MappingVerticalCtrl.ePage.Masters.QueryString.DisplayName,
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

        function InitMappingList() {
            MappingVerticalCtrl.ePage.Masters.MappingVertical = {};
            MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical = {};

            MappingVerticalCtrl.ePage.Masters.MappingVertical.Config = tcMappingConfig.Entities.Mapping[MappingVerticalCtrl.ePage.Masters.QueryString.MappingCode];

            MappingVerticalCtrl.ePage.Masters.MappingVertical.configType = ["Tenant", "Application", "AccessTo", "BasedOn", "OtherEntitySource", "OtherEntitySource_2", "OtherEntitySource_3", "OtherEntitySource_4"];

            MappingVerticalCtrl.ePage.Masters.MappingVertical.configType.map(function (value, key) {
                MappingVerticalCtrl.ePage.Masters.MappingVertical[value] = helperService.metaBase();
            });

            MappingVerticalCtrl.ePage.Masters.MappingVertical.Cancel = Cancel;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.Delete = Delete;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.DeleteConfirmation = DeleteConfirmation;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.Save = Save;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.Edit = Edit;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.OnMappingClick = OnMappingClick;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.OnUserListClick = OnUserListClick;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.OnRePublishClick = OnRePublishClick;
           
            MappingVerticalCtrl.ePage.Masters.MappingVertical.UserTenantRoleCancel = UserTenantRoleCancel;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.AddNew = AddNew;
            MappingVerticalCtrl.ePage.Masters.CheckUIControl = CheckUIControl;

            MappingVerticalCtrl.ePage.Masters.MappingVertical.GetAutoCompleteList = GetAutoCompleteList;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.OnBlurAutoCompleteList = OnBlurAutoCompleteList;

            MappingVerticalCtrl.ePage.Masters.MappingVertical.SaveBtnText = "OK";
            MappingVerticalCtrl.ePage.Masters.MappingVertical.IsDisableSaveBtn = false;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.DeleteBtnText = "Delete";
            MappingVerticalCtrl.ePage.Masters.MappingVertical.IsDisableDeleteBtn = false;

            GetMappingList();
            GetRedirectLinkList();
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(controlId);
        }

        function GetMappingList() {
            var _filter = {
                "SAP_FK": MappingVerticalCtrl.ePage.Masters.QueryString.AppPk,
                "MappingCode": MappingVerticalCtrl.ePage.Masters.QueryString.MappingCode,
            };

            if (MappingVerticalCtrl.ePage.Masters.QueryString.MappingCode !== 'SECAPP_SECTENANT') {
                _filter.Item_FK = MappingVerticalCtrl.ePage.Masters.QueryString.ItemPk;
                _filter.ItemCode = MappingVerticalCtrl.ePage.Masters.QueryString.ItemCode;
            }

            if (MappingVerticalCtrl.ePage.Masters.MappingVertical.Config.Tenant.Visible && MappingVerticalCtrl.ePage.Masters.QueryString.MappingCode !== 'SECAPP_SECTENANT') {
                _filter.TenantCode = authService.getUserInfo().TenantCode;
            }

            if (MappingVerticalCtrl.ePage.Masters.QueryString.MappingCode === 'APP_TRUST_APP_TNT' || MappingVerticalCtrl.ePage.Masters.QueryString.MappingCode === 'SECAPP_SECTENANT') {
                _filter.PropertyName = "false";
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecMappings.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList = response.data.Response;

                    if (MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList.length > 0) {
                        OnMappingClick(MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList[0]);
                    } else {
                        OnMappingClick();
                    }
                } else {
                    MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList = [];
                }
            });
        }

        function AddNew() {
            if (MappingVerticalCtrl.ePage.Masters.QueryString.MappingCode === 'SECAPP_SECTENANT') {
                MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical = {
                    SAP_FK: MappingVerticalCtrl.ePage.Masters.QueryString.AppPk,
                    SAP_Code: MappingVerticalCtrl.ePage.Masters.QueryString.AppCode
                };
            } else {
                MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical = {
                    TenantCode: authService.getUserInfo().TenantCode,
                    TNT_FK: authService.getUserInfo().TenantPK,
                    SAP_FK: MappingVerticalCtrl.ePage.Masters.QueryString.AppPk,
                    SAP_Code: MappingVerticalCtrl.ePage.Masters.QueryString.AppCode
                };
            }

            Edit();
        }

        function OnMappingClick($item) {
            MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical = angular.copy($item);
            MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVerticalCopy = angular.copy($item);
         }

         

        function EditModalInstance() {
            return MappingVerticalCtrl.ePage.Masters.MappingVertical.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right tc-edit-modal-mapping-vertical",
                scope: $scope,
                template: `<div ng-include src="'mappingEdit'"></div>`
            });
        }

        function Edit() {
            MappingVerticalCtrl.ePage.Masters.MappingVertical.SaveBtnText = "OK";
            MappingVerticalCtrl.ePage.Masters.MappingVertical.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            MappingVerticalCtrl.ePage.Masters.MappingVertical.SaveBtnText = "Please Wait...";
            MappingVerticalCtrl.ePage.Masters.MappingVertical.IsDisableSaveBtn = true;

            var _input = angular.copy(MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical);

            if (!_input.TenantCode) {
                _input.TenantCode = authService.getUserInfo().TenantCode;
                _input.TNT_FK = authService.getUserInfo().TenantPK;
            }
            if (!_input.SAP_Code) {
                _input.SAP_FK = MappingVerticalCtrl.ePage.Masters.QueryString.AppPk;
                _input.SAP_Code = MappingVerticalCtrl.ePage.Masters.QueryString.AppCode;
            }

            if (_input.Value) {
                _input.IsJson = true;
            }

            _input.MappingCode = MappingVerticalCtrl.ePage.Masters.QueryString.MappingCode;
            _input.Item_FK = MappingVerticalCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemName = MappingVerticalCtrl.ePage.Masters.QueryString.ItemName;
            _input.ItemCode = MappingVerticalCtrl.ePage.Masters.QueryString.ItemCode;
            _input.IsModified = true;
            _input.IsDeleted = false;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        if (_response.MappingCode == "SECAPP_SECTENANT") {
                            var _index = MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList.map(function (value, key) {
                                return value.TenantCode;
                            }).indexOf(_response.TenantCode);

                            if (_index == -1) {
                                SetDefaultTenantAccess();
                            }
                        }

                        var _index = MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList.map(function (e) {
                            return e.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList.push(_response);
                        } else {
                            MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList[_index] = _response;
                        }

                        MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical = angular.copy(_response);

                        OnMappingClick(MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical);
                        toastr.success("Saved Successfully...!");
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                MappingVerticalCtrl.ePage.Masters.MappingVertical.SaveBtnText = "OK";
                MappingVerticalCtrl.ePage.Masters.MappingVertical.IsDisableSaveBtn = false;
                MappingVerticalCtrl.ePage.Masters.MappingVertical.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical) {
                if (MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList.length > 0) {
                    MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical = angular.copy(MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList[0]);
                } else {
                    MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical = undefined;
                }
            } else if (MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVerticalCopy) {
                var _index = MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList.map(function (value, key) {
                    return value.PK;
                }).indexOf(MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVerticalCopy.PK);

                if (_index !== -1) {
                    MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical = angular.copy(MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList[_index]);
                }
            }

            MappingVerticalCtrl.ePage.Masters.MappingVertical.EditModal.dismiss('cancel');
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
            MappingVerticalCtrl.ePage.Masters.MappingVertical.DeleteBtnText = "Please Wait...";
            MappingVerticalCtrl.ePage.Masters.MappingVertical.IsDisableDeleteBtn = true;

            var _input = angular.copy(MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical.PK);

                    if (_index !== -1) {
                        MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList.splice(_index, 1);
                        if (MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList.length > 0) {
                            OnMappingClick(MappingVerticalCtrl.ePage.Masters.MappingVertical.MappingList[0]);
                        } else {
                            OnMappingClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                MappingVerticalCtrl.ePage.Masters.MappingVertical.DeleteBtnText = "Delete";
                MappingVerticalCtrl.ePage.Masters.MappingVertical.IsDisableDeleteBtn = false;
            });
        }

        // ======================================================

        // ======================================================
        function GetAutoCompleteList($viewValue, mapObj, mapCode, mapFK) {
            var _configObj = angular.copy(MappingVerticalCtrl.ePage.Masters.MappingVertical.Config[mapObj]);

            if (_configObj.Visible && _configObj.Enable) {
                var _filterObj = [];
                if (_configObj.Input.length > 0) {
                    _configObj.Input.map(function (val, key) {
                        var _value = angular.copy(val.value);
                        if (val.Type === 1) {
                            if (authService.getUserInfo()[val.value]) {
                                _value = authService.getUserInfo()[val.value];
                            } else {
                                _value = undefined;
                            }
                        } else if (val.Type === 2) {
                            if (MappingVerticalCtrl.ePage.Masters.QueryString[val.value]) {
                                _value = MappingVerticalCtrl.ePage.Masters.QueryString[val.value];
                            } else {
                                _value = undefined;
                            }
                        } else if (val.Type === 3) {
                            if (MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical[val.value]) {
                                _value = MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical[val.value];
                            } else {
                                _value = undefined;
                            }
                        }

                        delete val.Type;
                        val.value = _value;

                        if (_value != undefined) {
                            _filterObj.push(val);
                        }
                    });
                } else {
                    _filterObj = [];
                }

                if ($viewValue !== "#") {
                    var _filter = {
                        FieldName: "Autocompletefield",
                        value: $viewValue
                    };
                    var _index = _filterObj.map(function (value, key) {
                        return value.FieldName;
                    }).indexOf(_filter.FieldName);

                    if (_index !== -1) {
                        _filterObj[_index].value = _filter.value;
                    } else {
                        _filterObj.push(_filter);
                    }

                    var _input = {
                        "searchInput": _filterObj,
                        "FilterID": _configObj.FilterID,
                    };

                    if (_configObj.DBObjectName) {
                        _input.DBObjectName = _configObj.DBObjectName
                    }

                    return AutoCompleteAPICall(mapObj, _input);
                } else if ($viewValue === "#" && _configObj.IsHashRequired) {
                    _filterObj.map(function (value, key) {
                        if (value.FieldName == "Autocompletefield") {
                            _filterObj.splice(key, 1);
                        }
                    });

                    var _input = {
                        "searchInput": _filterObj,
                        "FilterID": _configObj.FilterID,
                    };

                    if (_configObj.DBObjectName) {
                        _input.DBObjectName = _configObj.DBObjectName
                    }

                    return AutoCompleteAPICall(mapObj, _input);
                }
            }
        }

        function AutoCompleteAPICall(mapObj, input) {
            var _configObj = angular.copy(MappingVerticalCtrl.ePage.Masters.MappingVertical.Config[mapObj]),
                _api;

            if (_configObj.APIUrlSuffix) {
                _api = _configObj.APIUrl + MappingVerticalCtrl.ePage.Masters.QueryString[_configObj.APIUrlSuffix];
            } else {
                _api = _configObj.APIUrl;
            }

            return apiService.post(_configObj.API, _api, input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event, mapObj, mapCode, mapFK) {
            var _configObj = angular.copy(MappingVerticalCtrl.ePage.Masters.MappingVertical.Config[mapObj]);

            if (_configObj.Visible && _configObj.Enable) {
                MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical[mapObj] = _configObj.TYPE;
                MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical[mapFK] = $item[_configObj.ValueField];
                MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical[mapCode] = $item[_configObj.TextField];
            }
        }

        function OnBlurAutoCompleteList($event, mapObj, mapCode, mapFK) {
            MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical[mapObj + "NoResults"] = false;
            MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical[mapObj + "Loading"] = false;
            var _configObj = angular.copy(MappingVerticalCtrl.ePage.Masters.MappingVertical.Config[mapObj]);

            if (_configObj.Visible && _configObj.Enable) {
                if (!MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical[mapCode]) {
                    MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical[mapFK] = undefined;
                }
            }
        }

        function GetRedirectLinkList() {
            MappingVerticalCtrl.ePage.Masters.MappingVertical.RedirectPagetList = [{
                Code: "UserList",
                Description: "User List",
                Icon: "fa fa-user",
                Link: "#/TC/dynamic-list-view/UserProfile",
                Color: "#333333",
                MappingCode: "GRUP_ROLE_APP_TNT"
            }];
        }

        function OnUserListClick($item) {
            var _queryString = {
                USR_ROLES: MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical.AccessCode
            };
            var _queryString2 = angular.copy(MappingVerticalCtrl.ePage.Masters.QueryString);
            _queryString2.BreadcrumbTitle = undefined;

            if ($item.Link != "#") {
                window.open($item.Link + "/" + helperService.encryptData(_queryString2) + '?item=' + helperService.encryptData(_queryString), "_blank");
            }
        }

        function SetDefaultTenantAccess() {
            var _input = {
                "FromTenant": "TBASE",
                "ToTenant": MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical.TenantCode,
                "AppCode": MappingVerticalCtrl.ePage.Masters.MappingVertical.ActiveMappingVertical.SAP_Code
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecTenant.API.CopyBaseTenantBehavior.Url, _input).then(function (response) {
                if (response.data.Response) {}
            });
        }

        function OnRePublishClick() {
            GetRepublishAccessList();
         }

        function GetRepublishAccessList() {
            var _input = {
                "AppCode": MappingVerticalCtrl.ePage.Masters.QueryString.AppCode,
                "TenantCode": authService.getUserInfo().TenantCode,
                "userName": MappingVerticalCtrl.ePage.Masters.QueryString.ItemCode,
            };
            apiService.post("authAPI", trustCenterConfig.Entities.API.UserPrivileges.API.PublishPrivilegesByUser.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    MappingVerticalCtrl.ePage.Masters.MappingVertical.RePublishAccessList = response.data.Response;

                    if (typeof MappingVerticalCtrl.ePage.Masters.MappingVertical.RePublishAccessList == "string") {
                        MappingVerticalCtrl.ePage.Masters.MappingVertical.RePublishAccessList = JSON.parse(RolesCtrl.ePage.Masters.Role.RePublishAccessList);
                    }

                    EditUserTenantRoleModalInstance().result.then(function (response) { }, function () {
                        UserTenantRoleCancel();
                    });
                } else {
                    MappingVerticalCtrl.ePage.Masters.MappingVertical.RePublishAccessList = [];
                }
            });
        }

        function EditUserTenantRoleModalInstance() {
            return MappingVerticalCtrl.ePage.Masters.MappingVertical.EditUserTenantRoleModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'userTenantRoleEdit'"></div>`
            });
        }

        function UserTenantRoleCancel() {
            MappingVerticalCtrl.ePage.Masters.MappingVertical.EditUserTenantRoleModal.dismiss('cancel');
        }

        // ======================================================

        Init();
    }
})();
