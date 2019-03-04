(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DataExtEventController", DataExtEventController);

    DataExtEventController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "jsonEditModal", "trustCenterConfig"];

    function DataExtEventController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var DataExtEventCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            DataExtEventCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_DataExtEvent",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DataExtEventCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            DataExtEventCtrl.ePage.Masters.emptyText = "-";

            try {
                DataExtEventCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (DataExtEventCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitDataExtEvent();
                    InitDataConfigEventFields();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================
        function InitBreadcrumb() {
            DataExtEventCtrl.ePage.Masters.Breadcrumb = {};
            DataExtEventCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = " (Event)";

            DataExtEventCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": DataExtEventCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtEventCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtEventCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "DataExtEvent",
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
        // ========================Application  End========================
        function InitApplication() {
            DataExtEventCtrl.ePage.Masters.Application = {};
            DataExtEventCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            DataExtEventCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!DataExtEventCtrl.ePage.Masters.Application.ActiveApplication) {
                DataExtEventCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": DataExtEventCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtEventCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtEventCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetDataExtEventList();
        }

        // ======================== Data Event ==========================
        function InitDataExtEvent() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent = {};

            DataExtEventCtrl.ePage.Masters.DataExtEvent.CloseDataExtEventModal = CloseDataExtEventModal;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.AddNew = AddNewDataExtEvent;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.Edit = EditDataExtEvent;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.Save = SaveDataExtEvent;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.Delete = DeleteDataExtEventConfirmation;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.OnDataExtEventClick = OnDataExtEventClick;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.OpenJsonModal = OpenJsonModal;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.GetTargetTableList = GetTargetTableList;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.OnTargetTableSelect = OnTargetTableSelect;

            DataExtEventCtrl.ePage.Masters.DataExtEvent.SaveBtnText = "OK";
            DataExtEventCtrl.ePage.Masters.DataExtEvent.IsDisableSaveBtn = false;

            DataExtEventCtrl.ePage.Masters.DataExtEvent.DeleteBtnText = "Delete";
            DataExtEventCtrl.ePage.Masters.DataExtEvent.IsDisableDeleteBtn = false;
        }

        function GetDataExtEventList() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList = undefined;
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": DataExtEventCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": DataExtEventCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "ConfigType": "Event"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfig.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList = response.data.Response;

                    if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList.length > 0) {
                        OnDataExtEventClick(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList[0]);
                    } else {
                        OnDataExtEventClick();
                    }
                } else {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList = [];
                    OnDataExtEventClick();
                }
            });
        }

        function OnDataExtEventClick($item) {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent = angular.copy($item);
            DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEventCopy = angular.copy($item);

            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent) {
                GetDataExtEventFieldsList();
                GetFieldList();

                DataExtEventCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "DATA_Config",
                    ObjectId: DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.PK
                };
                DataExtEventCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function AddNewDataExtEvent() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent = {
                ConfigType: "Event"
            };

            EditDataExtEvent();
        }

        function EditDataExtEventModalInstance() {
            return DataExtEventCtrl.ePage.Masters.DataExtEvent.EditDataExtEventModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dataExtEventEdit'"></div>`
            });
        }

        function EditDataExtEvent() {
            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.PK) {
                if (DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.UIEntityName) {
                    var _obj = {
                        Name: DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.UIEntityName
                    };
                    GetTargetFieldList(_obj);
                }
            }
            EditDataExtEventModalInstance().result.then(function (response) {}, function () {
                CloseDataExtEventModal();
            });

        }

        function CloseDataExtEventModal() {
            if (!DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent) {
                if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList.length > 0) {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent = angular.copy(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList[0]);
                } else {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent = undefined;
                }
            } else if (DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEventCopy) {
                var _index = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEventCopy.PK);

                if (_index !== -1) {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent = angular.copy(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList[_index]);
                }
            }

            DataExtEventCtrl.ePage.Masters.DataExtEvent.EditDataExtEventModal.dismiss('cancel');
        }

        function DeleteDataExtEventConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteDataExtEvent();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteDataExtEvent() {
            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Delete.Url + DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.PK);

                    if (_index !== -1) {
                        DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList.splice(_index, 1);
                        if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList.length > 0) {
                            DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent = angular.copy(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList[0]);
                        } else {
                            OnDataExtEventClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                DataExtEventCtrl.ePage.Masters.DataExtEvent.DeleteBtnText = "Delete";
                DataExtEventCtrl.ePage.Masters.DataExtEvent.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal() {
            var _attributeJson = DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.Fields;
            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    if (typeof JSON.parse(_attributeJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.Fields
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.Fields = result;
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
            DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.ClassSource = $item.Name;
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
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.TargetFieldList = response.data.Response;
                } else {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.TargetFieldList = [];
                }
            });
        }

        function SaveDataExtEvent() {
            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.PK) {
                UpdateDataExtEvent();
            } else {
                InsertDataExtEvent();
            }
        }

        function InsertDataExtEvent() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.SaveBtnText = "Please Wait...";
            DataExtEventCtrl.ePage.Masters.DataExtEvent.IsDisableSaveBtn = true;

            var _input = DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent;
            _input.IsModified = true;
            _input.SAP_FK = DataExtEventCtrl.ePage.Masters.Application.ActiveApplication.PK;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList.push(_response);
                        } else {
                            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList[_index] = _response;
                        }

                        OnDataExtEventClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtEventCtrl.ePage.Masters.DataExtEvent.SaveBtnText = "OK";
                DataExtEventCtrl.ePage.Masters.DataExtEvent.IsDisableSaveBtn = false;
                DataExtEventCtrl.ePage.Masters.DataExtEvent.EditDataExtEventModal.dismiss('cancel');
            });
        }

        function UpdateDataExtEvent() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.SaveBtnText = "Please Wait...";
            DataExtEventCtrl.ePage.Masters.DataExtEvent.IsDisableSaveBtn = true;

            var _input = DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent;
            _input.IsModified = true;
            _input.SAP_FK = DataExtEventCtrl.ePage.Masters.Application.ActiveApplication.PK;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList.push(_response);
                    } else {
                        DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventList[_index] = _response;
                    }

                    OnDataExtEventClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtEventCtrl.ePage.Masters.DataExtEvent.SaveBtnText = "OK";
                DataExtEventCtrl.ePage.Masters.DataExtEvent.IsDisableSaveBtn = false;
                DataExtEventCtrl.ePage.Masters.DataExtEvent.EditDataExtEventModal.dismiss('cancel');
            });
        }

        // =============== Data Event End ============== //

        function InitDataConfigEventFields() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields = {};

            DataExtEventCtrl.ePage.Masters.DataExtEvent.AddNewField = AddNewField;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditEventConfigField = EditEventConfigField;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.CloseEventConfigFields = CloseEventConfigFields;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EventConfigFieldsSave = EventConfigFieldsSave;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.OnDataExtEventFieldsClick = OnDataExtEventFieldsClick;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.GetAutocompleteList = GetAutocompleteList;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.Delete = DeleteConfirmation;

            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EventConfigSaveBtnText = "Save";
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.IsDisableEventConfigSaveBtn = false;

            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.FieldNameList = [];

            InitExpression();
            InitRelatedInput();
            InitUpdateRules();
        }

        function GetFieldList() {

            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.FieldNameList = undefined;
            var _filter = {
                "TableName": DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.ClassSource
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.FieldNameList = response.data.Response;
                } else {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.FieldNameList = [];
                }
            });
        }

        function GetDataExtEventFieldsList() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource = undefined;
            var _filter = {
                "DAC_ConfigType": "Event",
                "DAC_FK": DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource = response.data.Response;
                    if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource.length > 0) {

                        OnDataExtEventFieldsClick(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource[0]);

                        DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource.map(function (value, key) {
                            SetGenerateScriptInput(value);
                        });
                    } else {
                        OnDataExtEventFieldsClick();
                    }
                } else {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource = [];
                }
            });
        }

        function OnDataExtEventFieldsClick($item) {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields = angular.copy($item);
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFieldsCopy = angular.copy($item);

        }

        function AddNewField($item, type) {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields = {
                DAC_FK: DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.PK,
                DAC_ConfigType: "Event",
                ExpressionType: "GENERAL",
                EntitySource: "GENERAL",
                EntityRefCode: "General"
            };

            if (type !== "Main") {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Self_FK = $item.PK;
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.External_Code = $item.External_Code;
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.External_FK = $item.External_FK;
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ItemType = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.Expression.ItemTypeList[1];
            } else {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ItemType = "Main";
            }

            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.FieldNameList = [];
            GetFieldList();

            EditEventConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function EditEventConfigField($item) {
            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.PK) {
                if (DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.ClassSource) {
                    var _obj = {
                        TableName: DataExtEventCtrl.ePage.Masters.DataExtEvent.ActiveDataExtEvent.ClassSource
                    };
                    GetFieldList(_obj);
                }
            }

            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields = angular.copy($item);
            // if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ItemType.length > 0) {
            //     DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ItemType = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.Expression.ItemTypeList[0];
            // }
            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput != '' && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput != ' ') {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput = JSON.parse(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput);
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput = JSON.stringify(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput, undefined, 2);
            }

            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression != '' && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression != ' ') {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression = JSON.parse(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression);
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression = JSON.stringify(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression, undefined, 2);
            }

            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules != '' && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules != ' ') {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules = JSON.parse(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules);
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules = JSON.stringify(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules, undefined, 2);
            }

            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.DAC_FK) {
                var _index = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.DAC_FK);

                if (_index != -1) {
                    GetFieldList(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource[_index])
                }
            }

            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.FieldNameList = [];
            EditEventConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function EditEventConfigModalInstance() {
            return DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'EventConfigFields'"></div>`
            });
        }

        function CloseEventConfigFields() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditModal.dismiss('cancel');
        }

        function EventConfigFieldsSave() {
            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.PK) {
                UpdateEventConfigFields();
            } else {
                InsertEventConfigFields();
            }
        }

        function InsertEventConfigFields() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.SaveBtnText = "Please Wait...";
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.IsDisableSaveBtn = true;

            var _input = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields;
            _input.IsModified = true;
            _input.IsReUpdatable = true;


            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        if(!DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource){
                            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource = [];
                        }
                        DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource.push(_response);

                        var _index = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                           SetGenerateScriptInput(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ListSource[_index]);
                        } else {
                            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource[_index] = _response;
                        }

                        OnDataExtEventFieldsClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFieldsSaveBtnText = "OK";
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.IsDisableSaveBtn = false;
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditModal.dismiss('cancel');
            });
        }

        function UpdateEventConfigFields() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.SaveBtnText = "Please Wait...";
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.IsDisableSaveBtn = true;

            var _input = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource.push(_response);
                    } else {
                        DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.DataExtEventFieldsListSource[_index] = _response;
                    }

                    OnDataExtEventFieldsClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.SaveBtnText = "OK";
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.IsDisableSaveBtn = false;
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditModal.dismiss('cancel');
            });
        }

        function GetAutocompleteList($viewValue, type) {
            var _filter = {
                "AutoCompletefield": $viewValue
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EventMaster.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EventMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event, type) {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.External_FK = $item.PK;
        }

        function OnBlurAutoCompleteList($event, type) {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.IsAutocompleteLoading = false;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.IsAutocompleteNoResults = false;
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
                    OnDataExtEventFieldsClick(item);

                } else {
                    toastr.error("Could not Delete");
                }
                GetDataExtEventFieldsList();
            });
        }

        function SetGenerateScriptInput(item) {
            if (item) {
               item.GenerateScriptInput = {
                    ObjectName: "DATA_Config_Fields",
                    ObjectId: item.PK
                };
                item.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        // *** Data Config Fields End*** //

        // **** Edit Expression *** //

        function InitExpression() {

            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.Expression = {};
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.Expression.ItemTypeList = ["Main", "Segment"];
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.Expression.ExpressionTypeList = ["GENERAL", "EXPRESSION"];
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.Expression.OnEditExpression = OnEditExpression;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.Expression.CloseEditExpressionModal = CloseEditExpressionModal;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.Expression.PrepareExpression = PrepareExpression;
        }

        function EditExpressionModalInstance() {
            return DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditExpressionModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-expression-modal right",
                scope: $scope,
                template: `<div ng-include src="'editExpression'"></div>`
            });
        }

        function CloseEditExpressionModal() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditExpressionModal.dismiss('cancel');

            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression != '' && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression != ' ') {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression = JSON.parse(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression);
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression = JSON.stringify(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression, undefined, 2);
            }
        }

        function OnEditExpression() {
            if (!DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ExpressionGroup) {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ExpressionGroup = [];
            }
            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression) {
                if (typeof DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression == "string") {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ExpressionGroup = JSON.parse(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression);
                }
            } else {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ExpressionGroup = [];
            }

            EditExpressionModalInstance().result.then(function (response) {}, function () {
                CloseEditExpressionModal();
            });
        }

        function PrepareExpression() {
            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ExpressionGroup) {
                if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ExpressionGroup.length > 0) {
                    var _Group = angular.copy(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.ExpressionGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value1, key1) {
                            if (value1.Expressions.length > 0) {
                                value1.Expressions.map(function (value2, key2) {
                                    delete value2.FieldNo;
                                    delete value2.FieldName;
                                });
                            }
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression = _Group;
                } else {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression = "[]";
                }
            } else {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.Expression = "[]";
            }

            CloseEditExpressionModal();
        }

        // *** Edit Related Input *** //

        function InitRelatedInput() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.RelatedInput = {};

            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.RelatedInput.OnEditRelatedInput = OnEditRelatedInput;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.CloseEditRelatedInputModal = CloseEditRelatedInputModal;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.PrepareRelatedInput = PrepareRelatedInput;
        }

        function PrepareRelatedInput() {
            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInputGroup) {
                if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInputGroup.length > 0) {
                    var _Group = angular.copy(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInputGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value, key) {
                            delete value.FieldNo;
                            delete value.FieldName;
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput = _Group;
                } else {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput = "[]";
                }
            } else {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput = "[]";
            }

            CloseEditRelatedInputModal();
        }

        function EditRelatedInputModalInstance() {
            return DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditRelatedInputModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-related-input-modal right",
                scope: $scope,
                template: `<div ng-include src="'editRelatedInput'"></div>`
            });
        }

        function CloseEditRelatedInputModal() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditRelatedInputModal.dismiss('cancel');

            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput != '' && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput != ' ') {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput = JSON.parse(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput);
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput = JSON.stringify(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput, undefined, 2);
            }
        }

        function OnEditRelatedInput() {
            if (!DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInputGroup) {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInputGroup = [];
            }

            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput) {
                if (typeof DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput == "string") {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInputGroup = JSON.parse(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInput);
                }
            } else {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.RelatedInputGroup = [];
            }

            EditRelatedInputModalInstance().result.then(function (response) {}, function () {
                CloseEditRelatedInputModal();
            });
        }

        // *** Edit Update Rules *** //

        function InitUpdateRules() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.UpdateRules = {};

            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.UpdateRules.OnEditUpdateRules = OnEditUpdateRules;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.UpdateRules.CloseEditUpdateRulesModal = CloseEditUpdateRulesModal;
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.UpdateRules.PrepareUpdateRules = PrepareUpdateRules;
        }

        function PrepareUpdateRules() {
            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRulesGroup) {
                if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRulesGroup.length > 0) {
                    var _Group = angular.copy(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRulesGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value, key) {
                            delete value.FieldNo;
                            delete value.FieldName;
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules = _Group;
                } else {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules = "[]";
                }
            } else {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules = "[]";
            }

            CloseEditUpdateRulesModal();
        }

        function EditUpdateRulesModalInstance() {
            return DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditUpdateRulesModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-update-rules-modal right",
                scope: $scope,
                template: `<div ng-include src="'editUpdateRules'"></div>`
            });
        }

        function CloseEditUpdateRulesModal() {
            DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.EditUpdateRulesModal.dismiss('cancel');

            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules != '' && DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules != ' ') {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules = JSON.parse(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules);
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules = JSON.stringify(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules, undefined, 2);
            }
        }

        function OnEditUpdateRules() {
            if (!DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRulesGroup) {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRulesGroup = [];
            }

            if (DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules) {
                if (typeof DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules == "string") {
                    DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRulesGroup = JSON.parse(DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRules);
                }
            } else {
                DataExtEventCtrl.ePage.Masters.DataExtEvent.DataExtEventFields.ActiveDataExtEventFields.UpdateRulesGroup = [];
            }

            EditUpdateRulesModalInstance().result.then(function (response) {}, function () {
                CloseEditUpdateRulesModal();
            });
        }

        Init();
    }
})();