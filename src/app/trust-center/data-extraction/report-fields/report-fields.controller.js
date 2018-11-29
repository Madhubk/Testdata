(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DataExtReportFieldsController", DataExtReportFieldsController);

    DataExtReportFieldsController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "jsonEditModal", "trustCenterConfig"];

    function DataExtReportFieldsController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var DataExtReportFieldsCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            DataExtReportFieldsCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_DataExtReportFields",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DataExtReportFieldsCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            DataExtReportFieldsCtrl.ePage.Masters.emptyText = "-";

            try {
                DataExtReportFieldsCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (DataExtReportFieldsCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitDataExtReportFields();
                    InitDataExtReportFieldsFields();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            DataExtReportFieldsCtrl.ePage.Masters.Breadcrumb = {};
            DataExtReportFieldsCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = " (Report Fields)";

            DataExtReportFieldsCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": DataExtReportFieldsCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtReportFieldsCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtReportFieldsCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "DataExtReportFields",
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
            DataExtReportFieldsCtrl.ePage.Masters.Application = {};
            DataExtReportFieldsCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            DataExtReportFieldsCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!DataExtReportFieldsCtrl.ePage.Masters.Application.ActiveApplication) {
                DataExtReportFieldsCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": DataExtReportFieldsCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtReportFieldsCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtReportFieldsCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetDataExtReportFieldsList();
        }

        // ======================= Data Extraction Report Fields ===========
        function InitDataExtReportFields() {

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields = {};

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.CloseDataExtReportFieldsModal = CloseDataExtReportFieldsModal;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.AddNew = AddNewDataExtReportFields;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.Edit = EditDataExtReportFields;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.Save = SaveDataExtReportFields;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.Delete = DeleteDataExtReportFieldsConfirmation;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.OnDataExtReportFieldsClick = OnDataExtReportFieldsClick;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.OpenJsonModal = OpenJsonModal;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.GetTargetTableList = GetTargetTableList;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.OnTargetTableSelect = OnTargetTableSelect;

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.SaveBtnText = "OK";
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.IsDisableSaveBtn = false;

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DeleteBtnText = "Delete";
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.IsDisableDeleteBtn = false;
        }

        function GetDataExtReportFieldsList() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList = undefined;
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": DataExtReportFieldsCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": DataExtReportFieldsCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "ConfigType": "ReportFields"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfig.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList = response.data.Response;

                    if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList.length > 0) {
                        OnDataExtReportFieldsClick(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList[0]);
                    } else {
                        OnDataExtReportFieldsClick();
                    }
                } else {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList = [];
                    OnDataExtReportFieldsClick();
                }
            });
        }

        function OnDataExtReportFieldsClick($item) {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields = angular.copy($item);
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFieldsCopy = angular.copy($item);

            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields) {
                GetDataExtReportFieldsFieldsList();
                GetFieldList();
            }
        }

        function AddNewDataExtReportFields() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields = {
                ConfigType: "ReportFields"
            };

            EditDataExtReportFields();
        }

        function EditDataExtReportFieldsModalInstance() {
            return DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.EditDataExtReportFieldsModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'DataExtReportFieldsEdit'"></div>`
            });
        }

        function EditDataExtReportFields() {
            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.PK) {
                if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.UIEntityName) {
                    var _obj = {
                        Name: DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.UIEntityName
                    };
                    GetTargetFieldList(_obj);
                }
            }
            EditDataExtReportFieldsModalInstance().result.then(function (response) {}, function () {
                CloseDataExtReportFieldsModal();
            });

        }

        function CloseDataExtReportFieldsModal() {
            if (!DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields) {
                if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList.length > 0) {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields = angular.copy(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList[0]);
                } else {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields = undefined;
                }
            } else if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFieldsCopy) {
                var _index = DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFieldsCopy.PK);

                if (_index !== -1) {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields = angular.copy(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList[_index]);
                }
            }

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.EditDataExtReportFieldsModal.dismiss('cancel');
        }

        function DeleteDataExtReportFieldsConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteDataExtReportFields();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteDataExtReportFields() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DeleteBtnText = "Please Wait...";
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.IsDisableDeleteBtn = true;

            var _input = angular.copy(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.PK);

                    if (_index !== -1) {
                        DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList.splice(_index, 1);
                        if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList.length > 0) {
                            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields = angular.copy(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList[0]);
                        } else {
                            OnDataExtReportFieldsClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DeleteBtnText = "Delete";
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal() {
            var _attributeJson = DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.Fields;
            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    if (typeof JSON.parse(_attributeJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.Fields
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.Fields = result;
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

        function OnTargetTableSelect($item, $model, $label, $ReportFields) {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.ClassSource = $item.Name;
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
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.TargetFieldList = response.data.Response;
                } else {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.TargetFieldList = [];
                }
            });
        }

        function SaveDataExtReportFields() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.SaveBtnText = "Please Wait...";
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.IsDisableSaveBtn = true;

            var _input = angular.copy(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields);

            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.AppCode = DataExtReportFieldsCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.SAP_FK = DataExtReportFieldsCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.IsModified = true;
            _input.IsDeleted = false;
            _input.ConfigType = "ReportFields";

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields = angular.copy(_response);
                    var _index = DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList.push(_response);
                    } else {
                        DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsList[_index] = _response;
                    }

                    OnDataExtReportFieldsClick(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields);
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.SaveBtnText = "OK";
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.IsDisableSaveBtn = false;
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.EditDataExtReportFieldsModal.dismiss('cancel');
            });
        }


        // =======================  Data Extraction Report Fields End ======== 

        // ====================== Data Extraction Report Fields List Start =====
        function InitDataExtReportFieldsFields() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields = {};

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.AddNewField = AddNewField;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.EditReportFieldsField = EditReportFieldsField;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.CloseReportFieldsFields = CloseReportFieldsFields;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ReportFieldsFieldsSave = ReportFieldsFieldsSave;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.OnDataExtReportFieldsFieldsClick = OnDataExtReportFieldsFieldsClick;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.Delete = DeleteConfirmation;

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ReportFieldsSaveBtnText = "Save";
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.IsDisableReportFieldsSaveBtn = false;

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.FieldNameList = [];

            InitExpression();
            InitRelatedInput();
            InitUpdateRules();
        }

        function GetFieldList() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.FieldNameList = undefined;
            var _filter = {
                "TableName": DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.ClassSource
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.FieldNameList = response.data.Response;
                } else {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.FieldNameList = [];
                }
            });
        }

        function GetDataExtReportFieldsFieldsList() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.DataExtReportFieldsFieldsListSource = undefined;
            var _filter = {
                "DAC_ConfigType": "ReportFields",
                "DAC_FK": DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.DataExtReportFieldsFieldsListSource = response.data.Response;
                    if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.DataExtReportFieldsFieldsListSource.length > 0) {

                        OnDataExtReportFieldsFieldsClick(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.DataExtReportFieldsFieldsListSource[0])
                    } else {
                        OnDataExtReportFieldsFieldsClick();
                    }
                } else {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.DataExtReportFieldsFieldsListSource = [];
                }
            });
        }

        function OnDataExtReportFieldsFieldsClick($item) {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields = angular.copy($item);
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFieldsCopy = angular.copy($item);
        }

        function AddNewField($item, type) {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields = {
                DAC_FK: DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.PK,
                DAC_ConfigType: "ReportFields",
                ExpressionType: "GENERAL",
                EntitySource: "GENERAL",
                EntityRefCode: "General"
            };

            // if (type !== "Main") {
            //     DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Self_FK = $item.PK;
            //     DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.External_Code = $item.External_Code;
            //     DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.External_FK = $item.External_FK;
            //     DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ItemType = DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.Expression.ItemTypeList[0];
            // } else {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ItemType = "Main";
            //  }

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.FieldNameList = [];
            GetFieldList();

            EditReportFieldsConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function EditReportFieldsField($item) {
            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.PK) {
                if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.ClassSource) {
                    var _obj = {
                        TableName: DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.ActiveDataExtReportFields.ClassSource
                    };
                    GetFieldList(_obj);
                }
            }

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields = angular.copy($item);
            // if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ItemType.length > 0) {
            //     DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ItemType = DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.Expression.ItemTypeList[0];
            // }
            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput != '' && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput != ' ') {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput = JSON.parse(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput);
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput = JSON.stringify(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput, undefined, 2);
            }

            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression != '' && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression != ' ') {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression = JSON.parse(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression);
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression = JSON.stringify(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression, undefined, 2);
            }

            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules != '' && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules != ' ') {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules = JSON.parse(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules);
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules = JSON.stringify(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules, undefined, 2);
            }

            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.DAC_FK) {
                var _index = DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.DataExtReportFieldsFieldsListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.DAC_FK);

                if (_index != -1) {

                    GetFieldList(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.DataExtReportFieldsFieldsListSource[_index])
                }
            }

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.FieldNameList = [];
            EditReportFieldsConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function EditReportFieldsConfigModalInstance() {
            return DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'ReportFieldsConfigFields'"></div>`
            });
        }

        function CloseReportFieldsFields() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.EditModal.dismiss('cancel');
        }

        function ReportFieldsFieldsSave() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ReportFieldsConfigSaveBtnText = "Please Wait...";
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.IsDisableReportFieldsConfigSaveBtn = true;

            var _input = angular.copy(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields);
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.PK) {
                            var _index = DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.DataExtReportFieldsFieldsListSource.map(function (value, key) {
                                return value.PK;
                            }).indexOf(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.PK);

                            if (_index !== -1) {
                                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.DataExtReportFieldsFieldsListSource[_index] = response.data.Response[0];
                            }
                        } else {
                            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.DataExtReportFieldsFieldsListSource.push(response.data.Response[0]);
                        }
                        CloseReportFieldsFields();
                    }
                } else {
                    toastr.error("Could not Save...!");
                }
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ReportFieldsConfigSaveBtnText = "Save";
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.IsDisableReportFieldsConfigSaveBtn = false;
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
                    OnDataExtReportFieldsFieldsClick(item);
                 } else {
                    toastr.error("Could not Delete")
                }
            });
        }

        // ======== Edit Expression ======= //


        function InitExpression() {

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.Expression = {};
            // DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.Expression.ItemTypeList = ["Default", "ReportField"];
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.Expression.ExpressionTypeList = ["GENERAL", "EXPRESSION"];
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.Expression.OnEditExpression = OnEditExpression;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.Expression.CloseEditExpressionModal = CloseEditExpressionModal;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.Expression.PrepareExpression = PrepareExpression;
        }

        function EditExpressionModalInstance() {
            return DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.EditExpressionModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-expression-modal right",
                scope: $scope,
                template: `<div ng-include src="'editExpression'"></div>`
            });
        }

        function CloseEditExpressionModal() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.EditExpressionModal.dismiss('cancel');

            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression != '' && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression != ' ') {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression = JSON.parse(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression);
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression = JSON.stringify(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression, undefined, 2);
            }
        }

        function OnEditExpression() {
            if (!DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ExpressionGroup) {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ExpressionGroup = [];
            }
            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression) {
                if (typeof DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression == "string") {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ExpressionGroup = JSON.parse(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression);
                }
            } else {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ExpressionGroup = [];
            }

            EditExpressionModalInstance().result.then(function (response) {}, function () {
                CloseEditExpressionModal();
            });
        }

        function PrepareExpression() {
            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ExpressionGroup) {
                if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ExpressionGroup.length > 0) {
                    var _Group = angular.copy(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.ExpressionGroup);

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
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression = _Group;
                } else {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression = "[]";
                }
            } else {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.Expression = "[]";
            }

            CloseEditExpressionModal();
        }

        // *** Edit Related Input *** //

        function InitRelatedInput() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.RelatedInput = {};

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.RelatedInput.OnEditRelatedInput = OnEditRelatedInput;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.CloseEditRelatedInputModal = CloseEditRelatedInputModal;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.PrepareRelatedInput = PrepareRelatedInput;
        }

        function PrepareRelatedInput() {
            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInputGroup) {
                if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInputGroup.length > 0) {
                    var _Group = angular.copy(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInputGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value, key) {
                            delete value.FieldNo;
                            delete value.FieldName;
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput = _Group;
                } else {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput = "[]";
                }
            } else {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput = "[]";
            }

            CloseEditRelatedInputModal();
        }

        function EditRelatedInputModalInstance() {
            return DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.EditRelatedInputModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-related-input-modal right",
                scope: $scope,
                template: `<div ng-include src="'editRelatedInput'"></div>`
            });
        }

        function CloseEditRelatedInputModal() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.EditRelatedInputModal.dismiss('cancel');

            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput != '' && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput != ' ') {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput = JSON.parse(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput);
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput = JSON.stringify(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput, undefined, 2);
            }
        }

        function OnEditRelatedInput() {
            if (!DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInputGroup) {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInputGroup = [];
            }

            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput) {
                if (typeof DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput == "string") {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInputGroup = JSON.parse(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInput);
                }
            } else {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.RelatedInputGroup = [];
            }

            EditRelatedInputModalInstance().result.then(function (response) {}, function () {
                CloseEditRelatedInputModal();
            });
        }

        // *** Edit Update Rules *** //

        function InitUpdateRules() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.UpdateRules = {};

            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.UpdateRules.OnEditUpdateRules = OnEditUpdateRules;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.UpdateRules.CloseEditUpdateRulesModal = CloseEditUpdateRulesModal;
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.UpdateRules.PrepareUpdateRules = PrepareUpdateRules;
        }

        function PrepareUpdateRules() {
            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRulesGroup) {
                if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRulesGroup.length > 0) {
                    var _Group = angular.copy(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRulesGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value, key) {
                            delete value.FieldNo;
                            delete value.FieldName;
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules = _Group;
                } else {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules = "[]";
                }
            } else {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules = "[]";
            }

            CloseEditUpdateRulesModal();
        }

        function EditUpdateRulesModalInstance() {
            return DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.EditUpdateRulesModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-update-rules-modal right",
                scope: $scope,
                template: `<div ng-include src="'editUpdateRules'"></div>`
            });
        }

        function CloseEditUpdateRulesModal() {
            DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.EditUpdateRulesModal.dismiss('cancel');

            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules != '' && DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules != ' ') {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules = JSON.parse(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules);
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules = JSON.stringify(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules, undefined, 2);
            }
        }

        function OnEditUpdateRules() {
            if (!DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRulesGroup) {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRulesGroup = [];
            }

            if (DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules) {
                if (typeof DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules == "string") {
                    DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRulesGroup = JSON.parse(DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRules);
                }
            } else {
                DataExtReportFieldsCtrl.ePage.Masters.DataExtReportFields.DataExtReportFieldsFields.ActiveDataExtReportFieldsFields.UpdateRulesGroup = [];
            }

            EditUpdateRulesModalInstance().result.then(function (response) {}, function () {
                CloseEditUpdateRulesModal();
            });
        }
        Init();
    }
})();