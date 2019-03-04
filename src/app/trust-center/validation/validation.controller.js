(function () {
    "use strict";

    angular.module("Application")
        .controller("ValidationController", ValidationController);

    ValidationController.$inject = ["$location", "$uibModal", "$scope", "authService", "helperService", "trustCenterConfig", "apiService", "confirmation", "toastr", "jsonEditModal"];

    function ValidationController($location, $uibModal, $scope, authService, helperService, trustCenterConfig, apiService, confirmation, toastr, jsonEditModal) {
        var ValidationCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ValidationCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Validation",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ValidationCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            ValidationCtrl.ePage.Masters.emptyText = "-";

            try {
                ValidationCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ValidationCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitModule();
                    InitValidation();
                    InitValidationGroup();
                    InitValidationGroupMapping();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb========================
        function InitBreadcrumb() {
            ValidationCtrl.ePage.Masters.Breadcrumb = {};
            ValidationCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            ValidationCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": ValidationCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ValidationCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ValidationCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "validation",
                Description: "Validation",
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

        // ========================Application========================
        function InitApplication() {
            ValidationCtrl.ePage.Masters.Application = {};
            ValidationCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            ValidationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!ValidationCtrl.ePage.Masters.Application.ActiveApplication) {
                ValidationCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": ComponentCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ComponentCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ComponentCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetRedirectLinkList();
            GetValidationGroupList();

            if (ValidationCtrl.ePage.Masters.ActiveModule) {
                GetValidationList();
            }
        }

        // ========================Module========================
        function InitModule() {
            ValidationCtrl.ePage.Masters.OnModuleChange = OnModuleChange;

            GetModuleList();
        }

        function GetModuleList() {
            ValidationCtrl.ePage.Masters.ModuleList = undefined;
            var _filter = {
                TypeCode: "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    ValidationCtrl.ePage.Masters.ModuleList = response.data.Response;
                } else {
                    ValidationCtrl.ePage.Masters.ModuleList = [];
                }
            });
        }

        function OnModuleChange($item) {
            ValidationCtrl.ePage.Masters.ActiveModule = angular.copy($item);

            if (!ValidationCtrl.ePage.Masters.ActiveModule) {
                ValidationCtrl.ePage.Masters.ActiveModule = {};
            }

            GetValidationList();
        }

        // ========================Validation========================
        function InitValidation() {
            ValidationCtrl.ePage.Masters.Validation = {};
            ValidationCtrl.ePage.Masters.Validation.OnValidataionClick = OnValidataionClick;
            ValidationCtrl.ePage.Masters.Validation.AddNew = AddNew;
            ValidationCtrl.ePage.Masters.Validation.Delete = DeleteConfirmation;
            ValidationCtrl.ePage.Masters.Validation.Edit = Edit;
            ValidationCtrl.ePage.Masters.Validation.Cancel = Cancel;
            ValidationCtrl.ePage.Masters.Validation.Save = Save;
            ValidationCtrl.ePage.Masters.Validation.OpenJsonModal = OpenJsonModal;

            ValidationCtrl.ePage.Masters.Validation.ListSource = [];
        }

        function GetValidationList() {
            ValidationCtrl.ePage.Masters.Validation.ListSource = undefined;
            var _filter = {
                "SAP_FK": ValidationCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "TenantCode": authService.getUserInfo().TenantCode
            };

            if (ValidationCtrl.ePage.Masters.ActiveModule) {
                _filter.ModuleCode = ValidationCtrl.ePage.Masters.ActiveModule.Key;
            }

            if (ValidationCtrl.ePage.Masters.ValidationGroup.ActiveValidationGroup) {
                _filter.VLG_FK = ValidationCtrl.ePage.Masters.ValidationGroup.ActiveValidationGroup.PK;
                _filter.VLG_Code = ValidationCtrl.ePage.Masters.ValidationGroup.ActiveValidationGroup.GroupName;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.Validation.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.Validation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ValidationCtrl.ePage.Masters.Validation.ListSource = angular.copy(response.data.Response);

                    if (ValidationCtrl.ePage.Masters.Validation.ListSource.length > 0) {
                        OnValidataionClick(ValidationCtrl.ePage.Masters.Validation.ListSource[0]);
                    } else {
                        OnValidataionClick();
                    }
                } else {
                    ValidationCtrl.ePage.Masters.Validation.ListSource = [];
                }
            });
        }

        function OnValidataionClick($item) {
            ValidationCtrl.ePage.Masters.Validation.ActiveValidataion = angular.copy($item);
            ValidationCtrl.ePage.Masters.Validation.ActiveValidataionCopy = angular.copy($item);

            if (ValidationCtrl.ePage.Masters.Validation.ActiveValidataion) {
                ValidationCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "Validation",
                    ObjectId: ValidationCtrl.ePage.Masters.Validation.ActiveValidataion.PK
                };
                ValidationCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function AddNew() {
            ValidationCtrl.ePage.Masters.Validation.ActiveValidataion = {
                ModuleCode: ValidationCtrl.ePage.Masters.ActiveModule.Key
            };
            Edit();
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
            ValidationCtrl.ePage.Masters.Validation.DeleteBtnText = "Please Wait...";
            ValidationCtrl.ePage.Masters.Validation.IsDisableDeleteBtn = true;

            var _input = angular.copy(ValidationCtrl.ePage.Masters.Validation.ActiveValidataion);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.Validation.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = ValidationCtrl.ePage.Masters.Validation.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(ValidationCtrl.ePage.Masters.Validation.ActiveValidataion.PK);

                    if (_index !== -1) {
                        ValidationCtrl.ePage.Masters.Validation.ListSource.splice(_index, 1);

                        if (ValidationCtrl.ePage.Masters.Validation.ListSource.length > 0) {
                            ValidationCtrl.ePage.Masters.Validation.ActiveValidataion = angular.copy(ValidationCtrl.ePage.Masters.Validation.ListSource[0]);
                        } else {
                            OnValidataionClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                ValidationCtrl.ePage.Masters.Validation.DeleteBtnText = "Delete";
                ValidationCtrl.ePage.Masters.Validation.IsDisableDeleteBtn = false;
            });
        }

        function Edit() {
            ValidationCtrl.ePage.Masters.Validation.SaveBtnText = "Ok";
            ValidationCtrl.ePage.Masters.Validation.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function EditModalInstance() {
            return ValidationCtrl.ePage.Masters.Validation.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'editValidation'"></div>`
            });
        }

        function Cancel() {
            if (!ValidationCtrl.ePage.Masters.Validation.ActiveValidataion) {
                if (ValidationCtrl.ePage.Masters.Validation.ListSource.length > 0) {
                    ValidationCtrl.ePage.Masters.Validation.ActiveValidataion = angular.copy(ValidationCtrl.ePage.Masters.Validation.ListSource[0]);
                } else {
                    ValidationCtrl.ePage.Masters.Validation.ActiveValidataion = undefined;
                }
            } else if (ValidationCtrl.ePage.Masters.Validation.ActiveValidataionCopy) {
                var _index = ValidationCtrl.ePage.Masters.Validation.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(ValidationCtrl.ePage.Masters.Validation.ActiveValidataionCopy.PK);

                if (_index !== -1) {
                    ValidationCtrl.ePage.Masters.Validation.ActiveValidataion = angular.copy(ValidationCtrl.ePage.Masters.Validation.ListSource[_index]);
                }
            } else if (!ValidationCtrl.ePage.Masters.Validation.ActiveValidataionCopy) {
                ValidationCtrl.ePage.Masters.Validation.ActiveValidataion = undefined;
            }

            ValidationCtrl.ePage.Masters.Validation.EditModal.dismiss('cancel');
        }

        function Save() {
            ValidationCtrl.ePage.Masters.Validation.SaveBtnText = "Please Wait...";
            ValidationCtrl.ePage.Masters.Validation.IsDisableSaveBtn = true;

            var _input = angular.copy(ValidationCtrl.ePage.Masters.Validation.ActiveValidataion);
            _input.IsModified = true;
            _input.SAP_FK = ValidationCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.TenantCode = authService.getUserInfo().TenantCode;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.Validation.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        if (_response.PageFK) {
                            var _index = _response.PageFK.indexOf(",");
                            if (_index != -1) {
                                _response.PageFK = _response.PageFK.split(",");
                            } else {
                                _response.PageFK = [_response.PageFK];
                            }
                        }
                        ValidationCtrl.ePage.Masters.Validation.ActiveValidataion = angular.copy(_response);

                        var _index = ValidationCtrl.ePage.Masters.Validation.ListSource.map(function (e) {
                            return e.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            ValidationCtrl.ePage.Masters.Validation.ListSource.push(_response);
                        } else {
                            ValidationCtrl.ePage.Masters.Validation.ListSource[_index] = _response;
                        }

                        OnValidataionClick(ValidationCtrl.ePage.Masters.Validation.ActiveValidataion);
                    }
                } else {
                    OnValidataionClick();
                    toastr.error("Could not Save...!");
                }

                ValidationCtrl.ePage.Masters.Validation.SaveBtnText = "OK";
                ValidationCtrl.ePage.Masters.Validation.IsDisableSaveBtn = false;
                ValidationCtrl.ePage.Masters.Validation.EditModal.dismiss('cancel');
            });
        }

        function OpenJsonModal(ngModel) {
            var _attributeJson = ValidationCtrl.ePage.Masters.Validation.ActiveValidataion[ngModel];

            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    var modalDefaults = {
                        resolve: {
                            param: function () {
                                var exports = {
                                    "Data": _attributeJson
                                };
                                return exports;
                            }
                        }
                    };
                    jsonEditModal.showModal(modalDefaults, {})
                        .then(function (result) {
                            var _attributeJson = result;
                            ValidationCtrl.ePage.Masters.Validation.ActiveValidataion[ngModel] = _attributeJson;
                        }, function () {
                            console.log("Cancelled");
                        });
                } catch (error) {
                    toastr.warning("Value Should be JSON format...!");
                }
            } else {
                toastr.warning("Value Should not be Empty...!");
            }
        }

        // ========================Validation Group========================
        function InitValidationGroup() {
            ValidationCtrl.ePage.Masters.ValidationGroup = {};
            ValidationCtrl.ePage.Masters.ValidationGroup.OpenValidationGrouptModal = OpenValidationGrouptModal;
            ValidationCtrl.ePage.Masters.ValidationGroup.OnValidationGroupChange = OnValidationGroupChange;
        }

        function GetValidationGroupList() {
            ValidationCtrl.ePage.Masters.ValidationGroup.ListSource = undefined;
            var _filter = {
                SAP_FK: ValidationCtrl.ePage.Masters.Application.ActiveApplication.PK,
                TenantCode: authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.ValidationGroup.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.ValidationGroup.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ValidationCtrl.ePage.Masters.ValidationGroup.ListSource = response.data.Response;
                } else {
                    ValidationCtrl.ePage.Masters.ValidationGroup.ListSource = [];
                }
            });
        }

        function OnValidationGroupChange($item) {
            ValidationCtrl.ePage.Masters.ValidationGroup.ActiveValidationGroup = angular.copy($item);

            if (!ValidationCtrl.ePage.Masters.ValidationGroup.ActiveValidationGroup) {
                ValidationCtrl.ePage.Masters.ValidationGroup.ActiveValidationGroup = {};
            }

            GetValidationList();
        }

        function OpenValidationGrouptModal() {
            return ValidationCtrl.ePage.Masters.ValidationGroup.OpenValidationGroupModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "validation-group-container right",
                scope: $scope,
                templateUrl: "app/trust-center/validation/validation-group/validation-group.html",
                controller: 'TCValidationGroupController',
                controllerAs: "TCValidationGroupCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "ActiveApplication": ValidationCtrl.ePage.Masters.Application.ActiveApplication,
                        };
                        return exports;
                    }
                }
            });
        }

        function GetRedirectLinkList() {
            ValidationCtrl.ePage.Masters.Validation.RedirectPagetList = [{
                Code: "Group",
                Description: "Group Mapping",
                Icon: "fa fa-sign-in",
                Color: "#bd081c"
            }];
        }

        function InitValidationGroupMapping() {
            ValidationCtrl.ePage.Masters.ValidationGroupMapping = {};
            ValidationCtrl.ePage.Masters.ValidationGroupMapping.OpenValidationGroupMappingModal = OpenValidationGroupMappingModal;
        }

        function OpenValidationGroupMappingModal() {
            return ValidationCtrl.ePage.Masters.ValidationGroupMapping.ValidationGroupMappingModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "validation-group-mapping right",
                scope: $scope,
                templateUrl: "app/trust-center/validation/validation-group-mapping/validation-group-mapping.html",
                controller: 'TCValidationGroupMappingController',
                controllerAs: "TCValidationGroupMappingCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var _input = {
                            _filter: {
                                PK: ValidationCtrl.ePage.Masters.Validation.ActiveValidataion.PK,
                                Code: ValidationCtrl.ePage.Masters.Validation.ActiveValidataion.Code
                            },
                            ActiveApplication: ValidationCtrl.ePage.Masters.Application.ActiveApplication
                        };
                        return _input;
                    }
                }
            });
        }

        Init();
    }
})();