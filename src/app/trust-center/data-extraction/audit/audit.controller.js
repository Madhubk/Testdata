(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DataExtAuditController", DataExtAuditController);

    DataExtAuditController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "jsonEditModal", "trustCenterConfig"];

    function DataExtAuditController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var DataExtAuditCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            DataExtAuditCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_DataExtAudit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DataExtAuditCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            DataExtAuditCtrl.ePage.Masters.emptyText = "-";

            try {
                DataExtAuditCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (DataExtAuditCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitDataExtAudit();
                    InitDataConfigAuditFields();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================
        function InitBreadcrumb() {
            DataExtAuditCtrl.ePage.Masters.Breadcrumb = {};
            DataExtAuditCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = " (Audit)";

            DataExtAuditCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": DataExtAuditCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtAuditCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtAuditCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "DataExtAudit",
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
            DataExtAuditCtrl.ePage.Masters.Application = {};
            DataExtAuditCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            DataExtAuditCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!DataExtAuditCtrl.ePage.Masters.Application.ActiveApplication) {
                DataExtAuditCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": DataExtAuditCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtAuditCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtAuditCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetDataExtAuditList();
        }

        // ======================== Data Audit ==========================
        function InitDataExtAudit() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit = {};

            DataExtAuditCtrl.ePage.Masters.DataExtAudit.CloseDataExtAuditModal = CloseDataExtAuditModal;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.AddNew = AddNewDataExtAudit;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.Edit = EditDataExtAudit;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.Save = SaveDataExtAudit;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.Delete = DeleteDataExtAuditConfirmation;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.OnDataExtAuditClick = OnDataExtAuditClick;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.OpenJsonModal = OpenJsonModal;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.GetTargetTableList = GetTargetTableList;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.OnTargetTableSelect = OnTargetTableSelect;

            DataExtAuditCtrl.ePage.Masters.DataExtAudit.SaveBtnText = "OK";
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.IsDisableSaveBtn = false;

            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DeleteBtnText = "Delete";
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.IsDisableDeleteBtn = false;
        }

        function GetDataExtAuditList() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList = undefined;
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": DataExtAuditCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": DataExtAuditCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "ConfigType": "Audit"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfig.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList = response.data.Response;

                    if (DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList.length > 0) {
                        OnDataExtAuditClick(DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList[0]);
                    } else {
                        OnDataExtAuditClick();
                    }
                } else {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList = [];
                    OnDataExtAuditClick();
                }
            });
        }

        function OnDataExtAuditClick($item) {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit = angular.copy($item);
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAuditCopy = angular.copy($item);

            if (DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit) {
                GetDataExtAuditFieldsList();
                GetFieldList();

                DataExtAuditCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "DATA_Config",
                    ObjectId: DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.PK
                };
                DataExtAuditCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function AddNewDataExtAudit() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit = {
                ConfigType: "Audit"
            };

            EditDataExtAudit();
        }

        function EditDataExtAuditModalInstance() {
            return DataExtAuditCtrl.ePage.Masters.DataExtAudit.EditDataExtAuditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dataExtAuditEdit'"></div>`
            });
        }

        function EditDataExtAudit() {
            if (DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.PK) {
                if (DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.UIEntityName) {
                    var _obj = {
                        Name: DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.UIEntityName
                    };
                    GetTargetFieldList(_obj);
                }
            }
            EditDataExtAuditModalInstance().result.then(function (response) {}, function () {
                CloseDataExtAuditModal();
            });
        }

        function CloseDataExtAuditModal() {
            if (!DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit) {
                if (DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList.length > 0) {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit = angular.copy(DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList[0]);
                } else {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit = undefined;
                }
            } else if (DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAuditCopy) {
                var _index = DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAuditCopy.PK);

                if (_index !== -1) {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit = angular.copy(DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList[_index]);
                }
            }

            DataExtAuditCtrl.ePage.Masters.DataExtAudit.EditDataExtAuditModal.dismiss('cancel');
        }

        function DeleteDataExtAuditConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteDataExtAudit();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteDataExtAudit() {
            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Delete.Url + DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.PK);

                    if (_index !== -1) {
                        DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList.splice(_index, 1);
                        if (DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList.length > 0) {
                            DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit = angular.copy(DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList[0]);
                        } else {
                            OnDataExtAuditClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                GetDataExtAuditList();

                DataExtAuditCtrl.ePage.Masters.DataExtAudit.DeleteBtnText = "Delete";
                DataExtAuditCtrl.ePage.Masters.DataExtAudit.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal() {
            var _attributeJson = DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.Fields;
            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    if (typeof JSON.parse(_attributeJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.Fields
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.Fields = result;
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
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.ClassSource = $item.Name;
            if ($item) {
                GetTargetFieldList($item);
            }
        }

        function GetTargetFieldList($item, mode) {
            var _filter = {
                "TableName": $item.Name
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.TargetFieldList = response.data.Response;

                } else {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.TargetFieldList = [];
                }
            });
        }

        function SaveDataExtAudit() {
            if (DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.PK) {
                UpdateDataExtAudit();
            } else {
                InsertDataExtAudit();
            }
        }

        function InsertDataExtAudit() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.SaveBtnText = "Please Wait...";
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.IsDisableSaveBtn = true;

            var _input = DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit;
            _input.IsModified = true;
            _input.SAP_FK = DataExtAuditCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.SAP_Code = DataExtAuditCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList.push(_response);
                        } else {
                            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList[_index] = _response;
                        }

                        OnDataExtAuditClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtAuditCtrl.ePage.Masters.DataExtAudit.SaveBtnText = "OK";
                DataExtAuditCtrl.ePage.Masters.DataExtAudit.IsDisableSaveBtn = false;
                DataExtAuditCtrl.ePage.Masters.DataExtAudit.EditDataExtAuditModal.dismiss('cancel');
            });
        }

        function UpdateDataExtAudit() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.SaveBtnText = "Please Wait...";
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.IsDisableSaveBtn = true;

            var _input = DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList.push(_response);
                    } else {
                        DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditList[_index] = _response;
                    }
                    OnDataExtAuditClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtAuditCtrl.ePage.Masters.DataExtAudit.SaveBtnText = "OK";
                DataExtAuditCtrl.ePage.Masters.DataExtAudit.IsDisableSaveBtn = false;
                DataExtAuditCtrl.ePage.Masters.DataExtAudit.EditDataExtAuditModal.dismiss('cancel');
            });
        }

        // =============== Data Audit End ============== //

        // *** Data Config Fields *** //
        function InitDataConfigAuditFields() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields = {};
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.AddNewField = AddNewField;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.Close = CloseDataExtAuditFields;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.OnDataExtAuditFieldsClick = OnDataExtAuditFieldsClick;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.Save = DataConfigFieldsSave;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.Delete = DeleteConfirmation;
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.EditDataConfigField = EditDataConfigField;

            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.SaveBtnText = "OK";
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.IsDisableSaveBtn = false;
        }

        function GetDataExtAuditFieldsList() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource = undefined;
            var _filter = {
                "DAC_ConfigType": "Audit",
                "DAC_FK": DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource = response.data.Response;
                    if (DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource.length > 0) {
                        OnDataExtAuditFieldsClick(DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource[0]);

                        DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource.map(function (value, key) {
                            SetGenerateScriptInput(value);
                        });
                    } else {
                        OnDataExtAuditFieldsClick();
                    }

                } else {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource = [];
                    OnDataExtAuditFieldsClick();
                }
            });
        }

        function OnDataExtAuditFieldsClick($item) {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ActiveDataExtAuditFields = angular.copy($item);
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ActiveDataExtAuditFieldsCopy = angular.copy($item);
        }

        function AddNewField(type) {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ActiveDataExtAuditFields = {
                DAC_FK: DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.PK,
                DAC_ConfigType: "Audit",
                ExpressionType: "GENERAL",
                EntitySource: "GENERAL",
                EntityRefCode: "General",
                ItemType: "Main"
            };

            EditDataConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function GetFieldList() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.FieldList = undefined;
            var _filter = {
                "TableName": DataExtAuditCtrl.ePage.Masters.DataExtAudit.ActiveDataExtAudit.ClassSource,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.FieldList = response.data.Response;
                } else {
                    DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.FieldList = [];
                }
            });
        }

        function EditDataConfigModalInstance() {
            return DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dataExtAuditFieldsEdit'"></div>`
            });
        }

        function CloseDataExtAuditFields() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.EditModal.dismiss('cancel');
        }

        function DataConfigFieldsSave() {
            if (DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ActiveDataExtAuditFields.PK) {
                UpdateDataConfigFields();
            } else {
                InsertDataConfigFields();
            }
        }

        function InsertDataConfigFields() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.SaveBtnText = "Please Wait...";
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.IsDisableSaveBtn = true;

            var _input = DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ActiveDataExtAuditFields;
            _input.IsModified = true;
            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        if (!DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource) {
                            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource = [];
                        }
                        DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource.push(_response);

                        var _index = DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            SetGenerateScriptInput(DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource[_index]);
                        }

                        OnDataExtAuditFieldsClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.SaveBtnText = "OK";
                DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.IsDisableSaveBtn = false;
                DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.EditModal.dismiss('cancel');
            });
        }

        function UpdateDataConfigFields() {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.SaveBtnText = "Please Wait...";
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.IsDisableSaveBtn = true;

            var _input = DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ActiveDataExtAuditFields;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource.push(_response);
                    } else {
                        DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ListSource[_index] = _response;
                    }

                    OnDataExtAuditFieldsClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.SaveBtnText = "OK";
                DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.IsDisableSaveBtn = false;
                DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.EditModal.dismiss('cancel');
            });
        }

        function EditDataConfigField($item) {
            DataExtAuditCtrl.ePage.Masters.DataExtAudit.DataExtAuditFields.ActiveDataExtAuditFields = angular.copy($item);

            EditDataConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function DeleteConfirmation(item, index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    Delete(item, index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Delete(item) {
            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Delete.Url + item.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    toastr.success("Record Deleted Successfully");
                    OnDataExtAuditFieldsClick(item);

                } else {
                    toastr.error("Could not Delete")
                }
                GetDataExtAuditFieldsList()
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

        Init();
    }
})();