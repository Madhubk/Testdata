(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManageParameterController", ManageParameterController);

    ManageParameterController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "appConfig", "toastr", "confirmation", "$timeout", "jsonEditModal"];

    function ManageParameterController($scope, $location, $uibModal, authService, apiService, helperService, appConfig, toastr, confirmation, $timeout, jsonEditModal) {
        var ManageParameterCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ManageParameterCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ManageParameter",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ManageParameterCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            ManageParameterCtrl.ePage.Masters.emptyText = "-";

            try {
                ManageParameterCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ManageParameterCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitManageParametersListType();
                    InitManageParametersListTypeList();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            ManageParameterCtrl.ePage.Masters.Breadcrumb = {};
            ManageParameterCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            ManageParameterCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                Code: "manageparameters",
                Description: "Manage Parameters",
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

        // ============== ManageParameters List Operation Type =========== //

        function InitManageParametersListType() {
            ManageParameterCtrl.ePage.Masters.ManageParametersListType = {};
            ManageParameterCtrl.ePage.Masters.ManageParametersListType.OnManageParametersListTypeClick = OnManageParametersListTypeClick;

            GetManageParametersListType();
        }

        function GetManageParametersListType() {
            var _filter = {
                "PropertyName": "DTY_TypeCode",
                "SAP_FK": ManageParameterCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TypeMaster.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TypeMaster.API.GetColumnValuesWithFilters.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    ManageParameterCtrl.ePage.Masters.ManageParametersListType.ListSource = response.data.Response;

                    if (ManageParameterCtrl.ePage.Masters.ManageParametersListType.ListSource.length > 0) {
                        OnManageParametersListTypeClick(ManageParameterCtrl.ePage.Masters.ManageParametersListType.ListSource[0]);
                    } else {
                        OnManageParametersListTypeClick();
                    }
                } else {
                    ManageParameterCtrl.ePage.Masters.ManageParametersListType.ListSource = [];
                }
            });
        }

        function OnManageParametersListTypeClick($item) {
            ManageParameterCtrl.ePage.Masters.ManageParametersListType.ActiveManageParametersListType = $item;

            if ($item) {
                GetManageParametersListTypeList();
            } else {
                ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource = [];
                ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = undefined;
            }
        }

        // ========================Manage Parameters List Type End========================

        // ========================Manage Parameters List Type List Start========================

        function InitManageParametersListTypeList() {
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList = {};
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.OnManageParametersListTypeListClick = OnManageParametersListTypeListClick;
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.Cancel = Cancel;
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.Save = Save;
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.AddNew = AddNew;
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.Edit = Edit;
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.DeleteConfirmation = DeleteConfirmation;
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.Delete = Delete;
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.OpenJsonModal = OpenJsonModal;

            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.SaveBtnText = "OK";
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.IsDisableSaveBtn = false;

            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.DeleteBtnText = "Delete";
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.IsDisableDeleteBtn = false;
        }

        function GetManageParametersListTypeList() {
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource = undefined;
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = undefined;

            var _filter = {
                "TypeCode": ManageParameterCtrl.ePage.Masters.ManageParametersListType.ActiveManageParametersListType,
                "SAP_FK": ManageParameterCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TypeMaster.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource = response.data.Response;

                    ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource.map(function (value, key) {
                        if (value.OtherConfig) {
                            if (typeof value.OtherConfig == "object") {
                                value.OtherConfig = JSON.stringify(value.OtherConfig);
                            }
                        }
                    });

                    if (ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource.length > 0) {
                        OnManageParametersListTypeListClick(ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource[0]);
                    } else {
                        OnManageParametersListTypeListClick();
                    }
                } else {
                    ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource = [];
                }
            });
        }

        function OnManageParametersListTypeListClick($item) {
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = angular.copy($item);
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeListCopy = angular.copy($item);
        }

        function AddNew() {
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = {};

            Edit();
        }

        function EditModalInstance() {
            return ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.EditModal = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'manageParametersEdit'"></div>`
            });
        }

        function Edit() {
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.SaveBtnText = "OK";
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.SaveBtnText = "Please Wait...";
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.IsDisableSaveBtn = true;

            var _input = angular.copy(ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList);

            if (_input.OtherConfig) {
                if (typeof _input.OtherConfig == "object") {
                    _input.OtherConfig = JSON.stringify(_input.OtherConfig);
                }
            }
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.SAP_FK = ManageParameterCtrl.ePage.Masters.QueryString.AppPk;
            _input.IsModified = true;
            _input.IsDeleted = false;

            apiService.post("eAxisAPI", appConfig.Entities.TypeMaster.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    if (_response.OtherConfig) {
                        if (typeof _response.OtherConfig == "object") {
                            _response.OtherConfig = JSON.stringify(_response.OtherConfig);
                        }
                    }
                    var _indexTypeCode = ManageParameterCtrl.ePage.Masters.ManageParametersListType.ListSource.map(function (e) {
                        return e;
                    }).indexOf(_response.TypeCode);

                    if (_indexTypeCode !== -1) {
                        ManageParameterCtrl.ePage.Masters.ManageParametersListType.ActiveManageParametersListType = _response.TypeCode;
                        OnManageParametersListTypeClick(_response.TypeCode);

                        $timeout(function () {
                            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = angular.copy(_response);
                            var _index = ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource.map(function (e) {
                                return e.PK;
                            }).indexOf(_response.PK);

                            if (_index === -1) {
                                ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource.push(_response);
                            } else {
                                ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource[_index] = _response;
                            }

                            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.EditModal.dismiss('cancel');
                        }, 1000);
                    } else {
                        ManageParameterCtrl.ePage.Masters.ManageParametersListType.ActiveManageParametersListType = _response.TypeCode;
                        ManageParameterCtrl.ePage.Masters.ManageParametersListType.ListSource.push(_response.TypeCode);

                        ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource = [];
                        ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = angular.copy(_response);
                        ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource.push(_response);

                        ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.EditModal.dismiss('cancel');
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.SaveBtnText = "OK";
                ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.IsDisableSaveBtn = false;
            });
        }

        function Cancel() {
            if (!ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList) {
                if (ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource.length > 0) {
                    ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = angular.copy(ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource[0]);
                } else {
                    ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = undefined;
                }
            } else if (ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeListCopy) {
                var _index = ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeListCopy.PK);

                if (_index !== -1) {
                    ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = angular.copy(ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource[_index]);
                }
            }
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.EditModal.dismiss('cancel');
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
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.DeleteBtnText = "Please Wait...";
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.IsDisableDeleteBtn = true;

            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList.IsModified = true;
            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList.IsDeleted = true;

            var _input = [ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList];

            apiService.post("eAxisAPI", appConfig.Entities.TypeMaster.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource.map(function (e) {
                        return e.PK
                    }).indexOf(ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList.PK);

                    if (_index !== -1) {
                        ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource.splice(_index, 1);

                        if (ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource.length > 0) {
                            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = angular.copy(ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ListSource[0]);
                        } else {
                            ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList = undefined;

                            var _typeIndex = ManageParameterCtrl.ePage.Masters.ManageParametersListType.ListSource.indexOf(ManageParameterCtrl.ePage.Masters.ManageParametersListType.ActiveManageParametersListType);
                            if (_typeIndex !== -1) {
                                ManageParameterCtrl.ePage.Masters.ManageParametersListType.ListSource.splice(_typeIndex, 1);
                                ManageParameterCtrl.ePage.Masters.ManageParametersListType.ActiveManageParametersListType = ManageParameterCtrl.ePage.Masters.ManageParametersListType.ListSource[0];

                                OnManageParametersListTypeClick(ManageParameterCtrl.ePage.Masters.ManageParametersListType.ActiveManageParametersListType);
                            }
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.DeleteBtnText = "Delete";
                ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal(objName) {
            var _json = ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList[objName];
            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList[objName]
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                ManageParameterCtrl.ePage.Masters.ManageParametersListTypeList.ActiveManageParametersListTypeList[objName] = result;
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

        Init();
    }
})();
