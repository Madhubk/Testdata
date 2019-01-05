(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DataExtFullTextSearchController", DataExtFullTextSearchController);

    DataExtFullTextSearchController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "jsonEditModal", "trustCenterConfig"];

    function DataExtFullTextSearchController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var DataExtFullTextSearchCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            DataExtFullTextSearchCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_DataExtFullTextSearch",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DataExtFullTextSearchCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            DataExtFullTextSearchCtrl.ePage.Masters.emptyText = "-";

            try {
                DataExtFullTextSearchCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (DataExtFullTextSearchCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitDataExtFullTextSearch();
                    InitDataExtFullTextSearchFields();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            DataExtFullTextSearchCtrl.ePage.Masters.Breadcrumb = {};
            DataExtFullTextSearchCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = " (Full Text Search)";

            DataExtFullTextSearchCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": DataExtFullTextSearchCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtFullTextSearchCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtFullTextSearchCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "DataExtFullTextSearch",
                Description: "Data Extraction" + _breadcrumbTitle,
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
            DataExtFullTextSearchCtrl.ePage.Masters.Application = {};
            DataExtFullTextSearchCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            DataExtFullTextSearchCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!DataExtFullTextSearchCtrl.ePage.Masters.Application.ActiveApplication) {
                DataExtFullTextSearchCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": DataExtFullTextSearchCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtFullTextSearchCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtFullTextSearchCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetDataExtFullTextSearchList();
        }

        function InitDataExtFullTextSearch() {

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch = {};

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.CloseDataExtFullTextSearchModal = CloseDataExtFullTextSearchModal;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.AddNew = AddNewDataExtFullTextSearch;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.Edit = EditDataExtFullTextSearch;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.Save = SaveDataExtFullTextSearch;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.Delete = DeleteDataExtFullTextSearchConfirmation;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.OnDataExtFullTextSearchClick = OnDataExtFullTextSearchClick;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.OpenJsonModal = OpenJsonModal;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.GetTargetTableList = GetTargetTableList;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.OnTargetTableSelect = OnTargetTableSelect;

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.SaveBtnText = "OK";
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.IsDisableSaveBtn = false;

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DeleteBtnText = "Delete";
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.IsDisableDeleteBtn = false;
        }

        function GetDataExtFullTextSearchList() {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList = undefined;
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": DataExtFullTextSearchCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": DataExtFullTextSearchCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "ConfigType": "FullTextSearch"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfig.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList = response.data.Response;

                    if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList.length > 0) {
                        OnDataExtFullTextSearchClick(DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList[0]);
                    } else {
                        OnDataExtFullTextSearchClick();
                    }
                } else {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList = [];
                    OnDataExtFullTextSearchClick();
                }
            });
        }

        function OnDataExtFullTextSearchClick($item) {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch = angular.copy($item);
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearchCopy = angular.copy($item);

            if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch) {
                GetDataExtFullTextSearchFieldsList();
                GetFieldList();
            }
        }

        function AddNewDataExtFullTextSearch() {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch = {
                ConfigType: "FullTextSearch"
            };

            EditDataExtFullTextSearch();
        }

        function EditDataExtFullTextSearchModalInstance() {
            return DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.EditDataExtFullTextSearchModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dataExtFullTextSearchEdit'"></div>`
            });
        }

        function EditDataExtFullTextSearch() {
            if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.PK) {
                if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.UIEntityName) {
                    var _obj = {
                        Name: DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.UIEntityName
                    };
                    GetTargetFieldList(_obj);
                }
            }
            EditDataExtFullTextSearchModalInstance().result.then(function (response) {}, function () {
                CloseDataExtFullTextSearchModal();
            });

        }

        function CloseDataExtFullTextSearchModal() {
            if (!DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch) {
                if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList.length > 0) {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch = angular.copy(DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFulllTextSearchList[0]);
                } else {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch = undefined;
                }
            } else if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearchCopy) {
                var _index = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearchCopy.PK);

                if (_index !== -1) {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch = angular.copy(DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList[_index]);
                }
            }

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.EditDataExtFullTextSearchModal.dismiss('cancel');
        }

        function DeleteDataExtFullTextSearchConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteDataExtFullTextSearch();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteDataExtFullTextSearch() {
            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Delete.Url + DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.PK);

                    if (_index !== -1) {
                        DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList.splice(_index, 1);
                        if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList.length > 0) {
                            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch = angular.copy(DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList[0]);
                        } else {
                            OnDataExtFullTextSearchClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                GetDataExtFullTextSearchList();

                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DeleteBtnText = "Delete";
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal() {
            var _attributeJson = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.Fields;
            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    if (typeof JSON.parse(_attributeJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.Fields
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.Fields = result;
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

        function GetTargetTableList($viewValue) {
            var _filter = {
                "Name": $viewValue
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.Table.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.Table.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnTargetTableSelect($item, $model, $label, $event) {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.ClassSource = $item.Name;
            if ($item) {
                GetTargetFieldList($item);
            }
        }

        function GetTargetFieldList($item) {
            var _filter = {
                "TableName": $item.Name
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.TargetFieldList = response.data.Response;
                } else {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.TargetFieldList = [];
                }
            });
        }

        function SaveDataExtFullTextSearch() {
            if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.PK) {
                UpdateDataExtFullTextSearch();
            } else {
                InsertDataExtFullTextSearch();
            }
        }

        function InsertDataExtFullTextSearch() {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.SaveBtnText = "Please Wait...";
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.IsDisableSaveBtn = true;

            var _input = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch;
            _input.IsModified = true;
            _input.SAP_FK = DataExtFullTextSearchCtrl.ePage.Masters.Application.ActiveApplication.PK;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList.push(_response);
                        } else {
                            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList[_index] = _response;
                        }

                        OnDataExtFullTextSearchClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.SaveBtnText = "OK";
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.IsDisableSaveBtn = false;
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.EditDataExtFullTextSearchModal.dismiss('cancel');
            });
        }

        function UpdateDataExtFullTextSearch() {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.SaveBtnText = "Please Wait...";
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.IsDisableSaveBtn = true;

            var _input = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch;
            _input.IsModified = true;
            _input.SAP_FK = DataExtFullTextSearchCtrl.ePage.Masters.Application.ActiveApplication.PK;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList.push(_response);
                    } else {
                        DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchList[_index] = _response;
                    }

                    OnDataExtFullTextSearchClick(_response);
                } else {
                    toastr.error("Could not Update...!");
                }

                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.SaveBtnText = "OK";
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.IsDisableSaveBtn = false;
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.EditDataExtFullTextSearchModal.dismiss('cancel');
            });
        }


        // ========= Full Text Search End ========== //

        // ========= FullText Search Fields Start======= //

        function InitDataExtFullTextSearchFields() {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields = {};

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ItemTypeList = ["Main", "Link"];
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.AddNewField = AddNewField;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.Edit = EditFullTextSearchConfigField;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.CloseFullTextSearchConfigFields = CloseFullTextSearchConfigFields;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.Save = FullTextSearchConfigFieldsSave;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.Delete = DeleteConfirmation;
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.OnDataExtFullTextSearchFieldsClick = OnDataExtFullTextSearchFieldsClick;

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.SaveBtnText = "Save";
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.IsDisableSaveBtn = false;

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.FieldNameList = [];

            // InitExpression();
            // InitRelatedInput();
            // InitUpdateRules();
        }

        function GetFieldList() {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.FieldNameList = undefined;
            var _filter = {
                "TableName": DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.ClassSource
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.FieldNameList = response.data.Response;
                } else {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.FieldNameList = [];
                }
            });
        }

        function GetDataExtFullTextSearchFieldsList() {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource = undefined;
            var _filter = {
                "DAC_ConfigType": "FullTextSearch",
                "DAC_FK": DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource = response.data.Response;
                    if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource.length > 0) {

                        OnDataExtFullTextSearchFieldsClick(DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource[0])
                    } else {
                        OnDataExtFullTextSearchFieldsClick();
                    }
                } else {
                    DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource = [];
                }
            });
        }

        function OnDataExtFullTextSearchFieldsClick($item) {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields = angular.copy($item);
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFieldsCopy = angular.copy($item);
        }

        function AddNewField($item, type) {

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields = {
                DAC_FK: DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.PK,
                DAC_ConfigType: "FullTextSearch",
                ExpressionType: "GENERAL",
                EntitySource: "GENERAL",
                EntityRefCode: "General"
            };

            if (type !== "Main") {
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields.Self_FK = $item.PK;
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields.ItemType = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ItemTypeList[1];
            } else {
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields.ItemType = "Main";
            }

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.FieldNameList = [];
            GetFieldList();

            EditFullTextSearchConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function EditFullTextSearchConfigField($item) {
            if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields.PK) {
                if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.ClassSource) {
                    var _obj = {
                        TableName: DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.ActiveDataExtFullTextSearch.ClassSource
                    };
                    GetFieldList(_obj);
                }
            }

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields = angular.copy($item);
            // if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields.ItemType.length > 0) {
            //     DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields.ItemType = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ItemTypeList[0];
            // }

            if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields.DAC_FK) {
                var _index = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields.DAC_FK);

                if (_index != -1) {

                    GetFieldList(DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource[_index])
                }
            }

            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.FieldNameList = [];
            EditFullTextSearchConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function EditFullTextSearchConfigModalInstance() {
            return DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dataExtFullTextSearchFields'"></div>`
            });
        }

        function CloseFullTextSearchConfigFields() {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.EditModal.dismiss('cancel');
        }

        function FullTextSearchConfigFieldsSave() {
            if (DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields.PK) {
                UpdateFullTextSearchConfigFields();
            } else {
                InsertFullTextSearchConfigFields();
            }
        }

        function InsertFullTextSearchConfigFields() {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.SaveBtnText = "Please Wait...";
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.IsDisableSaveBtn = true;

            var _input = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource.push(_response);
                        } else {
                            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource[_index] = _response;
                        }

                        OnDataExtFullTextSearchFieldsClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.SaveBtnText = "OK";
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.IsDisableSaveBtn = false;
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.EditModal.dismiss('cancel');
            });

        }

        function UpdateFullTextSearchConfigFields() {
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.SaveBtnText = "Please Wait...";
            DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.IsDisableSaveBtn = true;

            var _input = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.ActiveDataExtFullTextSearchFields;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource.push(_response);
                    } else {
                        DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.DataExtFullTextSearchFieldsListSource[_index] = _response;
                    }

                    OnDataExtFullTextSearchFieldsClick(_response);
                } else {
                    toastr.error("Could not Update...!");
                }

                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.SaveBtnText = "OK";
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.IsDisableSaveBtn = false;
                DataExtFullTextSearchCtrl.ePage.Masters.DataExtFullTextSearch.DataExtFullTextSearchFields.EditModal.dismiss('cancel');
            });

        }

        function DeleteConfirmation(item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    Delete(item);
                }, function () {
                    console.log("Cancelled");
                })
        }

        function Delete(item) {
            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Delete.Url + item.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    toastr.success("Record Deleted Successfully");
                    OnDataExtFullTextSearchFieldsClick(item);

                } else {
                    toastr.error("Could not Delete")
                }
                GetDataExtFullTextSearchFieldsList();
            });
        }


        // ================ Full Text Search Edit Fields End ======== //

        Init();
    }
})();