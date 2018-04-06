(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DataConfigController", DataConfigController);

    DataConfigController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation", "jsonEditModal"];

    function DataConfigController($scope, $location, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation, jsonEditModal) {
        /* jshint validthis: true */
        var DataConfigCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            DataConfigCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_DataConfig",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DataConfigCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            DataConfigCtrl.ePage.Masters.emptyText = "-";

            try {
                DataConfigCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (DataConfigCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitDataConfig();
                    InitDataConfigFields()
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            DataConfigCtrl.ePage.Masters.Breadcrumb = {};
            DataConfigCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (DataConfigCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + DataConfigCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")"
            }

            DataConfigCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                Code: "dataconfig",
                Description: "Data Config" + _breadcrumbTitle,
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

        function InitDataConfig() {
            DataConfigCtrl.ePage.Masters.DataConfig = {};
            DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig = {};
            DataConfigCtrl.ePage.Masters.FileType = {};

            DataConfigCtrl.ePage.Masters.DataConfig.Cancel = Cancel;
            DataConfigCtrl.ePage.Masters.DataConfig.AddNew = AddNew;
            DataConfigCtrl.ePage.Masters.DataConfig.Save = Save;
            DataConfigCtrl.ePage.Masters.DataConfig.Edit = Edit;
            DataConfigCtrl.ePage.Masters.DataConfig.DeleteConfirmation = DeleteConfirmation;
            DataConfigCtrl.ePage.Masters.DataConfig.Delete = Delete;
            DataConfigCtrl.ePage.Masters.DataConfig.OnDataConfigClick = OnDataConfigClick;
            DataConfigCtrl.ePage.Masters.DataConfig.OpenJsonModal = OpenJsonModal;
            DataConfigCtrl.ePage.Masters.DataConfig.AddNewLoad = AddNewLoad;

            DataConfigCtrl.ePage.Masters.DataConfig.SaveBtnText = "OK";
            DataConfigCtrl.ePage.Masters.DataConfig.IsDisableSaveBtn = false;

            DataConfigCtrl.ePage.Masters.DataConfig.DeleteBtnText = "Delete";
            DataConfigCtrl.ePage.Masters.DataConfig.IsDisableDeleteBtn = false;

            GetFileTypeList();
            GetDataConfigList();
        }

        function GetFileTypeList() {
            DataConfigCtrl.ePage.Masters.FileType.ListSource = [{
                "FieldName": "*",
                "Displayname": "*"
            }, {
                "FieldName": "JSON",
                "Displayname": "JSON"
            }, {
                "FieldName": "XML",
                "Displayname": "XML",
            }];
        }

        function GetDataConfigList() {
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": DataConfigCtrl.ePage.Masters.QueryString.AppPk,
                "AppCode": DataConfigCtrl.ePage.Masters.QueryString.AppCode,
                "ConfigType": DataConfigCtrl.ePage.Masters.QueryString.ConfigType
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataConfig.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataConfig.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList = response.data.Response;

                    if (DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList.length > 0) {
                        OnDataConfigClick(DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList[0]);
                    } else {
                        OnDataConfigClick();
                    }
                } else {
                    DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList = [];
                    OnDataConfigClick();
                }
            });
        }

        function AddNew() {
            DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig = {
                ConfigType: DataConfigCtrl.ePage.Masters.QueryString.ConfigType
            };

            Edit();
        }

        function OnDataConfigClick($item) {
            DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig = angular.copy($item);
            DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfigCopy = angular.copy($item);

            GetDataConfigFieldsList();
            GetFieldList();
        }

        function EditModalInstance() {
            return DataConfigCtrl.ePage.Masters.DataConfig.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dataConfigEdit'"></div>`
            });
        }

        function Edit() {
            DataConfigCtrl.ePage.Masters.DataConfig.SaveBtnText = "OK";
            DataConfigCtrl.ePage.Masters.DataConfig.IsDisableSaveBtn = false;
            DataConfigCtrl.ePage.Masters.DataConfig.ConfigType = true;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            DataConfigCtrl.ePage.Masters.DataConfig.SaveBtnText = "Please Wait...";
            DataConfigCtrl.ePage.Masters.DataConfig.IsDisableSaveBtn = true;

            var _input = angular.copy(DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig);

            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.AppCode = DataConfigCtrl.ePage.Masters.QueryString.AppCode;
            _input.SAP_FK = DataConfigCtrl.ePage.Masters.QueryString.AppPk;
            _input.IsModified = true;
            _input.IsDeleted = false;
            _input.ConfigType = DataConfigCtrl.ePage.Masters.QueryString.ConfigType;

            apiService.post("eAxisAPI", appConfig.Entities.DataConfig.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig = angular.copy(_response);
                    var _index = DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList.push(_response);
                    } else {
                        DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList[_index] = _response;
                    }
                    OnDataConfigClick(DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig);
                } else {
                    toastr.error("Could not Save...!");
                }

                DataConfigCtrl.ePage.Masters.DataConfig.SaveBtnText = "OK";
                DataConfigCtrl.ePage.Masters.DataConfig.IsDisableSaveBtn = false;
                DataConfigCtrl.ePage.Masters.DataConfig.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig) {
                if (DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList.length > 0) {
                    DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig = angular.copy(DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList[0]);
                } else {
                    DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig = undefined;
                }
            } else if (DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfigCopy) {
                var _index = DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfigCopy.PK);

                if (_index !== -1) {
                    DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig = angular.copy(DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList[_index]);
                }
            }

            DataConfigCtrl.ePage.Masters.DataConfig.EditModal.dismiss('cancel');
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
            DataConfigCtrl.ePage.Masters.DataConfig.DeleteBtnText = "Please Wait...";
            DataConfigCtrl.ePage.Masters.DataConfig.IsDisableDeleteBtn = true;

            var _input = angular.copy(DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig);

            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", appConfig.Entities.DataConfig.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig.PK);

                    if (_index !== -1) {
                        DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList.splice(_index, 1);
                        if (DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList.length > 0) {
                            DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig = angular.copy(DataConfigCtrl.ePage.Masters.DataConfig.DataConfigList[0]);
                        } else {
                            OnDataConfigClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                DataConfigCtrl.ePage.Masters.DataConfig.DeleteBtnText = "Delete";
                DataConfigCtrl.ePage.Masters.DataConfig.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal() {
            var _attributeJson = DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig.Fields;
            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    if (typeof JSON.parse(_attributeJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig.Fields
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig.Fields = result;
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

        function AddNewLoad() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "right data-config-modal",
                scope: $scope,
                templateUrl: "app/trust-center/data-config/data-config-modal/data-config-" + DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig.ConfigType.toLowerCase() + ".html",
                controller: 'DataConfigModalController',
                controllerAs: "DataConfigModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "dataconfig": DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig,
                            "AppPk": DataConfigCtrl.ePage.Masters.QueryString.AppPk
                        };
                        return exports;
                    }
                }
            }).result.then(function (response) {
                DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig = response.Data;
                console.log(DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig)
            }, function (error) {
                console.log("Cancelled");
            });
        }

        // ========================Data Config Fields========================        
        function InitDataConfigFields() {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields = {};

            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ExpressionType = {};

            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.AddNewField = AddNewField;
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.EditDataConfigField = EditDataConfigField;
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.Save = DataConfigFieldsSave;
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.Close = CloseDataConfigFields;
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.GetAutocompleteList = GetAutocompleteList;
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.OnBlurAutoCompleteList = OnBlurAutoCompleteList;

            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.IsAutocompleteLoading = false;
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.IsAutocompleteNoResults = false;

            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.SaveBtnText = "Save";
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.IsDisableSaveBtn = false;

            DataConfigFieldsConfiguration();
        }

        function DataConfigFieldsConfiguration() {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.Configuration = {
                "Event": {
                    "IsExternalCode": true,
                    "IsCaptureDateTime": true,
                    "IsPartyType": false,
                    "ItemTypeList": ["Segment"],
                    "API":{
                        "UrlDB":"eAxisAPI",
                        "Url":"DataEntry/Dynamic/FindLookup",
                        "FilterID": "EVEMA",
                        "DBObjectName": "vwEventMaster",
                        "Type": "2"
                    }
                },
                "SharedEntity": {
                    "IsExternalCode": false,
                    "IsCaptureDateTime": false,
                    "IsPartyType": true,
                    "ItemTypeList": ["SharedEntityField", "Default"]
                }
            };

            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveConfiguration = DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.Configuration[DataConfigCtrl.ePage.Masters.QueryString.ConfigType];
            
            GetExpressionTypeList();
            GetEntitySourceList();
        }

        function GetDataConfigFieldsList() {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ListSource = undefined;
            var _filter = {
                "DAC_ConfigType": DataConfigCtrl.ePage.Masters.QueryString.ConfigType,
                "DAC_FK": DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataConfigFields.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataConfigFields.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ListSource = response.data.Response;
                } else {
                    DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ListSource = [];
                }
            });
        }

        function GetExpressionTypeList() {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ExpressionType.ListSource = ["GENERAL", "EXPRESSION"];
        }

        function GetEntitySourceList() {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.EntitySourceList = ["GENERAL", "ROLE", "TENANT"];
        }

        function AddNewField($item, type) {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField = {
                DAC_FK: DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig.PK,
                DAC_ConfigType: DataConfigCtrl.ePage.Masters.QueryString.ConfigType,
                ExpressionType: "GENERAL",
                EntitySource: "GENERAL"
            };

            if (type !== "Main") {
                DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField.Self_FK = $item.PK;
                DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField.External_Code = $item.External_Code;
                DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField.External_FK = $item.External_FK;
                DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField.ItemType =  DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveConfiguration.ItemTypeList[0];
            }else{
                DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField.ItemType = "Main";
            }

            EditDataConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function EditDataConfigField($item) {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField = $item;

            EditDataConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function EditDataConfigModalInstance() {
            return DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dataConfigFieldsEdit'"></div>`
            });
        }

        function DataConfigFieldsSave() {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.SaveBtnText = "Please Wait...";
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.IsDisableSaveBtn = true;

            var _input = angular.copy(DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField);
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.DataConfigFields.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField.PK) {
                            var _index = DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ListSource.map(function (value, key) {
                                return value.PK;
                            }).indexOf(DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField.PK);

                            if (_index !== -1) {
                                DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ListSource[_index] = response.data.Response[0];
                            }
                        } else {
                            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ListSource.push(response.data.Response[0]);
                        }

                        DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField = undefined;
                        CloseDataConfigFields();
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.SaveBtnText = "Save";
                DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.IsDisableSaveBtn = false;
            });
        }

        function CloseDataConfigFields() {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.EditModal.dismiss('cancel');
        }

        function GetFieldList() {
            var _filter = {
                "TableName": DataConfigCtrl.ePage.Masters.DataConfig.ActiveDataConfig.ClassSource,
                "SAP_FK": DataConfigCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.FIeldList = response.data.Response;
                } else {
                    DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.FIeldList = [];
                }
            });
        }

        function GetAutocompleteList($viewValue, type) {
            var _filter = {};
            if ($viewValue !== "#") {
                _filter.Autocompletefield = $viewValue;
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveConfiguration.API.FilterID
            };

            if(DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveConfiguration.API.Type == "2"){
                _input.DBObjectName = DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveConfiguration.API.DBObjectName;
            }

            return apiService.post(DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveConfiguration.API.UrlDB, DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveConfiguration.API.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event, type) {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.ActiveDataConfigField.External_FK = $item.PK;
        }

        function OnBlurAutoCompleteList($event, type) {
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.IsAutocompleteLoading = false;
            DataConfigCtrl.ePage.Masters.DataConfig.DataConfigFields.IsAutocompleteNoResults = false;
        }

        Init();
    }
})();
