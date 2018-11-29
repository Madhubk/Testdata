(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DataExtEntityScoreController", DataExtEntityScoreController);

    DataExtEntityScoreController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function DataExtEntityScoreController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        /* jshint validthis: true */
        var DataExtEntityScoreCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            DataExtEntityScoreCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_DataExtEntityScore",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DataExtEntityScoreCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            DataExtEntityScoreCtrl.ePage.Masters.emptyText = "-";

            try {
                DataExtEntityScoreCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (DataExtEntityScoreCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitDataExtEntityScore();
                    InitDataExtEntityScoreFields();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            DataExtEntityScoreCtrl.ePage.Masters.Breadcrumb = {};
            DataExtEntityScoreCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = " (Entity Score)";

            DataExtEntityScoreCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": DataExtEntityScoreCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtEntityScoreCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtEntityScoreCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "DataExtEntityScore",
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
            DataExtEntityScoreCtrl.ePage.Masters.Application = {};
            DataExtEntityScoreCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            DataExtEntityScoreCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!DataExtEntityScoreCtrl.ePage.Masters.Application.ActiveApplication) {
                DataExtEntityScoreCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": DataExtEntityScoreCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DataExtEntityScoreCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DataExtEntityScoreCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetDataExtEntityScoreList();
        }


        function InitDataExtEntityScore() {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore = {};

            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.CloseDataExtEntityScoreModal = CloseDataExtEntityScoreModal;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.AddNew = AddNewDataExtEntityScore;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.Edit = EditDataExtEntityScore;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.Save = SaveDataExtEntityScore;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.Delete = DeleteDataExtEntityScoreConfirmation;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.OnDataExtEntityScoreClick = OnDataExtEntityScoreClick;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.OpenJsonModal = OpenJsonModal;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.GetTargetTableList = GetTargetTableList;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.OnTargetTableSelect = OnTargetTableSelect;

            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.SaveBtnText = "OK";
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.IsDisableSaveBtn = false;

            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DeleteBtnText = "Delete";
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.IsDisableDeleteBtn = false;
        }

        function GetDataExtEntityScoreList() {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList = undefined;
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": DataExtEntityScoreCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": DataExtEntityScoreCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "ConfigType": "EntityScore"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfig.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList = response.data.Response;

                    if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList.length > 0) {
                        OnDataExtEntityScoreClick(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList[0]);
                    } else {
                        OnDataExtEntityScoreClick();
                    }
                } else {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList = [];
                    OnDataExtEntityScoreClick();
                }
            });
        }

        function OnDataExtEntityScoreClick($item) {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore = angular.copy($item);
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScoreCopy = angular.copy($item);

            if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore) {
                GetDataExtEntityScoreFieldsList();
                GetFieldList();
            }
        }

        function AddNewDataExtEntityScore() {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore = {
                ConfigType: "EntityScore"
            };

            EditDataExtEntityScore();
        }

        function EditDataExtEntityScoreModalInstance() {
            return DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.EditDataExtEntityScoreModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dataExtEntityScoreEdit'"></div>`
            });
        }

        function EditDataExtEntityScore() {
            if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.PK) {
                if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.UIEntityName) {
                    var _obj = {
                        Name: DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.UIEntityName
                    };
                    GetTargetFieldList(_obj);
                }
            }
            EditDataExtEntityScoreModalInstance().result.then(function (response) { }, function () {
                CloseDataExtEntityScoreModal();
            });
        }

        function CloseDataExtEntityScoreModal() {
            if (!DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore) {
                if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList.length > 0) {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore = angular.copy(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList[0]);
                } else {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore = undefined;
                }
            } else if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScoreCopy) {
                var _index = DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScoreCopy.PK);

                if (_index !== -1) {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore = angular.copy(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList[_index]);
                }
            }

            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.EditDataExtEntityScoreModal.dismiss('cancel');
        }

        function DeleteDataExtEntityScoreConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteDataExtEntityScore();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteDataExtEntityScore() {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DeleteBtnText = "Please Wait...";
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.IsDisableDeleteBtn = true;

            var _input = angular.copy(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.PK);

                    if (_index !== -1) {
                        DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList.splice(_index, 1);
                        if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList.length > 0) {
                            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore = angular.copy(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList[0]);
                        } else {
                            OnDataExtEntityScoreClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DeleteBtnText = "Delete";
                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal() {
            var _attributeJson = DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.Fields;
            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    if (typeof JSON.parse(_attributeJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.Fields
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.Fields = result;
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
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.ClassSource = $item.Name;
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
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.TargetFieldList = response.data.Response;

                } else {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.TargetFieldList = [];
                }
            });
        }

        function SaveDataExtEntityScore() {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.SaveBtnText = "Please Wait...";
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.IsDisableSaveBtn = true;

            var _input = angular.copy(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore);

            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.AppCode = DataExtEntityScoreCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.SAP_FK = DataExtEntityScoreCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.IsModified = true;
            _input.IsDeleted = false;
            _input.ConfigType = "EntityScore";

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore = angular.copy(_response);
                    var _index = DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList.push(_response);
                    } else {
                        DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreList[_index] = _response;
                    }

                    OnDataExtEntityScoreClick(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore);
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.SaveBtnText = "OK";
                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.IsDisableSaveBtn = false;
                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.EditDataExtEntityScoreModal.dismiss('cancel');
            });
        }


        // *** Entity Score Fields *** //
        function InitDataExtEntityScoreFields() {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields = {};
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.AddNewField = AddNewField;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.Close = CloseDataExtEntityScoreFields;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.OnDataExtEntityScoreFieldsClick = OnDataExtEntityScoreFieldsClick;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.Save = DataExtEntityScoreFieldsSave;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.Delete = DeleteConfirmation;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.EditDataExtEntityScoreField = EditDataExtEntityScoreField;

            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.SaveBtnText = "OK";
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.IsDisableSaveBtn = false;

            InitExpression();
        }

        function GetDataExtEntityScoreFieldsList() {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ListSource = undefined;
            var _filter = {
                "DAC_ConfigType": "EntityScore",
                "DAC_FK": DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ListSource = response.data.Response;
                    if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ListSource.length > 0) {
                        OnDataExtEntityScoreFieldsClick(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ListSource[0]);

                    } else {
                        OnDataExtEntityScoreFieldsClick();
                    }

                } else {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ListSource = [];
                    OnDataExtEntityScoreFieldsClick();
                }
            });
        }

        function OnDataExtEntityScoreFieldsClick($item) {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields = angular.copy($item);
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFieldsCopy = angular.copy($item);
        }

        function AddNewField(type) {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields = {
                DAC_FK: DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.PK,
                DAC_ConfigType: "EntityScore",
                ExpressionType: "GENERAL",
                EntitySource: "GENERAL",
                EntityRefCode: "General",
                ItemType: "Main"
            };

            EditDataExtEntityScoreFieldsModalInstance().result.then(function (response) { }, function () { });
        }

        function GetFieldList() {
            var _filter = {
                "TableName": DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.ActiveDataExtEntityScore.ClassSource,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.FieldList = response.data.Response;
                } else {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.FieldList = [];
                }
            });
        }

        function EditDataExtEntityScoreFieldsModalInstance() {
            return DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'DataExtEntityScoreFieldsEdit'"></div>`
            });
        }

        function CloseDataExtEntityScoreFields() {
           DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.EditModal.dismiss('cancel');
        }

        function DataExtEntityScoreFieldsSave() {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.SaveBtnText = "Please Wait...";
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.IsDisableSaveBtn = true;

            var _input = angular.copy(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields);
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.PK) {
                            var _index = DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ListSource.map(function (value, key) {
                                return value.PK;
                            }).indexOf(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.PK);

                            if (_index !== -1) {
                                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ListSource[_index] = response.data.Response[0];
                            }
                        } else {
                            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ListSource.push(response.data.Response[0]);
                        }

                        DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields = undefined;
                        CloseDataExtEntityScoreFields();
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.SaveBtnText = "Save";
                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.IsDisableSaveBtn = false;
            });
        }
    

        function EditDataExtEntityScoreField($item) {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields = angular.copy($item);

            EditDataExtEntityScoreFieldsModalInstance().result.then(function (response) { }, function () { });
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
    

        function Delete(item){
            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Delete.Url + DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    toastr.success("Record Deleted Successfully");
                    OnDataExtEntityScoreFieldsClick(item);

                } else {
                    toastr.error("Could not Delete")
                }
            });
        }

        // ====== Edit Expression =========== //

        function InitExpression() {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.Expression = {};
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.Expression.ItemTypeList = ["Segment"];
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.Expression.ExpressionTypeList = ["GENERAL", "EXPRESSION"];
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.Expression.OnEditExpression = OnEditExpression;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.Expression.CloseEditExpressionModal = CloseEditExpressionModal;
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.Expression.PrepareExpression = PrepareExpression;
        }

        function EditExpressionModalInstance() {
            return DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.EditExpressionModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-expression-modal right",
                scope: $scope,
                template: `<div ng-include src="'editExpression'"></div>`
            });
        }

        function CloseEditExpressionModal() {
            DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.EditExpressionModal.dismiss('cancel');

            if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression && DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression != '' && DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression != ' ') {
                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression = JSON.parse(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression);
                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression = JSON.stringify(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression, undefined, 2);
            }
        }

        function OnEditExpression() {
            if (!DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.ExpressionGroup) {
                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.ExpressionGroup = [];
            }
            if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression) {
                if (typeof DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression == "string") {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.ExpressionGroup = JSON.parse(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression);
                }
            } else {
                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.ExpressionGroup = [];
            }

            EditExpressionModalInstance().result.then(function (response) { }, function () {
                CloseEditExpressionModal();
            });
        }

        function PrepareExpression() {
            if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.ExpressionGroup) {
                if (DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.ExpressionGroup.length > 0) {
                    var _Group = angular.copy(DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.ExpressionGroup);

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
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression = _Group;
                } else {
                    DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression = "[]";
                }
            } else {
                DataExtEntityScoreCtrl.ePage.Masters.DataExtEntityScore.DataExtEntityScoreFields.ActiveDataExtEntityScoreFields.Expression = "[]";
            }

            CloseEditExpressionModal();
        }

        Init();
    }
})();
