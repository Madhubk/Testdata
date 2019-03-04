(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCRelatedLookupController", TCRelatedLookupController);

    TCRelatedLookupController.$inject = ["$location", "$uibModal", "$scope", "helperService", "authService", "apiService", "confirmation", "toastr", "jsonEditModal", "trustCenterConfig"];

    function TCRelatedLookupController($location, $uibModal, $scope, helperService, authService, apiService, confirmation, toastr, jsonEditModal, trustCenterConfig) {
        var TCRelatedLookupCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCRelatedLookupCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_RelatedLookup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            TCRelatedLookupCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCRelatedLookupCtrl.ePage.Masters.emptyText = "-";
            try {
                TCRelatedLookupCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCRelatedLookupCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitRelatedLookup();
                }
            } catch (error) {
                console.log(error);
            }
        }

        /* region Breadcrumb */
        function InitBreadcrumb() {
            TCRelatedLookupCtrl.ePage.Masters.Breadcrumb = {};
            TCRelatedLookupCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCRelatedLookupCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCRelatedLookupCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCRelatedLookupCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCRelatedLookupCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "RelatedLookup",
                Description: "Related Lookup",
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
        /*  endregion */

        function InitApplication() {
            TCRelatedLookupCtrl.ePage.Masters.Application = {};
            TCRelatedLookupCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            if (TCRelatedLookupCtrl.ePage.Masters.QueryString.DataEntry_PK) {
                TCRelatedLookupCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCRelatedLookupCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCRelatedLookupCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCRelatedLookupCtrl.ePage.Masters.QueryString.AppName
                };
            } else {
                TCRelatedLookupCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

                if (!TCRelatedLookupCtrl.ePage.Masters.Application.ActiveApplication) {
                    TCRelatedLookupCtrl.ePage.Masters.Application.ActiveApplication = {
                        "PK": TCRelatedLookupCtrl.ePage.Masters.QueryString.AppPk,
                        "AppCode": TCRelatedLookupCtrl.ePage.Masters.QueryString.AppCode,
                        "AppName": TCRelatedLookupCtrl.ePage.Masters.QueryString.AppName
                    };
                }
            }

            if (TCRelatedLookupCtrl.ePage.Masters.Application.ActiveApplication) {
                GetDataEntryMasterList();
                // if (TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.DataEntryMasterList) {
                //     GetRelatedLookupList();
                // }
            }
        }

        /*  region Related lookup */
        function InitRelatedLookup() {
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup = {};
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.OnDataEntryMasterChange = OnDataEntryMasterChange;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.OnRelatedLookupClick = OnRelatedLookupClick;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.AddNew = AddNew;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.Cancel = Cancel;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.Save = Save;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.Edit = Edit;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.Delete = DeleteConfirmation;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.OnLookupPageChange = OnLookupPageChange;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.OpenJsonModal = OpenJsonModal;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.OnSelectAutoCompleteList = OnSelectAutoCompleteList;

            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.SaveBtnText = "OK";
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.IsDisableSaveBtn = false;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.DeleteBtnText = "Delete";
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.IsDisableDeleteBtn = false;
        }

        function GetDataEntryMasterList() {
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.DataEntryMasterList = undefined;
            var _filter = {
                "SAP_FK": TCRelatedLookupCtrl.ePage.Masters.Application.ActiveApplication.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataEntryMaster.API.FindAllColumn.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataEntryMaster.API.FindAllColumn.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.DataEntryMasterListForEdit = angular.copy(response.data.Response);

                    if (TCRelatedLookupCtrl.ePage.Masters.QueryString.DataEntry_PK) {
                        var _obj = {
                            DataEntry_PK: TCRelatedLookupCtrl.ePage.Masters.QueryString.DataEntry_PK,
                            DataEntryName: TCRelatedLookupCtrl.ePage.Masters.QueryString.DataEntryName,
                            EntityRefCode: TCRelatedLookupCtrl.ePage.Masters.QueryString.EntityRefCode,
                            EntityRefKey: TCRelatedLookupCtrl.ePage.Masters.QueryString.EntityRefKey,
                            EntitySource: TCRelatedLookupCtrl.ePage.Masters.QueryString.EntitySource
                        };
                        TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.DataEntryMasterList = angular.copy([_obj]);
                        OnDataEntryMasterChange(_obj);
                    } else {
                        TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.DataEntryMasterList = angular.copy(response.data.Response);
                        OnDataEntryMasterChange();
                    }
                }
            });
        }

        function OnDataEntryMasterChange($item) {
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveDataEntryMaster = angular.copy($item);

            if (TCRelatedLookupCtrl.ePage.Masters.Application.ActiveApplication) {
                GetRelatedLookupList();
            }
        }

        function GetRelatedLookupList() {
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource = undefined;
            var _filter = {
                SAP_FK: TCRelatedLookupCtrl.ePage.Masters.Application.ActiveApplication.PK
            };

            (TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveDataEntryMaster) ? _filter.PageFK = TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveDataEntryMaster.DataEntry_PK:
                _filter.PageFK_Null = "NULL";

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DYN_RelatedLookup.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DYN_RelatedLookup.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource = angular.copy(response.data.Response);
                    if (TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource.length > 0) {
                        OnRelatedLookupClick(TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource[0]);
                    } else {
                        OnRelatedLookupClick();
                    }
                } else {
                    TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource = [];
                }
            });
        }

        function OnRelatedLookupClick($item) {
            if ($item) {
                if ($item.PageFK) {
                    var _index = $item.PageFK.indexOf(",");
                    if (_index != -1) {
                        $item.PageFK = $item.PageFK.split(",");
                    } else {
                        $item.PageFK = [$item.PageFK];
                    }
                }
            }

            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup = angular.copy($item);
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookupCopy = angular.copy($item);

            if (TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup) {
                TCRelatedLookupCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "DYN_RelatedLookup",
                    ObjectId: TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup.PK
                };
                TCRelatedLookupCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function AddNew() {
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup = {};

            Edit();
        }

        function Edit() {
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.SaveBtnText = "Ok";
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function EditModalInstance() {
            return TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'relatedLookupEdit'"></div>`
            });
        }

        function Cancel() {
            if (!TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup) {
                if (TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource.length > 0) {
                    TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup = angular.copy(TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource[0]);
                } else {
                    TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup = undefined;
                }
            } else if (TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookupCopy) {
                var _index = TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookupCopy.PK);

                if (_index !== -1) {
                    TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup = angular.copy(TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource[_index]);
                }
            } else if (!TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookupCopy) {
                TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup = undefined;
            }

            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.EditModal.dismiss('cancel');
        }

        function Save() {
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.SaveBtnText = "Please Wait...";
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.IsDisableSaveBtn = true;

            var _input = angular.copy(TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup);
            _input.IsModified = true;
            _input.SAP_FK = TCRelatedLookupCtrl.ePage.Masters.Application.ActiveApplication.PK;

            if (_input.PageFK) {
                if (_input.PageFK.length > 0) {
                    _input.pageName = [];
                    _input.PageFK.map(function (value1, key1) {
                        TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.DataEntryMasterList.map(function (value2, key2) {
                            if (value1 == value2.DataEntry_PK) {
                                _input.pageName.push(value2.DataEntryName);
                            }
                        });
                    });
                    _input.pageName = _input.pageName.join(",");
                    _input.PageFK = _input.PageFK.join(",");
                } else {
                    _input.pageName = undefined;
                    _input.PageFK = undefined;
                }
            }

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DYN_RelatedLookup.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
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
                        TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup = angular.copy(_response);

                        var _index = TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource.map(function (e) {
                            return e.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource.push(_response);
                        } else {
                            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource[_index] = _response;
                        }
                        OnRelatedLookupClick(TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup);
                    }
                } else {
                    OnRelatedLookupClick();
                    toastr.error("Could not Save...!");
                }

                TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.SaveBtnText = "OK";
                TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.IsDisableSaveBtn = false;
                TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.EditModal.dismiss('cancel');
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
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.DeleteBtnText = "Please Wait...";
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.IsDisableDeleteBtn = true;

            var _input = angular.copy(TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup);
            _input.IsModified = true;
            _input.IsDeleted = true;

            if (_input.PageFK) {
                if (typeof _input.PageFK == "object") {
                    _input.PageFK = _input.PageFK.join(",");
                }
            }
            if (_input.pageName) {
                if (typeof _input.pageName == "object") {
                    _input.pageName = _input.pageName.join(",");
                }
            }

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DYN_RelatedLookup.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup.PK);

                    if (_index !== -1) {
                        TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource.splice(_index, 1);

                        if (TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource.length > 0) {
                            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup = angular.copy(TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ListSource[0]);
                        } else {
                            OnRelatedLookupClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.DeleteBtnText = "Delete";
                TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.IsDisableDeleteBtn = false;
            });
        }

        function OnLookupPageChange($item) {
            if ($item) {
                TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup.LookPageFK = $item.DataEntry_PK;
                TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup.LookupPageName = $item.DataEntryName;
            } else {
                TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup.LookPageFK = undefined;
                TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup.LookupPageName = undefined;
            }
        }

        function OpenJsonModal(ngModel) {
            var _attributeJson = TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup[ngModel];

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
                            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup[ngModel] = _attributeJson;
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

        function OnSelectAutoCompleteList($item, $model, $label, $event) {
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup.LookPageFK = $item.DataEntry_PK;
            TCRelatedLookupCtrl.ePage.Masters.RelatedLookup.ActiveRelatedLookup.LookupPageName = $item.DataEntryName;
        }
        Init();
    }
})();
