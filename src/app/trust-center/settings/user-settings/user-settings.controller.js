(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UserSettingsController", UserSettingsController);

    UserSettingsController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "jsonEditModal", "trustCenterConfig"];

    function UserSettingsController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, jsonEditModal, trustCenterConfig) {
        
        var UserSettingsCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            UserSettingsCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_UserSettings",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            UserSettingsCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            UserSettingsCtrl.ePage.Masters.emptyText = "-";

            try {
                UserSettingsCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (UserSettingsCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitDataEntry();
                    InitUserSettings();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ============ Breadcrumb Start ============

        function InitBreadcrumb() {
            UserSettingsCtrl.ePage.Masters.Breadcrumb = {};
            UserSettingsCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (UserSettingsCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + UserSettingsCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            UserSettingsCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": UserSettingsCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": UserSettingsCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": UserSettingsCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "user",
                Description: "User",
                Link: "TC/user-list",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": UserSettingsCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": UserSettingsCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": UserSettingsCtrl.ePage.Masters.QueryString.AppName,
                },
                IsActive: false
            }, {
                Code: "usersettings",
                Description: "Settings" + _breadcrumbTitle,
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

        // ============ Breadcrumb End ============

        // ============ Application Start============
        function InitApplication() {
            UserSettingsCtrl.ePage.Masters.Application = {};
            UserSettingsCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            UserSettingsCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!UserSettingsCtrl.ePage.Masters.Application.ActiveApplication) {
                UserSettingsCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": UserSettingsCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": UserSettingsCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": UserSettingsCtrl.ePage.Masters.QueryString.AppName
                };
            }
           
            GetDataEntryList();
        }
        // ============ Data Entry Begin ============

        function InitDataEntry() {
            UserSettingsCtrl.ePage.Masters.DataEntry = {};
            UserSettingsCtrl.ePage.Masters.DataEntry.OnDataEntryListClick = OnDataEntryListClick;
        }

        function GetDataEntryList() {
            UserSettingsCtrl.ePage.Masters.DataEntry.Listsource = undefined;
            var _filter = {
                "SAP_FK": UserSettingsCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataEntryMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    UserSettingsCtrl.ePage.Masters.DataEntry.Listsource = response.data.Response;
                    if (UserSettingsCtrl.ePage.Masters.DataEntry.Listsource.length > 0) {
                        OnDataEntryListClick(UserSettingsCtrl.ePage.Masters.DataEntry.Listsource[0]);
                    } else {
                        OnDataEntryListClick();
                    }
                } else {
                    UserSettingsCtrl.ePage.Masters.DataEntry.Listsource = [];
                    UserSettingsCtrl.ePage.Masters.UserSetting.Listsource = [];
                }
            });
        }

        function OnDataEntryListClick($item) {
            UserSettingsCtrl.ePage.Masters.DataEntry.ActiveDataEntry = $item;
            if ($item) {
                GetUserSettingsList();
            } else {
                UserSettingsCtrl.ePage.Masters.UserSetting.Listsource = [];
            }
        }

        // ============ Data Entry End ============


        // ============  UserSettings Start ============
        function InitUserSettings() {
            UserSettingsCtrl.ePage.Masters.UserSetting = {};
            UserSettingsCtrl.ePage.Masters.UserSetting.Cancel = Cancel;
            UserSettingsCtrl.ePage.Masters.UserSetting.Save = Save;
            UserSettingsCtrl.ePage.Masters.UserSetting.Edit = Edit;
            UserSettingsCtrl.ePage.Masters.UserSetting.DeleteConfirmation = DeleteConfirmation;
            UserSettingsCtrl.ePage.Masters.UserSetting.OnUserSettingsClick = OnUserSettingsClick;
            UserSettingsCtrl.ePage.Masters.UserSetting.OpenJsonModal = OpenJsonModal;
            UserSettingsCtrl.ePage.Masters.UserSetting.AddNew = AddNew;

            UserSettingsCtrl.ePage.Masters.UserSetting.SaveBtnText = "OK";
            UserSettingsCtrl.ePage.Masters.UserSetting.IsDisableSaveBtn = false;

            UserSettingsCtrl.ePage.Masters.UserSetting.DeleteBtnText = "Delete";
            UserSettingsCtrl.ePage.Masters.UserSetting.IsDisableDeleteBtn = false;
        }

        function GetUserSettingsList() {
            UserSettingsCtrl.ePage.Masters.UserSetting.Listsource = undefined;
            var _filter = {
                "SAP_FK": UserSettingsCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": UserSettingsCtrl.ePage.Masters.DataEntry.ActiveDataEntry.DataEntryName.toUpperCase() + "_" + UserSettingsCtrl.ePage.Masters.QueryString.ItemName,
                "SourceEntityRefKey": UserSettingsCtrl.ePage.Masters.QueryString.UserName,
                "TypeCode": UserSettingsCtrl.ePage.Masters.DataEntry.ActiveDataEntry.DataEntry_PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.UserSettings.API.FindAll.Url + UserSettingsCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    UserSettingsCtrl.ePage.Masters.UserSetting.Listsource = response.data.Response;

                    if (UserSettingsCtrl.ePage.Masters.UserSetting.Listsource.length > 0) {
                        OnUserSettingsClick(UserSettingsCtrl.ePage.Masters.UserSetting.Listsource[0]);
                    } else {
                        OnUserSettingsClick();
                    }
                } else {
                    UserSettingsCtrl.ePage.Masters.UserSetting.Listsource = [];
                }
            });
        }

        function AddNew() {
            UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting = {};
            Edit();
        }

        function OnUserSettingsClick($item) {
            UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting = angular.copy($item);
            UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSettingCopy = angular.copy($item);
        }

        function EditModalInstance() {
            return UserSettingsCtrl.ePage.Masters.UserSetting.EditModal = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'userSettingsEdit'"></div>`
            });
        }

        function Edit() {
            UserSettingsCtrl.ePage.Masters.UserSetting.SaveBtnText = "OK";
            UserSettingsCtrl.ePage.Masters.UserSetting.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) { }, function () {
                Cancel();
            });
        }

        function Cancel() {
            if (!UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting) {
                if (UserSettingsCtrl.ePage.Masters.UserSetting.Listsource.length > 0) {
                    UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting = angular.copy(UserSettingsCtrl.ePage.Masters.UserSetting.Listsource[0]);
                } else {
                    UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting = undefined;
                }
            } else if (UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSettingCopy) {
                var _index = UserSettingsCtrl.ePage.Masters.UserSetting.Listsource.map(function (value, key) {
                    return value.PK;
                }).indexOf(UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSettingCopy.PK);

                if (_index !== -1) {
                    UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting = angular.copy(UserSettingsCtrl.ePage.Masters.UserSetting.Listsource[_index]);
                }
            }

            UserSettingsCtrl.ePage.Masters.UserSetting.EditModal.dismiss('cancel');
        }

        function Save() {
            UserSettingsCtrl.ePage.Masters.UserSetting.SaveBtnText = "Please Wait...";
            UserSettingsCtrl.ePage.Masters.UserSetting.IsDisableSaveBtn = true;

            var _input = angular.copy(UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting);

            _input.IsModified = true;
            _input.IsDelete = false;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.EntitySource = UserSettingsCtrl.ePage.Masters.DataEntry.ActiveDataEntry.DataEntryName.toUpperCase() + "_" + UserSettingsCtrl.ePage.Masters.QueryString.ItemName;
            _input.SAP_FK = UserSettingsCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.SourceEntityRefKey = UserSettingsCtrl.ePage.Masters.QueryString.UserName;
            _input.TypeCode = UserSettingsCtrl.ePage.Masters.DataEntry.ActiveDataEntry.DataEntry_PK;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.UserSettings.API.Upsert.Url + UserSettingsCtrl.ePage.Masters.Application.ActiveApplication.PK, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting = angular.copy(_response);

                    var _index = UserSettingsCtrl.ePage.Masters.UserSetting.Listsource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        UserSettingsCtrl.ePage.Masters.UserSetting.Listsource.push(_response);
                    } else {
                        UserSettingsCtrl.ePage.Masters.UserSetting.Listsource[_index] = _response;
                    }

                    OnUserSettingsClick(UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting);
                } else {
                    toastr.error("Could not Save...!");
                }

                UserSettingsCtrl.ePage.Masters.UserSetting.SaveBtnText = "OK";
                UserSettingsCtrl.ePage.Masters.UserSetting.IsDisableSaveBtn = false;

                UserSettingsCtrl.ePage.Masters.UserSetting.EditModal.dismiss('cancel');
            });
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
            UserSettingsCtrl.ePage.Masters.UserSetting.DeleteBtnText = "Please Wait...";
            UserSettingsCtrl.ePage.Masters.UserSetting.IsDisableDeleteBtn = true;

            UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting.IsModified = true;
            UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting.IsDeleted = true;
            var _input = [UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting];

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.UserSettings.API.Upsert.Url + UserSettingsCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = UserSettingsCtrl.ePage.Masters.UserSetting.Listsource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting.PK);

                    if (_index !== -1) {
                        UserSettingsCtrl.ePage.Masters.UserSetting.Listsource.splice(_index, 1);
                        if (UserSettingsCtrl.ePage.Masters.UserSetting.Listsource.length == 0) {
                            OnUserSettingsClick();
                        } else {
                            OnUserSettingsClick(UserSettingsCtrl.ePage.Masters.UserSetting.Listsource[0]);
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }
                UserSettingsCtrl.ePage.Masters.UserSetting.DeleteBtnText = "Delete";
                UserSettingsCtrl.ePage.Masters.UserSetting.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal() {
            var _valueJson = UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting.Value;
            if (_valueJson !== undefined && _valueJson !== null && _valueJson !== '' && _valueJson !== ' ') {
                try {
                    if (typeof JSON.parse(_valueJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting.Value
                                    };
                                    return exports;
                                }
                            }
                        };
                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                UserSettingsCtrl.ePage.Masters.UserSetting.ActiveUserSetting.Value = result;
                            }, function () {
                                console.log("Cancelled");
                            });
                    }

                } catch (error) {
                    toastr.warning("Value Should be JSON format...!");
                }
            } else {
                toastr.warning("Value Should not be Empty...!");
            }
        }
        // ===========  UserSettings End ============

        Init();
    }
})();
