(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DataExtIntegrationController", DataExtIntegrationController);

    DataExtIntegrationController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "jsonEditModal", "trustCenterConfig"];

    function DataExtIntegrationController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var DataExtIntegrationCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            DataExtIntegrationCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_DataExtIntegration",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DataExtIntegrationCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            DataExtIntegrationCtrl.ePage.Masters.emptyText = "-";

            try {
                DataExtIntegrationCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (DataExtIntegrationCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitDataExtIntegration();
                    InitDataConfigIntegrationFields();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            DataExtIntegrationCtrl.ePage.Masters.Breadcrumb = {};
            DataExtIntegrationCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = " (Integration)";

            DataExtIntegrationCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": DataExtIntegrationCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtIntegrationCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtIntegrationCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "DataExtIntegration",
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
            DataExtIntegrationCtrl.ePage.Masters.Application = {};
            DataExtIntegrationCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            DataExtIntegrationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!DataExtIntegrationCtrl.ePage.Masters.Application.ActiveApplication) {
                DataExtIntegrationCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": DataExtIntegrationCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtIntegrationCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtIntegrationCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetDataExtIntegrationList();
        }

        // ==================== Data Integration Start ==================
        function InitDataExtIntegration() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration = {};

            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.CloseDataExtIntegrationModal = CloseDataExtIntegrationModal;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.AddNew = AddNewDataExtIntegration;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.Edit = EditDataExtIntegration;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.Save = SaveDataExtIntegration;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.Delete = DeleteDataExtIntegrationConfirmation;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.OnDataExtIntegrationClick = OnDataExtIntegrationClick;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.OpenJsonModal = OpenJsonModal;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.GetTargetTableList = GetTargetTableList;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.OnTargetTableSelect = OnTargetTableSelect;

            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.SaveBtnText = "OK";
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.IsDisableSaveBtn = false;

            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DeleteBtnText = "Delete";
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.IsDisableDeleteBtn = false;
        }

        function GetDataExtIntegrationList() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList = undefined;
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": DataExtIntegrationCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": DataExtIntegrationCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "ConfigType": "Integration"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfig.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList = response.data.Response;

                    if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList.length > 0) {
                        OnDataExtIntegrationClick(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList[0]);
                    } else {
                        OnDataExtIntegrationClick();
                    }
                } else {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList = [];
                    OnDataExtIntegrationClick();
                }
            });
        }

        function OnDataExtIntegrationClick($item) {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration = angular.copy($item);
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegrationCopy = angular.copy($item);

            if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration) {
                GetDataExtIntegrationFieldsList();
                GetFieldList();
            }
        }

        function AddNewDataExtIntegration() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration = {
                ConfigType: "Integration"
            };

            EditDataExtIntegration();
        }

        function EditDataExtIntegrationModalInstance() {
            return DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.EditDataExtIntegrationModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dataExtIntegrationEdit'"></div>`
            });
        }

        function EditDataExtIntegration() {
            if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.PK) {
                if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.UIEntityName) {
                    var _obj = {
                        Name: DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.UIEntityName
                    };
                    GetTargetFieldList(_obj);
                }
            }
            EditDataExtIntegrationModalInstance().result.then(function (response) { }, function () {
                CloseDataExtIntegrationModal();
            });
        }

        function CloseDataExtIntegrationModal() {
            if (!DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration) {
                if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList.length > 0) {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration = angular.copy(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList[0]);
                } else {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration = undefined;
                }
            } else if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegrationCopy) {
                var _index = DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegrationCopy.PK);

                if (_index !== -1) {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration = angular.copy(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList[_index]);
                }
            }

            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.EditDataExtIntegrationModal.dismiss('cancel');
        }

        function DeleteDataExtIntegrationConfirmation() {
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

        function DeleteDataExtIntegration() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DeleteBtnText = "Please Wait...";
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.IsDisableDeleteBtn = true;

            var _input = angular.copy(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.PK);

                    if (_index !== -1) {
                        DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList.splice(_index, 1);
                        if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList.length > 0) {
                            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration = angular.copy(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList[0]);
                        } else {
                            OnDataExtIntegrationClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DeleteBtnText = "Delete";
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal() {
            var _attributeJson = DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.Fields;
            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    if (typeof JSON.parse(_attributeJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.Fields
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.Fields = result;
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
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.ClassSource = $item.Name;
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
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.TargetFieldList = response.data.Response;

                } else {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.TargetFieldList = [];
                }
            });
        }

        function SaveDataExtIntegration() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.SaveBtnText = "Please Wait...";
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.IsDisableSaveBtn = true;

            var _input = angular.copy(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration);

            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.AppCode = DataExtIntegrationCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.SAP_FK = DataExtIntegrationCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.IsModified = true;
            _input.IsDeleted = false;
            _input.ConfigType = "Integration";

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration = angular.copy(_response);
                    var _index = DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList.push(_response);
                    } else {
                        DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationList[_index] = _response;
                    }

                    OnDataExtIntegrationClick(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration);
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.SaveBtnText = "OK";
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.IsDisableSaveBtn = false;
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.EditDataExtIntegrationModal.dismiss('cancel');
            });
        }

        // ============ Data Integration End ============= //

        // ============ Data Integration Fields ========== //

        function InitDataConfigIntegrationFields() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields = {};
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.AddNewField = AddNewField;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.OnOpenJsonModal = OnOpenJsonModal;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Close = CloseDataExtIntegrationFields;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.OnDataExtIntegrationFieldsClick = OnDataExtIntegrationFieldsClick;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Save = DataConfigFieldsSave;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Delete = DeleteConfirmation;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.EditDataConfigField = EditDataConfigField;

            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.SaveBtnText = "OK";
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.IsDisableSaveBtn = false;

            InitExpression();
            InitRelatedInput();
        }

        function GetDataExtIntegrationFieldsList() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ListSource = undefined;
            var _filter = {
                "DAC_ConfigType": "Integration",
                "DAC_FK": DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ListSource = response.data.Response;
                    if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ListSource.length > 0) {
                        OnDataExtIntegrationFieldsClick(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ListSource[0]);

                    } else {
                        OnDataExtIntegrationFieldsClick();
                    }

                } else {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ListSource = [];
                    OnDataExtIntegrationFieldsClick();
                }
            });
        }

        function OnDataExtIntegrationFieldsClick($item) {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields = angular.copy($item);
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFieldsCopy = angular.copy($item);
        }

        function AddNewField(type) {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields = {
                DAC_FK: DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.PK,
                DAC_ConfigType: "Integration",
                ExpressionType: "GENERAL",
                EntitySource: "GENERAL",
                EntityRefCode: "General",
                ItemType: "Main"
            };
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.FieldList = [];
            GetFieldList();
            EditDataConfigModalInstance().result.then(function (response) { }, function () { });
        }

        function GetFieldList() {
            var _filter = {
                "TableName": DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.ActiveDataExtIntegration.ClassSource,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.FieldList = response.data.Response;
                } else {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.FieldList = [];
                }
            });
        }

        function EditDataConfigModalInstance() {
            return DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dataExtIntegrationFieldsEdit'"></div>`
            });
        }

        function CloseDataExtIntegrationFields() {
             DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.EditModal.dismiss('cancel');
        }

        function DataConfigFieldsSave() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.SaveBtnText = "Please Wait...";
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.IsDisableSaveBtn = true;

            var _input = angular.copy(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields);
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.PK) {
                            var _index = DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ListSource.map(function (value, key) {
                                return value.PK;
                            }).indexOf(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.PK);

                            if (_index !== -1) {
                                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ListSource[_index] = response.data.Response[0];
                            }
                        } else {
                            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ListSource.push(response.data.Response[0]);
                        }

                        DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields = undefined;
                        CloseDataExtIntegrationFields();
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.SaveBtnText = "Save";
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.IsDisableSaveBtn = false;
            });
        }

        function EditDataConfigField($item) {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields = angular.copy($item);

            EditDataConfigModalInstance().result.then(function (response) { }, function () { });
        }

        function OnOpenJsonModal() {
            var _attributeJson = DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.SearchInput;
            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    if (typeof JSON.parse(_attributeJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.SearchInput
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.SearchInput = result;
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
            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Delete.Url +  item.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    toastr.success("Record Deleted Successfully");
                    OnDataExtIntegrationFieldsClick(item);
                 } else {
                    toastr.error("Could not Delete")
                }
            });
        }


        // ================= Data Integration Fields End ================= //

        // ============== Edit Expression Start =================== //

        function InitExpression() {

            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Expression = {};
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Expression.FileTypeList = ["Xml", "Json", "Pdf"];
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Expression.APIMethods = ["POST", "GET"];
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Expression.ExpressionTypeList = ["GENERAL", "EXPRESSION"];
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Expression.EntitySourceTypeList = ["GENERAL", "ROLE", "TENANT"];
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Expression.OnEditExpression = OnEditExpression;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Expression.CloseEditExpressionModal = CloseEditExpressionModal;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.Expression.PrepareExpression = PrepareExpression;
        }

        function EditExpressionModalInstance() {
            return DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.EditExpressionModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-expression-modal right",
                scope: $scope,
                template: `<div ng-include src="'editExpression'"></div>`
            });
        }

        function CloseEditExpressionModal() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.EditExpressionModal.dismiss('cancel');

            if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression && DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression != '' && DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression != ' ') {
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression = JSON.parse(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression);
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression = JSON.stringify(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression, undefined, 2);
            }
        }

        function OnEditExpression() {
            if (!DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.ExpressionGroup) {
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.ExpressionGroup = [];
            }
            if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression) {
                if (typeof DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression == "string") {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.ExpressionGroup = JSON.parse(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression);
                }
            } else {
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.ExpressionGroup = [];
            }

            EditExpressionModalInstance().result.then(function (response) { }, function () {
                CloseEditExpressionModal();
            });
        }

        function PrepareExpression() {
            if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.ExpressionGroup) {
                if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.ExpressionGroup.length > 0) {
                    var _Group = angular.copy(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.ExpressionGroup);

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
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression = _Group;
                } else {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression = "[]";
                }
            } else {
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.Expression = "[]";
            }

            CloseEditExpressionModal();
        }

        // *** Edit Related Input *** //

        function InitRelatedInput() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.RelatedInput = {};

            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.RelatedInput.OnEditRelatedInput = OnEditRelatedInput;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.CloseEditRelatedInputModal = CloseEditRelatedInputModal;
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.PrepareRelatedInput = PrepareRelatedInput;
        }

        function PrepareRelatedInput() {
            if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInputGroup) {
                if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInputGroup.length > 0) {
                    var _Group = angular.copy(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInputGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value, key) {
                            delete value.FieldNo;
                            delete value.FieldName;
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput = _Group;
                } else {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput = "[]";
                }
            } else {
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput = "[]";
            }

            CloseEditRelatedInputModal();
        }

        function EditRelatedInputModalInstance() {
            return DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.EditRelatedInputModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-related-input-modal right",
                scope: $scope,
                template: `<div ng-include src="'editRelatedInput'"></div>`
            });
        }

        function CloseEditRelatedInputModal() {
            DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.EditRelatedInputModal.dismiss('cancel');

            if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput && DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput != '' && DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput != ' ') {
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput = JSON.parse(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput);
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput = JSON.stringify(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput, undefined, 2);
            }
        }

        function OnEditRelatedInput() {
            if (!DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInputGroup) {
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInputGroup = [];
            }

            if (DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput) {
                if (typeof DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput == "string") {
                    DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInputGroup = JSON.parse(DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInput);
                }
            } else {
                DataExtIntegrationCtrl.ePage.Masters.DataExtIntegration.DataExtIntegrationFields.ActiveDataExtIntegrationFields.RelatedInputGroup = [];
            }

            EditRelatedInputModalInstance().result.then(function (response) { }, function () {
                CloseEditRelatedInputModal();
            });
        }

        Init();
    }
})();