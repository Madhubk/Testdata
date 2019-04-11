(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCUIRestrictionsController", TCUIRestrictionsController);

    TCUIRestrictionsController.$inject = ["$location", "$uibModal", "$scope", "helperService", "authService", "apiService", "confirmation", "toastr", "jsonEditModal", "trustCenterConfig"];

    function TCUIRestrictionsController($location, $uibModal, $scope, helperService, authService, apiService, confirmation, toastr, jsonEditModal, trustCenterConfig) {
        var TCUIRestrictionsCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCUIRestrictionsCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_UIRestrictions",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            TCUIRestrictionsCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCUIRestrictionsCtrl.ePage.Masters.emptyText = "-";
            try {
                TCUIRestrictionsCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCUIRestrictionsCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitUIRestrictions();
                }
            } catch (error) {
                console.log(error);
            }
        }

        //   #region Breadcrumb
        function InitBreadcrumb() {
            TCUIRestrictionsCtrl.ePage.Masters.Breadcrumb = {};
            TCUIRestrictionsCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCUIRestrictionsCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCUIRestrictionsCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUIRestrictionsCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUIRestrictionsCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "page",
                Description: "Page",
                Link: "TC/page",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCUIRestrictionsCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUIRestrictionsCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUIRestrictionsCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "UIRestrictions",
                Description: "UI Restrictions",
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
        //   #endregion

        function InitUIRestrictions() {
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions = {};
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.OnDataEntryMasterChange = OnDataEntryMasterChange;
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.OnUIRestrictionsClick = OnUIRestrictionsClick;
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.AddNew = AddNew;
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.Cancel = Cancel;
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.Save = Save;
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.Edit = Edit;
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.Delete = DeleteConfirmation;
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.OpenJsonModal = OpenJsonModal;

            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.SaveBtnText = "OK";
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.IsDisableSaveBtn = false;
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.DeleteBtnText = "Delete";
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.IsDisableDeleteBtn = false;

            GetDataEntryMasterList();
        }

        function GetDataEntryMasterList() {
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.DataEntryMasterList = undefined;
            var _filter = {
                "SAP_FK": TCUIRestrictionsCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataEntryMaster.API.FindAllColumn.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataEntryMaster.API.FindAllColumn.Url, _input).then(function (response) {
                if (response.data.Response && response.data.Response.length > 0) {
                    TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.DataEntryMasterList = response.data.Response;

                    if (TCUIRestrictionsCtrl.ePage.Masters.QueryString.DataEntry_PK) {
                        let _index = TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.DataEntryMasterList.findIndex(value => value.DataEntry_PK == TCUIRestrictionsCtrl.ePage.Masters.QueryString.DataEntry_PK);

                        if (_index != -1) {
                            OnDataEntryMasterChange(TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.DataEntryMasterList[_index]);
                        } else {
                            OnDataEntryMasterChange();
                        }
                    } else {
                        OnDataEntryMasterChange();
                    }
                } else {
                    TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.DataEntryMasterList = [];
                }
            });
        }

        function OnDataEntryMasterChange($item) {
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveDataEntryMaster = angular.copy($item);

            GetUIRestrictionsList();
        }

        function GetUIRestrictionsList() {
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource = undefined;
            var _filter = {};

            (TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveDataEntryMaster) ? _filter.DEM_DataEntry_PK = TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveDataEntryMaster.DataEntry_PK:
                _filter.PageFK_Null = "NULL";

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DYNUIRestriction.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DYNUIRestriction.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource = angular.copy(response.data.Response);
                    if (TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource.length > 0) {
                        OnUIRestrictionsClick(TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource[0]);
                    } else {
                        OnUIRestrictionsClick();
                    }
                } else {
                    TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource = [];
                }
            });
        }

        function OnUIRestrictionsClick($item) {
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions = angular.copy($item);
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictionsCopy = angular.copy($item);

            if (TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions) {
                TCUIRestrictionsCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "DYNUIRestrictions",
                    ObjectId: TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions.PK
                };
                TCUIRestrictionsCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function AddNew() {
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions = {};

            Edit();
        }

        function Edit() {
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.SaveBtnText = "Ok";
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.IsDisableSaveBtn = false;

            EditModalInstance().result.then(response => {}, () => Cancel());
        }

        function EditModalInstance() {
            return TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'UIRestrictionsEdit'"></div>`
            });
        }

        function Cancel() {
            if (!TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions) {
                if (TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource.length > 0) {
                    TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions = angular.copy(TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource[0]);
                } else {
                    TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions = undefined;
                }
            } else if (TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictionsCopy) {
                var _index = TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictionsCopy.PK);

                if (_index !== -1) {
                    TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions = angular.copy(TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource[_index]);
                }
            } else if (!TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictionsCopy) {
                TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions = undefined;
            }

            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.EditModal.dismiss('cancel');
        }

        function Save() {
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.SaveBtnText = "Please Wait...";
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.IsDisableSaveBtn = true;

            let _api;
            let _input = angular.copy(TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions);
            _input.DEM_DataEntry_PK = TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveDataEntryMaster.DataEntry_PK;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.IsModified = true;

            if (_input.PK) {
                _api = "Update";
                _input = _input;
            } else {
                _api = "Insert";
                _input = [_input];
            }

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DYNUIRestriction.API[_api].Url, _input).then(response => {
                if (response.data.Response) {
                    let _response;
                    if (_input.PK) {
                        _response = response.data.Response;
                    } else {
                        _response = response.data.Response[0];
                    }

                    TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions = angular.copy(_response);

                    let _index = TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource.findIndex(e => e.PK == _response.PK);

                    if (_index === -1) {
                        TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource.push(_response);
                    } else {
                        TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource[_index] = _response;
                    }
                    OnUIRestrictionsClick(TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions);
                } else {
                    OnUIRestrictionsClick();
                    toastr.error("Could not Save...!");
                }

                TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.SaveBtnText = "OK";
                TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.IsDisableSaveBtn = false;
                TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.EditModal.dismiss('cancel');
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
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.DeleteBtnText = "Please Wait...";
            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.IsDisableDeleteBtn = true;

            let _input = angular.copy(TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions);

            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DYNUIRestriction.API.Delete.Url + _input.PK).then(response => {
                if (response.data.Status == "Success") {
                    let _index = TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource.findIndex(value => value.PK === _input.PK);

                    if (_index !== -1) {
                        TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource.splice(_index, 1);

                        if (TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource.length > 0) {
                            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions = angular.copy(TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ListSource[0]);
                        } else {
                            OnUIRestrictionsClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.DeleteBtnText = "Delete";
                TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal(ngModel) {
            var _attributeJson = TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions[ngModel];

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
                            TCUIRestrictionsCtrl.ePage.Masters.UIRestrictions.ActiveUIRestrictions[ngModel] = _attributeJson;
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

        Init();
    }
})();
